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

				2. 4th place in the algorithmic agent tower defense competition
				organized by Citadel Securities.

				<br/>
				<br/>

				3. 2nd place in hackathon by bunq bank. Developed solution for importing or
				defining graph of financial operations and then analyzing or executing them.

				<br/>
				<br/>

				4. 1st place in Port Transition challenge by the Port of Rotterdam.
				Developed an ML solution to predict distributions in the port.

				<br/>
				<br/>

				5. 1st place in the Latvian Open Olympiad in Economics 2024,
				2nd place in the National Olympiad in Economics 2023,
				and 3rd place in the Latvian Linguistics Olympiad 2024.

				<br/>
				<br/>

				Check out the gallery of previously described achievements:

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