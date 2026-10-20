import { ROUTES, NOT_FOUND, getRoute, canonicalHref, LEGACY_PAGES } from "../src/route-urls.ts";


function entryName(route)
{
	return `page-${route.id}`;
}

function entryUrl(route)
{
	return `/@page/${route.id}.tsx`;
}

function pageEntrySource(route)
{
	const start = 'export { start } from "/src/index.tsx";';

	if (route.id.startsWith("thought-"))
	{
		const number = route.id.slice("thought-".length);
		return `import { createElement } from "react";
import Detail from "/src/pages/thought-detail.tsx";
import post from "/src/resources/thoughts/${number}.tsx";
export const Page = () => createElement(Detail, { post });
${start}`;
	}

	return `export { default as Page } from "/src/pages/${route.id}.tsx";
${start}`;
}

export function clientEntry(manifest, route)
{
	const entry = Object.entries(manifest).find(([, chunk]) => chunk.isEntry && chunk.name === entryName(route));
	if (!entry)
	{
		throw new Error(`Missing direct client entry for ${route.path}`);
	}

	return { key: entry[0], chunk: entry[1] };
}

// Each page imports its first component directly, without starting other pages.
export function pageEntriesPlugin()
{
	const routes = [...ROUTES, NOT_FOUND];
	const entries = new Map(routes.map(route => [entryUrl(route), route]));

	return {
		name: "direct-page-entries",

		config(config, { command })
		{
			if (command !== "build" || config.build?.ssr)
			{
				return;
			}

			return {
				build: {
					rollupOptions: {
						// Keep Page/start exports available to each HTML document.
						preserveEntrySignatures: "strict",
						input: {
							index: "index.html",
							...Object.fromEntries(routes.map(route => [entryName(route), entryUrl(route)])),
						},
					},
				},
			};
		},

		resolveId(id)
		{
			if (entries.has(id))
			{
				return "\0" + id;
			}
		},

		load(id)
		{
			if (id.startsWith("\0"))
			{
				const route = entries.get(id.slice(1));
				if (route)
				{
					return pageEntrySource(route);
				}
			}
		},

		transformIndexHtml: {
			order: "pre",
			handler(html, context)
			{
				const url = new URL(context.originalUrl || context.path, "http://localhost");
				const target = new URL(canonicalHref(url.href, LEGACY_PAGES), url.origin);
				const route = getRoute(target.pathname);

				return html.replace(
					'<script type="module" src="/src/index.tsx"></script>',
					`<script type="module">import { start, Page } from "${entryUrl(route)}";start(Page);</script>`,
				);
			},
		},
	};
}
