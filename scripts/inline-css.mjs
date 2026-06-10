// scripts/inline-css.mjs
//
// Post-build (runs before prerender, see "postbuild"): inlines the entry
// stylesheet(s) into build/index.html, removing the render-blocking CSS
// round-trip — the prerendered home content can paint straight from the
// HTML. Lazy chunk CSS (gallery/thoughts) is untouched: it loads with its
// chunk. The .css files stay on disk; only the <link> tags are replaced.

import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BUILD = path.join(ROOT, 'build');
const INDEX = path.join(BUILD, 'index.html');

let html = await fs.readFile(INDEX, 'utf8');
const links = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g)];

let bytes = 0;
for (const [tag, href] of links) {
	const css = await fs.readFile(path.join(BUILD, href), 'utf8');
	html = html.replace(tag, `<style>${css}</style>`);
	bytes += css.length;
}

await fs.writeFile(INDEX, html);
console.log(`[inline-css] inlined ${links.length} stylesheet(s) (${(bytes / 1024).toFixed(1)} kB) into index.html`);
