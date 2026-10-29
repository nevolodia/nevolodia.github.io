import { POSTS } from "./resources/thoughts/catalog";


export const SITE_URL = "https://nevolodia.com";

export type Route = {
	id: string;
	path: string;
	group: string;
	title: string;
	description: string;
	label?: string;
	unlisted?: boolean;
	image?: string;
};

export const MENU: Route[] = [
	{
		id: "home",
		path: "/",
		group: "home",
		label: "Home",
		title: "my website",
		description: "My personal website with some interesting info and posts",
	},
	{
		id: "education",
		path: "/education/",
		group: "education",
		label: "Portfolio",
		title: "Portfolio",
		description: "Education, research, and academic service by Vladimir Kirill Bickov.",
	},
	{
		id: "thoughts",
		path: "/thoughts/",
		group: "thoughts",
		label: "Thoughts",
		title: "Thoughts",
		description: "Articles and thoughts by Vladimir Kirill Bickov.",
	},
	{
		id: "gallery",
		path: "/gallery/",
		group: "gallery",
		label: "Gallery",
		title: "Gallery",
		description: "Photographs by Vladimir Kirill Bickov.",
	},
	{
		id: "contact",
		path: "/contact/",
		group: "contact",
		label: "Contact",
		title: "Contact",
		description: "Find Vladimir Kirill Bickov online.",
	},
];

export const NOT_FOUND: Route = {
	id: "not-found",
	path: "/404/",
	group: "",
	title: "Page not found",
	description: "This page could not be found.",
	unlisted: true,
};

export const ROUTES: Route[] = [
	...MENU,
	...POSTS.map(post => ({
		id: `thought-${post.number}`,
		path: `/thoughts/${post.number}/`,
		group: "thoughts",
		title: post.title,
		description: post.description,
		image: post.image,
	})),
	{
		id: "unlisted_brainfuck",
		path: "/unlisted_brainfuck/",
		group: "",
		title: "Brainfuck",
		description: "Brainfuck implementation.",
		unlisted: true,
	},
	{
		id: "video_self_ad",
		path: "/video_self_ad/",
		group: "",
		title: "video_self_ad",
		description: "Video.",
		unlisted: true,
	},
];

export const LEGACY_PAGES: Record<string, string> = Object.fromEntries([
	...MENU.map(route => [route.id, route.path]),
	["unlisted_relagram", "/thoughts/001/"],
	["unlisted_brainfuck", "/unlisted_brainfuck/"],
	["video_self_ad", "/video_self_ad/"],
	["unlisted_video_self_ad", "/video_self_ad/"],
]);

// Embedded in HTML too: keep this function self-contained.
export function canonicalHref(href: string, aliases: Record<string, string>): string
{
	const url = new URL(href);
	const page = url.searchParams.get("p");
	const isHome = url.pathname === "/" || url.pathname === "/index.html";

	if (isHome && page && Object.hasOwn(aliases, page))
	{
		url.pathname = aliases[page];
		const thought = url.searchParams.get("thought");

		if (page === "thoughts" && thought)
		{
			const number = Number(thought);
			const id = Number.isFinite(number) ? String(number).padStart(3, "0") : thought;
			url.pathname = `/thoughts/${encodeURIComponent(id)}/`;
		}

		url.searchParams.delete("p");
		url.searchParams.delete("thought");
	}

	if (/^\/(unlisted_relagram|unlisted_video_self_ad)\/?$/.test(url.pathname))
	{
		url.pathname = aliases[url.pathname.replaceAll("/", "")];
	}

	url.pathname = url.pathname.replace(/\/index\.html$/, "/");
	const lastSegment = url.pathname.slice(url.pathname.lastIndexOf("/") + 1);
	if (lastSegment && !lastSegment.includes("."))
	{
		url.pathname += "/";
	}

	return url.pathname + url.search + url.hash;
}

export function getRoute(pathname: string): Route
{
	return ROUTES.find(route => route.path === pathname) || NOT_FOUND;
}

export function compatibilityScript(): string
{
	return `(() => {
		const target = (${canonicalHref.toString()})(location.href, ${JSON.stringify(LEGACY_PAGES)});
		if (target !== location.pathname + location.search + location.hash) {
			location.replace(target);
		}
	})()`;
}
