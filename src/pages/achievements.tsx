// My components
import Image from "../components/Image";


function Achievements()
{
	const brainfuck_x86 = require('../resources/images/brfck_x86_image.png');
	const ads = require('../resources/images/ads.jpg');
	const rott = require('../resources/images/rott.jpg');
	const bunq = require('../resources/images/bunq.jpg');

	return (
		<div>
			<p>
				1. Wrote a jq implementation in Haskell,
				JIT compiler for Brainfuck in x86 Assembly,
				and other cool stuff.

				<br/>
				<br/>

				2. Started working on R&D ML project in <a href="https://www.bunq.com/" target="_blank">
					bunq bank
				</a>, Europe's second largest fintech bank.

				<br/>
				<br/>

				3. Won 2nd place in bunq hackathon.
				Developed solution for executing graph of financial operations, integrated ML tools.

				<br/>
				<br/>

				4. 2nd place in Battle Royal math competition by <a href="http://davincitrading.com/"
				target="_blank">
					Da Vinci Trading
				</a>.

				<br/>
				<br/>

				5. 4th place in the algorithmic agent tower defense competition Terminal
				by <a href="https://www.citadel.com/" target="_blank">
					Citadel
				</a>, a leading quant trading company.

				<br/>
				<br/>

				6. 1st place in Port Transition challenge by the <a href="https://www.portofrotterdam.com/en"
				target="_blank">
					Port of Rotterdam
				</a>.
				Developed an ML solution to predict distributions.

				<br/>
				<br/>

				7. 1st place in the Latvian Open Olympiad in Economics 2024,
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

				<br/>
				<br/>
			</p>
		</div>
	);
}

export default Achievements;