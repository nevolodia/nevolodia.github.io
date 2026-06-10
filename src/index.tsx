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

// The two faces above are used ONLY by Thoughts posts, and @font-face alone
// does not download anything — browsers fetch a font the first time text
// uses it (which would mean a visible swap on the first Thoughts open).
// So: once the page has fully loaded and the browser is idle, force-fetch
// them. They stay off the critical path but are always warm in cache by the
// time anyone opens Thoughts.
function warmThoughtsFonts() {
	const fetchFonts = () => {
		document.fonts.load('1em "Abril Fatface"');
		document.fonts.load('1em Roboto');
	};
	const whenIdle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500));
	if (document.readyState === 'complete') {
		whenIdle(fetchFonts);
	} else {
		window.addEventListener('load', () => whenIdle(fetchFonts), { once: true });
	}
}
warmThoughtsFonts();

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
