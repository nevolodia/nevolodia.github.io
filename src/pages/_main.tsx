import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, MouseEvent } from "react";
import Link from "../components/Link";
import { NavigationContext, PageActiveContext } from "../navigation";
import { getRoute, MENU, NOT_FOUND, ROUTES, type Route } from "../route-urls";
import { loadRoute } from "../routes";
import { updateMetadata } from "../metadata";
import "../css/main.css";


type CachedPage = { route: Route; Page: ComponentType };
type Position = [number, number];
type Selection = { route: Route; href: string; position?: Position; initial?: boolean };

const PageView = memo(function PageView({ route, Page, active }: CachedPage & { active: boolean })
{
	return (
		<div data-page={route.id} style={{ display: active ? "block" : "none" }}>
			<PageActiveContext.Provider value={active}>
				<Page />
			</PageActiveContext.Provider>
		</div>
	);
});

let entrySequence = 0;
const entryKey = () => `${Date.now()}-${++entrySequence}`;

function Main({ initialRoute, initialPage }: { initialRoute: Route; initialPage: ComponentType })
{
	const [selection, setSelection] = useState<Selection>({ route: initialRoute, href: initialRoute.path, initial: true });
	const [pages, setPages] = useState<CachedPage[]>([{ route: initialRoute, Page: initialPage }]);
	const cached = useRef(new Set([initialRoute.id]));
	const mounted = useRef(false);
	const requestId = useRef(0);
	const currentEntry = useRef("");
	const positions = useRef(new Map<string, Position>());

	const prepareRoute = useCallback(async (route: Route, preparedPage?: ComponentType) =>
	{
		if (cached.current.has(route.id))
		{
			return;
		}

		const Page = preparedPage || (await loadRoute(route)).Page;
		if (!mounted.current || cached.current.has(route.id))
		{
			return;
		}

		cached.current.add(route.id);
		setPages(previous => [...previous, { route, Page }]);
	}, []);

	const show = useCallback((url: URL, historyNavigation = false) =>
	{
		const request = ++requestId.current;
		const route = getRoute(url.pathname);
		const href = url.pathname + url.search + url.hash;

		const commit = () =>
		{
			if (!mounted.current || requestId.current !== request)
			{
				return;
			}

			positions.current.set(currentEntry.current, [window.scrollX, window.scrollY]);
			let position: Position | undefined;

			if (historyNavigation)
			{
				currentEntry.current = window.history.state?.siteEntry || entryKey();
				position = positions.current.get(currentEntry.current);

				if (!window.history.state?.siteEntry)
				{
					window.history.replaceState({ ...window.history.state, siteEntry: currentEntry.current }, "");
				}
			}
			else if (href !== window.location.pathname + window.location.search + window.location.hash)
			{
				currentEntry.current = entryKey();
				window.history.pushState({ siteEntry: currentEntry.current }, "", href);
			}

			setSelection({ route, href, position });
		};

		// Cached pages switch immediately, without waiting for a Promise.
		if (cached.current.has(route.id))
		{
			commit();
			return;
		}

		prepareRoute(route).then(commit).catch(error =>
		{
			console.error("Page preparation failed; opening its static document.", error);
			if (requestId.current === request)
			{
				window.location.assign(url.href);
			}
		});
	}, [prepareRoute]);

	useLayoutEffect(() =>
	{
		mounted.current = true;
		currentEntry.current = window.history.state?.siteEntry || entryKey();
		window.history.replaceState({ ...window.history.state, siteEntry: currentEntry.current }, "");

		const previousRestoration = window.history.scrollRestoration;
		window.history.scrollRestoration = "manual";

		const onPopState = () => show(new URL(window.location.href), true);
		window.addEventListener("popstate", onPopState);

		return () =>
		{
			mounted.current = false;
			++requestId.current;
			window.history.scrollRestoration = previousRestoration;
			window.removeEventListener("popstate", onPopState);
		};
	}, [show]);

	useLayoutEffect(() =>
	{
		updateMetadata(selection.route);
		const url = new URL(selection.initial ? window.location.href : selection.href, window.location.origin);

		if (selection.position)
		{
			window.scrollTo(...selection.position);
		}
		else if (url.hash)
		{
			try
			{
				const id = decodeURIComponent(url.hash.slice(1));
				const page = document.querySelector(`[data-page="${selection.route.id}"]`);
				page?.querySelectorAll("[id]").forEach(element =>
				{
					if (element.id === id)
					{
						element.scrollIntoView();
					}
				});
			}
			catch
			{
				// Ignore malformed URL fragments.
			}
		}
		else if (!selection.initial)
		{
			window.scrollTo(0, 0);
		}
	}, [selection]);

	useEffect(() =>
	{
		let cancelled = false;

		const warm = async () =>
		{
			Promise.allSettled([document.fonts.load('1em "Abril Fatface"'), document.fonts.load("1em Roboto")]);

			// Download public pages together, then mount one per task.
			const requests = ROUTES.filter(route => !route.unlisted).map(route => ({
				route,
				loaded: loadRoute(route).catch(error =>
				{
					console.warn(`Could not preload ${route.path}`, error);
					return null;
				}),
			}));

			for (const { route, loaded } of requests)
			{
				const page = await loaded;
				if (cancelled)
				{
					return;
				}

				if (page)
				{
					await prepareRoute(route, page.Page);
				}

				await new Promise(resolve => window.setTimeout(resolve, 0));
			}
		};

		const start = () => { warm(); };
		if (document.readyState === "complete")
		{
			start();
		}
		else
		{
			window.addEventListener("load", start, { once: true });
		}

		return () =>
		{
			cancelled = true;
			window.removeEventListener("load", start);
		};
	}, [prepareRoute]);

	const navigation = useMemo(() => ({
		navigate: show,
		prepare: (url: URL) =>
		{
			const route = getRoute(url.pathname);
			if (url.origin === window.location.origin && route !== NOT_FOUND)
			{
				prepareRoute(route).catch(error => console.warn(`Could not preload ${route.path}`, error));
			}
		},
	}), [show, prepareRoute]);

	const handleAnchor = (event: MouseEvent<HTMLDivElement>) =>
	{
		if (event.defaultPrevented || event.button !== 0
			|| event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
		{
			return;
		}

		const anchor = (event.target as Element).closest("a");
		if (!anchor || anchor.target || anchor.hasAttribute("download"))
		{
			return;
		}

		const href = anchor.getAttribute("href");
		if (href?.startsWith("#"))
		{
			event.preventDefault();
			show(new URL(href, window.location.href));
		}
	};

	return (
		<NavigationContext.Provider value={navigation}>
			<div className="bg-grid">
				<div className="bg-grid-lines"></div>
			</div>
			<div className="bg-grid-mask"></div>

			<div className="everything-container">
				<div className="panel">
					<span className="panel-corner-bl"></span>
					<span className="panel-corner-br"></span>
					<h2 className="header-name">
						<span className="header-accent">Vladimir</span> Kirill Bickov
					</h2>

					<div className="panel-bar">
						<div className="menu">
							{MENU.map(route => (
								<Link key={route.id} link={route.path} active={selection.route.group === route.group}>
									{route.label}
								</Link>
							))}
						</div>
					</div>

					<div className="main" onClick={handleAnchor}>
						{pages
							.filter(page => !page.route.unlisted || page.route.id === selection.route.id)
							.map(page => (
								<PageView key={page.route.id} {...page} active={page.route.id === selection.route.id} />
							))}
					</div>
				</div>
			</div>
		</NavigationContext.Provider>
	);
}

export default Main;
