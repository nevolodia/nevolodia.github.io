import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import Main from "./pages/_main";
import { loadRoute, ROUTES, NOT_FOUND } from "./routes";
import { routeHead } from "./metadata";

export async function renderPages() {
    const documents = [];
    for (const route of [...ROUTES, NOT_FOUND]) {
        const { Page, modules } = await loadRoute(route);
        const html = renderToString(<StrictMode><Main initialRoute={route} initialPage={Page} /></StrictMode>);
        documents.push({ route, html, head: routeHead(route), modules });
    }
    return documents;
}
