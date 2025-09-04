// Libraries
import React, {useEffect} from 'react';

// Pages
import Home from "./home";
import Study from "./study";
import Work from './work';
import Achievements from "./achievements";
import Thoughts from './thoughts';
import Gallery from "./gallery";
import Contact from "./contact";
import UnlistedBrainfuck from "./unlisted_brainfuck";

// My components
import Link from "../components/Link";

// Css
import '../css/main.css';


function _main ()
{
	const [activePage, setActivePage] = React.useState("home");

	function updatePageSelection()
	{
		const urlParams = new URLSearchParams(window.location.search);
		const page = urlParams.get('p');

		switch (page)
		{
			case "study":
				setActivePage("study");
				break;
			case "work":
				setActivePage("work");
				break;
			case "achievements":
				setActivePage("achievements");
				break;
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
				<div className="main">
					<h2 className="header-name">
						Vladimir Kirill Bickov
					</h2>

					<div className="menu">
						<Link link="/">Home</Link>
						<Link link="/?p=study">Study</Link>
						<Link link="/?p=work">Work</Link>
						<Link link="/?p=achievements">Achivements</Link>
						<Link link="/?p=thoughts">Thoughts</Link>
						<Link link="/?p=gallery">Gallery</Link>
						<Link link="/?p=contact">Contact</Link>
					</div>

					<div style={{display: activePage === "home" ? "block" : "none"}}>
						<Home/>
					</div>

					<div style={{display: activePage === "study" ? "block" : "none"}}>
						<Study/>
					</div>

					<div style={{display: activePage === "work" ? "block" : "none"}}>
						<Work/>
					</div>

					<div style={{display: activePage === "achievements" ? "block" : "none"}}>
						<Achievements/>
					</div>

					<div style={{display: activePage === "gallery" ? "block" : "none"}}>
						<Gallery/>
					</div>

					<div style={{display: activePage === "contact" ? "block" : "none"}}>
						<Contact/>
					</div>

					<div style={{display: activePage === "thoughts" ? "block" : "none"}}>
						<Thoughts/>
					</div>

					{
						activePage === "unlisted_brainfuck"
						? <UnlistedBrainfuck/>
						: null
					}
				</div>
			</div>
		</>
	);
}

export default _main;
