import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { ROUTES, NOT_FOUND, SITE_URL, LEGACY_PAGES, canonicalHref } from "../src/route-urls.ts";
import { clientEntry } from "../scripts/page-entries.mjs";
import { routeAssets } from "../scripts/static-assets.mjs";

const output = path.resolve(import.meta.dir, "../build");
const manifest = JSON.parse(await readFile(path.join(output, ".vite/manifest.json"), "utf8"));
let checkedLinks = 0;
for (const route of [...ROUTES, NOT_FOUND]) {
    const filename = route === NOT_FOUND ? "404.html" : route.path.slice(1) + "index.html";
    const html = await readFile(path.join(output, filename), "utf8");
    const entry = clientEntry(manifest, route);
    const startup = [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)].map(match => match[1]);
    if (startup.length !== 1 || !startup[0].includes(`from "/${entry.chunk.file}"`) || !startup[0].includes("start(Page)")) throw new Error(`Wrong direct startup: ${route.path}`);
    const client = await import(path.join(output, entry.chunk.file));
    if (typeof client.Page !== "function" || typeof client.start !== "function") throw new Error(`Missing compiled entry exports: ${route.path}`);
    for (const script of routeAssets(manifest, [entry.key]).scripts) {
        if (!html.includes(`href="/${script}"`)) throw new Error(`Startup dependency is not preloaded: ${script}`);
    }
    const pages = [];
    const ids = new Set();
    const references = [];
    const metadata = new Map();
    let title = "";
    await new HTMLRewriter()
        .on("[data-page]", { element(element) { pages.push({ id: element.getAttribute("data-page"), style: element.getAttribute("style") }); } })
        .on("[id]", { element(element) { ids.add(element.getAttribute("id")); } })
        .on("title", { text(chunk) { title += chunk.text; } })
        .on("meta", { element(element) { metadata.set(element.getAttribute("name") || element.getAttribute("property"), element.getAttribute("content")); } })
        .on("[src]", { element(element) { references.push(element.getAttribute("src")); } })
        .on("a[href], link[rel=stylesheet], link[rel=modulepreload]", { element(element) { references.push(element.getAttribute("href")); } })
        .transform(new Response(html)).text();
    if (pages.length !== 1 || pages[0].id !== route.id || !pages[0].style.includes("block")) throw new Error(`Wrong static body for ${route.path}`);
    if (title !== route.title || metadata.get("description") !== route.description) throw new Error(`Wrong metadata for ${route.path}`);
    if (route.unlisted && metadata.get("robots") !== "noindex, nofollow, noarchive") throw new Error(`Missing noindex: ${route.path}`);
    if (!route.unlisted && metadata.get("robots") !== "index, follow") throw new Error(`Wrong indexing: ${route.path}`);
    if (html.includes('<div id="root"></div>') || html.includes("Switched to client rendering")) throw new Error(`Empty page: ${route.path}`);
    for (const reference of references) {
        if (!reference || reference.startsWith("data:")) continue;
        const url = new URL(reference, SITE_URL + route.path);
        if (url.origin !== SITE_URL) continue;
        if (url.pathname === route.path && url.hash) {
            if (!ids.has(decodeURIComponent(url.hash.slice(1)))) throw new Error(`Broken anchor: ${route.path}${url.hash}`);
        }
        const target = url.pathname.endsWith("/") ? url.pathname.slice(1) + "index.html" : url.pathname.slice(1);
        await access(path.join(output, target)).catch(() => { throw new Error(`Broken local reference in ${route.path}: ${reference}`); });
        checkedLinks++;
    }
    if (route.image && metadata.get("og:image") !== SITE_URL + route.image) throw new Error("Missing share image");
    if (route.id === "thought-001") {
        if (!/<audio[^>]*controls=""/.test(html) || !/<video[^>]*controls=""/.test(html)) throw new Error("Missing native media fallback");
        if (!html.includes('id="architecture"') || !html.includes('id="poster"')) throw new Error("Incomplete article");
    }
}
const sitemap = await readFile(path.join(output, "sitemap.xml"), "utf8");
const home = await readFile(path.join(output, "index.html"), "utf8");
const redirect = [...home.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]).find(script => script.includes("location.replace"));
if (!redirect) throw new Error("Missing legacy redirect script");
for (const name of Object.keys(LEGACY_PAGES)) {
    const href = `${SITE_URL}/?p=${name}#section`;
    let destination;
    new Function("location", redirect)({ href, pathname: "/", search: `?p=${name}`, hash: "#section", replace(value) { destination = value; } });
    if (destination !== canonicalHref(href, LEGACY_PAGES)) throw new Error(`Broken compiled redirect: ${name}`);
}
for (const route of ROUTES) {
    if (sitemap.includes(`<loc>${SITE_URL + route.path}</loc>`) === !!route.unlisted) throw new Error(`Incorrect sitemap entry: ${route.path}`);
}
console.log(`[static] Verified ${ROUTES.length + 1} documents and ${checkedLinks} local references.`);
