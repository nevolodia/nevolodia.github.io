import Image from "../components/Image";

function Work() {
	const me_in_university_big = require('../resources/images/tud.jpg');
	const me_in_university = require('../resources/images/tud_sm.jpg');

	return (
		<div>
			<p>
				I am working as Data Engineer at <a href="https://www.bunq.com/" target="_blank">
					bunq
				</a>, a leading fintech bank in Europe. I am working on R&D ML project focused
				on enhancing the reliability and user experience of bunq's innovative products.

				<br/>
				<br/>

				Before that, I have worked on several projects:
				
				<br/>
				<br/>
				
				1. An online shop <a href="https://binatec.eu/" target="_blank">
					https://binatec.eu/
				</a> for European household chemistry company.
				Made with WordPress, WooCommerce, and a bit of love.

				<br/>
				<br/>

				2. Developing website for <a href="https://lnkboxing.lv/" target="_blank">
					LNK Boxing
				</a> with custom subscription system.
			</p>
		</div>
	);
}

export default Work;