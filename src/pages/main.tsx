import React from 'react';
import Link from "../components/Link";

import Home from "./home";
import Education from "./education";

import '../css/main.css';

function Main() {
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


	const [activePage, setActivePage] = React.useState("home");
	function updatePageSelection() {
		const urlParams = new URLSearchParams(window.location.search);
		const page = urlParams.get('p');

		switch (page) {
			case "education":
				setActivePage("education");
				break;
			case "research":
				setActivePage("research");
				break;
			case "gallery":
				setActivePage("gallery");
				break;
			default:
				setActivePage("home");
		}
	}

	return (
		<div className="bg">
			<div className="main">
				<h2>Vladimir Kiril Bickov</h2>

				<div className="menu">
					<Link link="/">Home</Link>
					<Link link="/?p=education">Education</Link>
					<Link link="/?p=research">Research</Link>
					<Link link="/?p=gallery">Gallery</Link>
				</div>

				<div style={{ display: activePage === "home" ? "block" : "none" }}>
					<Home />
				</div>

				<div style={{ display: activePage === "education" ? "block" : "none" }}>
					<Education />
				</div>

				<div style={{ display: activePage === "research" ? "block" : "none" }}>
					<Home />
				</div>

				<div style={{ display: activePage === "gallery" ? "block" : "none" }}>
					<Home />
				</div>
			</div>
		</div>
	);
}

export default Main;
