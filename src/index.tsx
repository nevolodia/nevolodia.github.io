import React from 'react';
import ReactDOM from 'react-dom/client';
import _main from './pages/_main';

// Critical fonts (Roboto Mono 400 body face + Space Mono 400 headline/nav) are
// self-hosted in public/fonts/, PRELOADED, and declared via an inline <style>
// in public/index.html together with metric-matched fallback faces — the CLS
// fix. They are intentionally NOT imported here (the bundled css would race
// the preloaded declarations). Non-critical fonts stay on fontsource.
import '@fontsource/abril-fatface/latin-400.css';
import '@fontsource/roboto/latin-400.css';

// Styles
import './css/background-animation.css';
import './css/index.css';


const container = document.getElementById('root') as HTMLElement;
const app = (
	<React.StrictMode>
		<_main />
	</React.StrictMode>
);

// The production build prerenders the home page into #root (see
// scripts/prerender-home.mjs): hydrate the existing markup instead of
// rebuilding it. In dev (empty #root) render normally.
if (container.hasChildNodes()) {
	ReactDOM.hydrateRoot(container, app);
} else {
	ReactDOM.createRoot(container).render(app);
}
