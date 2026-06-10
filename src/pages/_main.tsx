// Libraries
import React, {useEffect, Suspense, lazy} from 'react';

// Pages (light ones stay in the main bundle)
import Home from "./home";
import Education from "./education";
import Portfolio from './portfolio';
import Contact from "./contact";

// My components
import Link from "../components/Link";

// Css
import '../css/main.css';

// Heavy pages are code-split into separate chunks, loaded on first visit.
// const Achievements = lazy(() => import("./achievements"));
const Thoughts = lazy(() => import("./thoughts"));
const Gallery = lazy(() => import("./gallery"));
const UnlistedBrainfuck = lazy(() => import("./unlisted_brainfuck"));


function _main ()
{
	const [activePage, setActivePage] = React.useState("home");

	// Pages visited so far: a lazy page's chunk is fetched on first visit and
	// the page stays mounted afterwards (so switching back is instant).
	const [visited, setVisited] = React.useState<Set<string>>(() => new Set(["home"]));

	useEffect(() =>
	{
		setVisited((prev) => prev.has(activePage) ? prev : new Set(prev).add(activePage));
	}, [activePage]);

	// Warm-up: the moment the visible page has fully displayed (= the load
	// event, when all of its own resources are in), mount ALL pages hidden —
	// every chunk and every image downloads right away, and every later page
	// switch is an instant display toggle. Before load, the visible page has
	// absolute priority; after load, nothing competes with the warm-up.
	useEffect(() =>
	{
		// The build-time prerenderer must snapshot the UNwarmed page (home
		// only), or the hydrated first render won't match the HTML.
		if ((window as any).__PRERENDER__)
		{
			return;
		}
		const warm = () =>
		{
			setVisited(new Set(["home", "education", "portfolio", /*"achievements",*/ "gallery", "contact", "thoughts"]));
			import("./unlisted_brainfuck"); // unlisted: cache the chunk only
		};
		if (document.readyState === "complete")
		{
			warm();
		}
		else
		{
			window.addEventListener("load", warm, { once: true });
		}
	}, []);

	function updatePageSelection()
	{
		const urlParams = new URLSearchParams(window.location.search);
		const page = urlParams.get('p');

		switch (page)
		{
			case "education":
				setActivePage("education");
				break;
			case "portfolio":
				setActivePage("portfolio");
				break;
			//case "achievements":
			//	setActivePage("achievements");
			//	break;
			case "gallery":
				setActivePage("gallery");
				break;
			case "contact":
				setActivePage("contact");
				break;
			case "thoughts":
				setActivePage("thoughts");
				break;
			case "unlisted_brainfuck":
				setActivePage("unlisted_brainfuck");
				break;
			default:
				setActivePage("home");
		}
	}

	// Update the page selection when the component mounts
	useEffect(() =>
	{
		updatePageSelection();
	}, []);


	// Update the page selection when the URL changes
	useEffect(() =>
	{
		updatePageSelection();
		const handlePopState = () => {
			updatePageSelection();
		};

		window.addEventListener('popstate', handlePopState);

		return () =>
		{
			window.removeEventListener('popstate', handlePopState);
		};
	}, []);

	// eslint-disable-next-line no-restricted-globals
	const originalPushState = history.pushState;
	// eslint-disable-next-line no-restricted-globals
	const originalReplaceState = history.replaceState;

	// eslint-disable-next-line no-restricted-globals
	history.pushState = function (state: any, title: string, url?: string | URL | null)
	{
		// eslint-disable-next-line no-restricted-globals
		originalPushState.call(history, state, title, url);
		updatePageSelection();
	};

	// eslint-disable-next-line no-restricted-globals
	history.replaceState = function (state: any, title: string, url?: string | URL | null)
	{
		// eslint-disable-next-line no-restricted-globals
		originalReplaceState.call(history, state, title, url);
		updatePageSelection();
	};

	return (
		<>
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
							<Link link="/" active={activePage === "home"}>Home</Link>
							<Link link="/?p=education" active={activePage === "education"}>Education</Link>
							<Link link="/?p=portfolio" active={activePage === "portfolio"}>Portfolio</Link>
							{/* <Link link="/?p=achievements" active={activePage === "achievements"}>Achivements</Link> */}
							<Link link="/?p=thoughts" active={activePage === "thoughts"}>Thoughts</Link>
							<Link link="/?p=gallery" active={activePage === "gallery"}>Gallery</Link>
							<Link link="/?p=contact" active={activePage === "contact"}>Contact</Link>
						</div>
					</div>

					<div className="main">
					<div style={{display: activePage === "home" ? "block" : "none"}}>
						<Home/>
					</div>

					<div style={{display: activePage === "education" ? "block" : "none"}}>
						<Education/>
					</div>

					<div style={{display: activePage === "portfolio" ? "block" : "none"}}>
						<Portfolio/>
					</div>

					{/* Suspense sits INSIDE each conditional (not around them):
					    on the first render nothing lazy is mounted, so the initial
					    tree is plain divs — required for clean hydration of the
					    prerendered home page (snapshots can't encode Suspense). */}
					{/* <div style={{display: activePage === "achievements" ? "block" : "none"}}>
						{visited.has("achievements") && <Suspense fallback={null}><Achievements/></Suspense>}
					</div> */}

					<div style={{display: activePage === "gallery" ? "block" : "none"}}>
						{visited.has("gallery") && <Suspense fallback={null}><Gallery/></Suspense>}
					</div>

					<div style={{display: activePage === "contact" ? "block" : "none"}}>
						<Contact/>
					</div>

					<div style={{display: activePage === "thoughts" ? "block" : "none"}}>
						{visited.has("thoughts") && <Suspense fallback={null}><Thoughts/></Suspense>}
					</div>

					{
						activePage === "unlisted_brainfuck"
						? <Suspense fallback={null}><UnlistedBrainfuck/></Suspense>
						: null
					}
					</div>
				</div>
			</div>
		</>
	);
}

export default _main;
