import React, {useEffect} from 'react';
import Link from "../components/Link";

import Home from "./home";
import Education from "./education";
import Projects from "./projects";
import Gallery from "./gallery";
import UnlistedBrainfuck from "./unlisted_brainfuck";

import '../css/main.css';

function _main() {

	const [activePage, setActivePage] = React.useState("home");
	function updatePageSelection() {
		const urlParams = new URLSearchParams(window.location.search);
		const page = urlParams.get('p');

		switch (page) {
			case "education":
				setActivePage("education");
				break;
			case "projects":
				setActivePage("projects");
				break;
			case "gallery":
				setActivePage("gallery");
				break;
			case "unlisted_brainfuck":
				setActivePage("unlisted_brainfuck");
				break;
			default:
				setActivePage("home");
		}
	}

	useEffect(() => {
		updatePageSelection();
	}, []);

	// eslint-disable-next-line no-restricted-globals
	const originalPushState = history.pushState;
	// eslint-disable-next-line no-restricted-globals
	const originalReplaceState = history.replaceState;

	// eslint-disable-next-line no-restricted-globals
	history.pushState = function (state: any, title: string, url?: string | URL | null) {
		// eslint-disable-next-line no-restricted-globals
		originalPushState.call(history, state, title, url);
		updatePageSelection();
	};

	// eslint-disable-next-line no-restricted-globals
	history.replaceState = function (state: any, title: string, url?: string | URL | null) {
		// eslint-disable-next-line no-restricted-globals
		originalReplaceState.call(history, state, title, url);
		updatePageSelection();
	};

	return (
		<div className="bg">
			<div className="main">
				<h2>Vladimir Kirill Bickov</h2>

				<div className="menu">
					<Link link="/">Home</Link>
					<Link link="/?p=education">Education</Link>
					<Link link="/?p=projects">Projects</Link>
					<Link link="/?p=gallery">Gallery</Link>
				</div>

				<div style={{display: activePage === "home" ? "block" : "none"}}>
					<Home/>
				</div>

				<div style={{display: activePage === "education" ? "block" : "none"}}>
					<Education/>
				</div>

				<div style={{display: activePage === "projects" ? "block" : "none"}}>
					<Projects/>
				</div>

				<div style={{display: activePage === "gallery" ? "block" : "none"}}>
					<Gallery/>
				</div>

				{
					activePage === "unlisted_brainfuck"
					? <UnlistedBrainfuck/>
					: null
				}
			</div>
		</div>
	);
}

export default _main;
