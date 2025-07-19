import React, {useEffect} from 'react';
import Link from "../components/Link";

import Home from "./home";
import Education from "./education";
import Experience from "./experience";
import Gallery from "./gallery";
import Thoughts from "./thoughts";
import UnlistedBrainfuck from "./unlisted_brainfuck";

import '../css/main.css';
import Contact from "./contact";

function _main() {

	const [activePage, setActivePage] = React.useState("home");
	function updatePageSelection() {
		const urlParams = new URLSearchParams(window.location.search);
		const page = urlParams.get('p');

		switch (page) {
			case "education":
				setActivePage("education");
				break;
			case "experience":
				setActivePage("experience");
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
	useEffect(() => {
		updatePageSelection();
	}, []);


	// Update the page selection when the URL changes
	useEffect(() => {
		updatePageSelection();

		const handlePopState = () => {
			updatePageSelection();
		};

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
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
					<Link link="/?p=experience">Experience</Link>
					<Link link="/?p=gallery">Gallery</Link>
					<Link link="/?p=contact">Contact</Link>
					{/*<Link link="/?p=thoughts">Thoughts</Link>*/}
				</div>

				<div style={{display: activePage === "home" ? "block" : "none"}}>
					<Home/>
				</div>

				<div style={{display: activePage === "education" ? "block" : "none"}}>
					<Education/>
				</div>

				<div style={{display: activePage === "experience" ? "block" : "none"}}>
					<Experience/>
				</div>

				<div style={{display: activePage === "gallery" ? "block" : "none"}}>
					<Gallery/>
				</div>

				<div style={{display: activePage === "contact" ? "block" : "none"}}>
					<Contact/>
				</div>

				{/*}
				<div style={{display: activePage === "thoughts" ? "block" : "none"}}>
					<Thoughts/>
				</div>
				*/}

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
