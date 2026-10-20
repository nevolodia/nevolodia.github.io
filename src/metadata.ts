import { SITE_URL, type Route } from "./route-urls";


export function escapeHtml(value: string): string
{
	const entities: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
	};

	return value.replace(/[&<>"']/g, character => entities[character]);
}

export function routeHead(route: Route): string
{
	const title = escapeHtml(route.title);
	const description = escapeHtml(route.description);
	const canonical = SITE_URL + route.path;
	const robots = route.unlisted ? "noindex, nofollow, noarchive" : "index, follow";
	const type = route.id.startsWith("thought-") ? "article" : "website";
	const card = route.image ? "summary_large_image" : "summary";
	const tags = [
		`<title data-site-meta>${title}</title>`,
		`<meta data-site-meta name="description" content="${description}">`,
		`<meta data-site-meta name="robots" content="${robots}">`,
		`<link data-site-meta rel="canonical" href="${canonical}">`,
		`<meta data-site-meta property="og:title" content="${title}">`,
		`<meta data-site-meta property="og:description" content="${description}">`,
		`<meta data-site-meta property="og:url" content="${canonical}">`,
		`<meta data-site-meta property="og:type" content="${type}">`,
		`<meta data-site-meta name="twitter:card" content="${card}">`,
		`<meta data-site-meta name="twitter:title" content="${title}">`,
		`<meta data-site-meta name="twitter:description" content="${description}">`,
	];

	if (route.image)
	{
		tags.push(
			`<meta data-site-meta property="og:image" content="${SITE_URL + route.image}">`,
			`<meta data-site-meta property="og:image:type" content="image/jpeg">`,
			`<meta data-site-meta property="og:image:width" content="1200">`,
			`<meta data-site-meta property="og:image:height" content="675">`,
			`<meta data-site-meta name="twitter:image" content="${SITE_URL + route.image}">`,
		);
	}

	return tags.join("\n");
}

export function updateMetadata(route: Route)
{
	document.head.querySelectorAll("[data-site-meta]").forEach(element => element.remove());
	document.head.insertAdjacentHTML("beforeend", routeHead(route));
}
