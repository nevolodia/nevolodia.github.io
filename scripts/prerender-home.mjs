// scripts/prerender-home.mjs
//
// Post-build prerender of the home page (runs automatically via "postbuild").
// Serves build/ locally, loads "/" in headless Chrome, snapshots the rendered
// #root markup and injects it into build/index.html. The browser then paints
// the home content before any JS downloads; the normal bundle hydrates the
// existing DOM (see src/index.tsx) and the site continues as the same SPA.
//
// Chrome lookup order: $CHROME_PATH, the Playwright browser cache, then the
// system Chrome (GitHub Actions ubuntu runners ship google-chrome-stable).

import { chromium } from 'playwright-core';
import { promises as fs } from 'fs';
import { existsSync, readdirSync } from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BUILD = path.join(ROOT, 'build');
const INDEX = path.join(BUILD, 'index.html');
const ROOT_DIV = '<div id="root"></div>';

function findChrome() {
	const candidates = [];
	if (process.env.CHROME_PATH) candidates.push(process.env.CHROME_PATH);
	const cache = path.join(os.homedir(), '.cache', 'ms-playwright');
	if (existsSync(cache)) {
		for (const dir of readdirSync(cache)) {
			if (!dir.startsWith('chromium')) continue;
			candidates.push(
				path.join(cache, dir, 'chrome-linux64', 'chrome'),
				path.join(cache, dir, 'chrome-linux', 'chrome'),
			);
		}
	}
	candidates.push(
		'/usr/bin/google-chrome',
		'/usr/bin/google-chrome-stable',
		'/usr/bin/chromium-browser',
		'/usr/bin/chromium',
	);
	const found = candidates.find(existsSync);
	if (!found) throw new Error('[prerender] no Chrome/Chromium found (set CHROME_PATH)');
	return found;
}

const MIME = {
	'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
	'.json': 'application/json', '.woff2': 'font/woff2', '.avif': 'image/avif',
	'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
	'.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.txt': 'text/plain',
	'.pdf': 'application/pdf',
};

function serveBuild() {
	const server = http.createServer(async (req, res) => {
		try {
			const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
			let file = path.normalize(path.join(BUILD, urlPath));
			if (!file.startsWith(BUILD)) throw new Error('traversal');
			let data;
			try {
				data = await fs.readFile(file);
			} catch {
				file = INDEX; // SPA fallback
				data = await fs.readFile(file);
			}
			res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
			res.end(data);
		} catch {
			res.writeHead(404);
			res.end();
		}
	});
	return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const html = await fs.readFile(INDEX, 'utf8');
if (!html.includes(ROOT_DIV)) {
	// Already prerendered (or template changed) — make the script idempotent.
	console.log('[prerender] empty #root not found in build/index.html — skipping');
	process.exit(0);
}

const server = await serveBuild();
const port = server.address().port;

const browser = await chromium.launch({
	executablePath: findChrome(),
	// CI runners (GitHub Actions ubuntu images) restrict Chrome's sandbox;
	// local runs keep the sandbox on.
	args: process.env.CI ? ['--no-sandbox'] : [],
});
try {
	const page = await browser.newPage();
	await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
	// Home content = first <p> inside .main
	await page.waitForSelector('.main p', { timeout: 15000 });
	const rootHtml = await page.evaluate(() => {
		// The snapshot must equal the app's FIRST render for clean hydration.
		// Image.tsx renders a plain <picture> pre-mount and only wraps it in
		// react-medium-image-zoom (random ids, extra nodes) after mount — so
		// unwrap every zoom wrapper back to its bare <picture> here.
		for (const wrapper of document.querySelectorAll('#root [data-rmiz]')) {
			const picture = wrapper.querySelector('picture');
			if (picture) wrapper.replaceWith(picture);
		}
		return document.getElementById('root').innerHTML;
	});
	if (!rootHtml || rootHtml.length < 500) throw new Error('[prerender] suspiciously small snapshot');

	await fs.writeFile(INDEX, html.replace(ROOT_DIV, `<div id="root">${rootHtml}</div>`));
	console.log(`[prerender] home page prerendered into build/index.html (${(rootHtml.length / 1024).toFixed(1)} kB of markup)`);
} finally {
	await browser.close();
	server.close();
}
