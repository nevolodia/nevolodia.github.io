import React from 'react';
import Home from "./home";
import Link from "../components/Link";
import '../css/main.css';

function Main() {

	// get page from url
	let component = null;
	const url = window.location.pathname;
	switch (url) {
		case "/education":
			component = <Home/>;
			break;
		case "/research":
			component = <Home/>;
			break;
		case "/gallery":
			component = <Home/>;
			break;
		default:
			component = <Home/>;
	}

	return (
		<div className="bg">
			<div className="main">

				<h2>Vladimir Kiril Bickov</h2>

				<div className="menu">
					<Link link="/">
						Home
					</Link>
					<Link link="/education">
						Education
					</Link>
					<Link link="/research">
						Research
					</Link>
					<Link link="/gallery">
						Gallery
					</Link>
				</div>

				{component}
			</div>
		</div>
	);
}

export default Main;
