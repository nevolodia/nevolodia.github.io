import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compatibilityScript, MENU } from './src/route-urls';
import { routeHead } from './src/metadata';
import { pageEntriesPlugin } from './scripts/page-entries.mjs';

export default defineConfig({
	plugins: [react(), pageEntriesPlugin(), {
		name: 'static-page-template',
		transformIndexHtml(html) {
			return html.replace('<!--page-head-->', `<!--page-head-start-->${routeHead(MENU[0])}<!--page-head-end-->`)
				.replace('<!--compatibility-->', `<script>${compatibilityScript()}</script>`);
		},
	}],
	build: {
		// Keep CRA's output dir so deploy ("gh-pages -d build") and the
		// local preview ("bunx serve -l 4324 build") stay unchanged.
		outDir: 'build',
		manifest: true,
	},
	server: {
		port: 3000,
	},
});
