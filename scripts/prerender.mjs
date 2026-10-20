import { build } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { SITE_URL, LEGACY_PAGES } from "../src/route-urls.ts";
import { routeAssets } from "./static-assets.mjs";
import { clientEntry } from "./page-entries.mjs";


const root = path.resolve(import.meta.dir, "..");
const output = path.join(root, "build");
const templateFile = path.join(output, ".vite/static-template.html");
const manifest = JSON.parse(await readFile(path.join(output, ".vite/manifest.json"), "utf8"));
const headPattern = /<!--page-head-start-->[\s\S]*?<!--page-head-end-->/;
const rootMarker = '<div id="root"></div>';

// Save the original template so rerunning this script produces the same pages.
let template = await readFile(path.join(output, "index.html"), "utf8");
if (template.includes(rootMarker))
{
	await writeFile(templateFile, template);
}
else
{
	template = await readFile(templateFile, "utf8");
}

if (!headPattern.test(template) || !template.includes(rootMarker))
{
	throw new Error("Static HTML template markers are missing");
}

// Render-only modules stay outside the deployed directory.
await build({
	root,
	publicDir: false,
	logLevel: "warn",
	build: {
		outDir: path.join(root, ".ssg"),
		emptyOutDir: true,
		manifest: false,
		ssr: "src/entry-static.tsx",
		rollupOptions: { output: { entryFileNames: "entry-static.mjs" } },
	},
});

const { renderPages } = await import(path.join(root, ".ssg/entry-static.mjs"));
const documents = await renderPages();
if (new Set(documents.map(({ route }) => route.path)).size !== documents.length)
{
	throw new Error("Duplicate static routes");
}

// Inline shared CSS; replace Home's preloads with each page's own imports.
let base = template.replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, "");
const entryStyles = new Set();
for (const [tag, file] of template.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="\/([^"]+)"[^>]*>/g))
{
	entryStyles.add(file);
	const css = await readFile(path.join(output, file), "utf8");
	base = base.replace(tag, () => `<style>${css}</style>`);
}

async function writePage(filename, html)
{
	const file = path.join(output, filename);
	await mkdir(path.dirname(file), { recursive: true });
	await writeFile(file, html);
}

for (const { route, html, head, modules } of documents)
{
	if (!html || html.includes("Switched to client rendering"))
	{
		throw new Error(`Incomplete static render: ${route.path}`);
	}

	const entry = clientEntry(manifest, route);
	const assets = routeAssets(manifest, [entry.key]);
	for (const module of modules)
	{
		if (manifest[module] && !assets.scripts.includes(manifest[module].file))
		{
			throw new Error(`Initial component is not statically imported: ${module}`);
		}
	}

	const styles = assets.styles
		.filter(file => !entryStyles.has(file))
		.map(file => `<link rel="stylesheet" crossorigin href="/${file}">`);
	const scripts = assets.scripts.map(file => `<link rel="modulepreload" crossorigin href="/${file}">`);
	const pageHead = [head, ...styles, ...scripts].join("\n");
	const startup = `<script type="module">import {start,Page} from "/${entry.chunk.file}";start(Page);</script>`;
	const page = base
		.replace(headPattern, () => `<!--page-head-start-->${pageHead}<!--page-head-end-->`)
		.replace(/<script\b[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g, () => startup)
		.replace(rootMarker, () => `<div id="root">${html}</div>`);
	const filename = route.id === "not-found" ? "404.html" : route.path.slice(1) + "index.html";

	await writePage(filename, page);
	console.log(`[static] ${route.path} (${(html.length / 1024).toFixed(1)} kB markup)`);
}

for (const alias of ["unlisted_relagram", "unlisted_video_self_ad"])
{
	const destination = LEGACY_PAGES[alias];
	await writePage(`${alias}/index.html`, `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="robots" content="noindex, nofollow">
	<link rel="canonical" href="${SITE_URL}${destination}">
	<meta http-equiv="refresh" content="0;url=${destination}">
	<title>Redirecting</title>
</head>
<body>
	<a href="${destination}">Continue</a>
	<script>location.replace(${JSON.stringify(destination)} + location.search + location.hash)</script>
</body>
</html>`);
}

const locations = documents
	.filter(({ route }) => !route.unlisted)
	.map(({ route }) => `<url><loc>${SITE_URL}${route.path}</loc></url>`);

await writeFile(path.join(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locations.join("\n")}
</urlset>
`);
