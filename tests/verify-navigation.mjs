// Test the actual prerendered React tree in a DOM; no network or browser needed.
import { Window } from "happy-dom";
import { act } from "react";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const output = path.resolve(import.meta.dir, "../build");
if (!process.argv[2]) {
    const { build } = await import("vite");
    await build({
        root: path.resolve(import.meta.dir, ".."),
        publicDir: false,
        logLevel: "warn",
        build: {
            outDir: path.join(import.meta.dir, ".generated"),
            emptyOutDir: true,
            manifest: false,
            ssr: "tests/entry-navigation.ts",
            rollupOptions: { output: { entryFileNames: "entry-navigation.mjs" } },
        },
    });
    for (const url of ["/", "/gallery/", "/thoughts/001/#architecture", "/thoughts/002/", "/unlisted_brainfuck/", "/video_self_ad/", "/missing/"]) {
        // Separate realms match real document visits and isolate libraries' window caches.
        const child = Bun.spawn([process.execPath, import.meta.filename, url], { stdout: "inherit", stderr: "inherit" });
        const result = await child.exited;
        if (result !== 0) process.exit(result);
    }
    console.log("[static] DOM checks passed: hydration, automatic preloading, cached navigation, history, anchors, and silent media.");
    process.exit(0);
}
const errors = [];
let scroll = [0, 0];
let fragment = "";
let window;
let app;
let runtime;

function installWindow(url) {
    window = new Window({
        url: "https://nevolodia.com" + url,
        settings: {
            disableJavaScriptFileLoading: true,
            enableCSSFileLoading: false,
            enableImageFileLoading: false,
            enableIframePageLoading: false,
            navigation: { disableMainFrameNavigation: true, disableFallbackToSetURL: true },
        },
    });
    for (const key of [
        "document", "navigator", "Element", "HTMLElement", "Node", "Document", "DocumentFragment",
        "HTMLMediaElement", "HTMLVideoElement", "HTMLAudioElement", "HTMLIFrameElement", "HTMLImageElement",
        "HTMLDialogElement", "Image", "CustomEvent", "Event", "MouseEvent", "MutationObserver", "ResizeObserver",
        "IntersectionObserver", "DOMException", "ShadowRoot", "screen",
    ]) {
        if (window[key]) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value: window[key] });
    }
    globalThis.window = window;
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
    globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
    globalThis.getComputedStyle = window.getComputedStyle.bind(window);
    Object.defineProperty(window.document, "fonts", { value: { load: async () => [], ready: Promise.resolve() }, configurable: true });
    Object.defineProperty(window.document, "readyState", { get: () => "loading", configurable: true });
    Object.defineProperty(window, "scrollX", { get: () => scroll[0], configurable: true });
    Object.defineProperty(window, "scrollY", { get: () => scroll[1], configurable: true });
    window.scrollTo = (x, y) => { scroll = [x, y]; };
    window.HTMLElement.prototype.scrollIntoView = function () { fragment = this.id; };
    // Happy DOM's stub returns void; the standard remote-playback API returns a Promise.
    const remote = window.document.createElement("video").remote;
    if (remote) Object.getPrototypeOf(remote).cancelWatchAvailability = async () => {};
    scroll = [0, 0];
    fragment = "";
}

async function settle() {
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 30)); });
}

async function mount(url) {
    installWindow(url);
    if (!runtime) {
        runtime = await import("./.generated/entry-navigation.mjs");
    }
    const pathname = new URL(url, "https://nevolodia.com").pathname;
    const route = runtime.ROUTES.find(route => route.path === pathname) || runtime.NOT_FOUND;
    const filename = route.id === "not-found" ? "404.html" : route.path.slice(1) + "index.html";
    const html = await readFile(path.join(output, filename), "utf8");
    // Happy DOM's HTML parser drops SVG contents after an inline <style>.
    // Parse those valid SVGs as XML, which preserves the browser's actual tree.
    const svgs = [];
    window.document.write(html.replace(/<svg\b[\s\S]*?<\/svg>/g, svg => {
        const index = svgs.push(svg) - 1;
        return `<svg data-test-svg="${index}"></svg>`;
    }));
    for (const element of window.document.querySelectorAll("[data-test-svg]")) {
        const svg = new window.DOMParser().parseFromString(svgs[Number(element.getAttribute("data-test-svg"))], "image/svg+xml");
        element.replaceWith(window.document.importNode(svg.documentElement, true));
    }
    const container = window.document.getElementById("root");
    const firstNode = container.firstChild;
    const { Page } = await runtime.loadRoute(route);
    await act(async () => {
        app = runtime.start(Page, {
            onRecoverableError(error) { errors.push(error); },
        });
        assert.ok(app, "the entry must start the app directly");
        assert.equal(typeof app.then, "undefined", "startup must not return a loading Promise");
    });
    assert.equal(container.firstChild === firstNode, true, "hydration must retain existing DOM");
    assert.equal(errors.length, 0, "hydration must not recover by replacing the tree");
    return container;
}

async function click(selector, modifiers = {}) {
    const anchor = window.document.querySelector(selector);
    assert.ok(anchor, `Missing link: ${selector}`);
    const event = new window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...modifiers });
    await act(async () => { anchor.dispatchEvent(event); });
    await settle();
    return event.defaultPrevented;
}

async function unmount() {
    await act(async () => { app.unmount(); });
    await window.happyDOM.close();
}

try {
    if (process.argv[2] === "/") {
    // Delaying load proves warm-up does not compete with the visible page.
    await mount("/");
    assert.equal(window.document.querySelectorAll("[data-page]").length, 1);
    await act(async () => { window.dispatchEvent(new window.Event("load")); });
    for (let attempt = 0; attempt < 30 && window.document.querySelectorAll("[data-page]").length < 7; attempt++) await settle();
    assert.equal(window.document.querySelectorAll("[data-page]").length, 7, "all public pages must render automatically after load");
    assert.equal(window.document.querySelectorAll("iframe[src^='https:']").length, 0, "unlisted embeds must not warm");
    const hiddenArticle = window.document.querySelector('[data-page="thought-001"]');
    assert.equal(hiddenArticle.style.display, "none");
    for (const media of hiddenArticle.querySelectorAll("video, audio")) {
        assert.equal(media.paused, true, "preparing a page must not start playback");
        assert.equal(media.preload, "none", "hidden media must not buffer automatically");
    }
    const cachedEducation = window.document.querySelector('[data-page="education"]');
    scroll = [0, 375];
    const educationLink = window.document.querySelector('.menu a[href="/education/"]');
    const historyLength = window.history.length;
    await act(async () => {
        educationLink.dispatchEvent(new window.MouseEvent("mousedown", { bubbles: true, cancelable: true, button: 0 }));
        assert.equal(window.location.pathname, "/education/", "a prepared route must navigate on press, without yielding to a Promise");
    });
    await act(async () => {
        const release = new window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0, detail: 1 });
        educationLink.dispatchEvent(release);
        assert.equal(release.defaultPrevented, true, "release must not reload the document");
    });
    assert.equal(window.history.length, historyLength + 1, "press and release must create just one history entry");
    assert.equal(await click('.menu a[href="/education/"]'), true);
    assert.equal(window.location.pathname, "/education/");
    assert.equal(cachedEducation.style.display, "block");
    assert.equal(window.document.querySelector('[data-page="education"]'), cachedEducation);
    assert.equal(window.document.title, "Academics");
    assert.deepEqual(scroll, [0, 0]);
    await act(async () => { window.history.back(); });
    await settle();
    assert.equal(window.location.pathname, "/");
    assert.equal(window.document.querySelector('[data-page="home"]').style.display, "block");
    assert.deepEqual(scroll, [0, 375], "Back must restore scroll");
    await act(async () => { window.history.forward(); });
    await settle();
    assert.equal(window.location.pathname, "/education/");
    assert.equal(window.document.querySelector('[data-page="education"]'), cachedEducation);
    assert.equal(await click('.menu a[href="/gallery/"]', { ctrlKey: true }), false, "modified clicks must stay native");
    assert.equal(window.location.pathname, "/education/");
    await click('a[href="/thoughts/001/"]');
    assert.equal(hiddenArticle.style.display, "block");
    assert.equal(window.document.querySelector('[data-page="thought-001"]'), hiddenArticle);
    const narration = hiddenArticle.querySelector('audio[src$="media_audio_67.mp3"]');
    const ambient = hiddenArticle.querySelector('audio[src$="media_autio_69.mp3"]');
    assert.ok(hiddenArticle.querySelector(".thought-ambient-toggle").textContent.includes("On"), "ambient must default to On");
    assert.equal(ambient.volume, 0.06732);
    Object.defineProperty(narration, "readyState", { get: () => 3, configurable: true });
    Object.defineProperty(ambient, "duration", { get: () => 180, configurable: true });
    await act(async () => { narration.currentTime = 367; await narration.play(); });
    assert.equal(ambient.paused, false, "default ambient must start with narration");
    assert.equal(ambient.currentTime, 7, "ambient must align to the narration clock");
    await act(async () => {
        narration.playbackRate = 1.42;
        // Happy DOM does not emit the native ratechange event for this setter.
        narration.dispatchEvent(new window.Event("ratechange"));
    });
    assert.equal(ambient.playbackRate, 1.42);
    await click(".thought-ambient-toggle");
    assert.equal(ambient.paused, true, "ambient toggle must still turn it off");
    await click(".thought-ambient-toggle");
    assert.equal(ambient.paused, false);
    await click('a[href="#architecture"]');
    assert.equal(window.location.hash, "#architecture");
    assert.equal(fragment, "architecture");
    await click('.menu a[href="/contact/"]');
    for (const media of hiddenArticle.querySelectorAll("video, audio")) assert.equal(media.paused, true);
    assert.equal(errors.length, 0);
    await unmount();
    } else {
    // Direct entry checks catch differing IDs or initial tree shapes in complex pages.
        const url = process.argv[2];
        await mount(url);
        if (url.includes("#architecture")) assert.equal(fragment, "architecture");
        if (url.startsWith("/unlisted_") || url === "/video_self_ad/" || url === "/missing/") {
            assert.equal(window.document.querySelector('meta[name="robots"]').content, "noindex, nofollow, noarchive");
            await click('.menu a[href="/contact/"]');
            assert.equal(window.document.querySelector('meta[name="robots"]').content, "index, follow");
            assert.equal(window.document.querySelectorAll("iframe").length, 0, "leaving an unlisted page must remove its embed");
        }
        await unmount();
    }
    console.log(`[dom] Passed ${process.argv[2]}`);
} catch (error) {
    console.error(error);
    process.exitCode = 1;
    if (app) { try { await act(async () => app.unmount()); } catch {} }
    if (window) await window.happyDOM.close();
}
