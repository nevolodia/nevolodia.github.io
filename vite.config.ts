import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	build: {
		// Keep CRA's output dir so deploy ("gh-pages -d build") and the
		// local preview ("bunx serve -l 4324 build") stay unchanged.
		outDir: 'build',
	},
	server: {
		port: 3000,
	},
});
