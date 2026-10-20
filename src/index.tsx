import React, { type ComponentType } from "react";
import ReactDOM, { type HydrationOptions } from "react-dom/client";
import Main from "./pages/_main";
import { canonicalHref, getRoute, LEGACY_PAGES } from "./route-urls";
import { seedRoute } from "./routes";
import "@fontsource/abril-fatface/latin-400.css";
import "@fontsource/roboto/latin-400.css";
import "./css/background-animation.css";
import "./css/index.css";


export function start(Page: ComponentType, options?: HydrationOptions)
{
	const target = canonicalHref(window.location.href, LEGACY_PAGES);
	const current = window.location.pathname + window.location.search + window.location.hash;

	if (target !== current)
	{
		window.location.replace(target);
		return;
	}

	const route = getRoute(window.location.pathname);
	seedRoute(route, Page);

	const container = document.getElementById("root")!;
	const app = (
		<React.StrictMode>
			<Main initialRoute={route} initialPage={Page} />
		</React.StrictMode>
	);

	if (container.hasChildNodes())
	{
		return ReactDOM.hydrateRoot(container, app, options);
	}

	const root = ReactDOM.createRoot(container);
	root.render(app);
	return root;
}
