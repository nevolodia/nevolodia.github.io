import React from 'react';
import Link from "../components/Link";

import Home from "./home";
import Education from "./education";

import '../css/main.css';

function Main() {
	let activePage;
	const urlParams = new URLSearchParams(window.location.search);
	const page = urlParams.get('p');

	switch (page) {
		case "education":
			activePage = "education";
			break;
		case "research":
			activePage = "research";
			break;
		case "gallery":
			activePage = "gallery";
			break;
		default:
			activePage = "home";
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
