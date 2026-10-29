import { createElement, type ComponentType } from "react";
import { ROUTES, NOT_FOUND, type Route } from "./route-urls";
import type { Post } from "./resources/thoughts/types";


type PageModule = { default: ComponentType };
type LoadedPage = { Page: ComponentType; modules: string[] };

async function loadThought(post: Promise<{ default: Post }>): Promise<PageModule>
{
	const [detail, article] = await Promise.all([import("./pages/thought-detail"), post]);

	return { default: () => createElement(detail.default, { post: article.default }) };
}

const loaders: Record<string, () => Promise<PageModule>> = {
	home: () => import("./pages/home"),
	education: () => import("./pages/education"),
	thoughts: () => import("./pages/thoughts"),
	gallery: () => import("./pages/gallery"),
	contact: () => import("./pages/contact"),
	"thought-001": () => loadThought(import("./resources/thoughts/001")),
	"thought-002": () => loadThought(import("./resources/thoughts/002")),
	unlisted_brainfuck: () => import("./pages/unlisted_brainfuck"),
	video_self_ad: () => import("./pages/video_self_ad"),
	"not-found": () => import("./pages/not-found"),
};

const pending = new Map<string, Promise<LoadedPage>>();

function loadedPage(route: Route, Page: ComponentType): LoadedPage
{
	const modules = route.id.startsWith("thought-")
		? ["src/pages/thought-detail.tsx", `src/resources/thoughts/${route.id.slice("thought-".length)}.tsx`]
		: [`src/pages/${route.id}.tsx`];

	return { Page, modules };
}

export function seedRoute(route: Route, Page: ComponentType)
{
	pending.set(route.id, Promise.resolve(loadedPage(route, Page)));
}

export function loadRoute(route: Route): Promise<LoadedPage>
{
	let request = pending.get(route.id);

	if (!request)
	{
		request = loaders[route.id]()
			.then(module => loadedPage(route, module.default))
			.catch(error =>
			{
				pending.delete(route.id);
				throw error;
			});

		pending.set(route.id, request);
	}

	return request;
}

export { ROUTES, NOT_FOUND };
