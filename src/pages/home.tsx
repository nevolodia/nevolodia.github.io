import React from 'react';
import Image from "../components/Image";
import GalleryComponent from "../components/GalleryComponent";

function Home() {
	const brainfuck_x86 = require('../resources/images/home/brfck_x86_image.png');
	const ads = require('../resources/images/home/ads.jpg');
	const rott = require('../resources/images/home/rott.jpg');
	const bunq = require('../resources/images/home/bunq.jpg');

	return (
		<div>
			<p>
				My name is Vladimir, and I am doing some Computer Science and Math things.

				<br/>
				<br/>

				Some achievements of mine:

				<br/>
				<br/>

				1. Wrote JIT compiler for Brainfuck in x86 Assembly,
				a jq implementation in Haskell,
				and other cool stuff.

				<br/>
				<br/>

				2. Won 4th place in the algo agent tower defense competition Terminal,
				organized by Citadel Securities trading company, competing against
				teams from top European universities.

				<br/>
				<br/>

				3. Won 2nd place in hackathon by bunq bank. Developed saluting for importing
				or defining in UI financial operation and then analyzing and running them.

				<br/>
				<br/>

				4. Won 1st place in the Port Transition challenge by the Port of Rotterdam.
				Developed an ML solution to predict distributions in the port.

				<br/>
				<br/>

				5. Got 1st place in the Latvian Open Olympiad in Economics 2024, 2nd place
				in the National Olympiad in Economics 2023, and 3rd place in the Latvian Linguistics
				Olympiad 2024.

				<br/>
				<br/>

				Check other pages for more information. :)

				<br/>
				<br/>

				Anc check out the gallery of previously described achievements:

				<br/>
				<br/>

				<Image link={brainfuck_x86}/>
				<Image link={bunq}/>
				<Image link={ads}/>
				<Image link={rott}/>
			</p>
		</div>
	);
}

export default Home;