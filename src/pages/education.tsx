import React from 'react';
import Image from "../components/Image";

function Education() {
	const me_in_university_big = require('../resources/images/tud.jpg');
	const me_in_university = require('../resources/images/tud_sm.jpg');

	return (
		<div>
			<p>
				I am studying Computer Science and Engineering at the Delft Technical University.

				<br />
				<br />

				In TU Delft, I have started my Honours study in RL for the Vehicle Routing Problem,
				and have joined board of Robotic Student Association.
			</p>

			<Image link={me_in_university} link_big={me_in_university_big}/>

		</div>
	);
}

export default Education;