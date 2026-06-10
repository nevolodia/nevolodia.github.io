// My components
import Image from "../components/Image";

// Resources
import me_in_university_big from '../resources/images/tud.jpg';
import me_in_university from '../resources/images/tud_sm.jpg';


function Study()
{
	return (
		<div>
			<p>
				I am studying Computer Science and Engineering Bachelor at the Delft Technical University.

				<br />
				<br />

				Additional to studies, I have:

				<br />
				<br />

				&gt; started work on Honours study in Reinforcement Learning for the Vehicle Routing Problem,

				<br />
				<br />

				&gt; became Board Member and Project Manager at the Robotic Student Association.
			</p>

			<Image link={me_in_university} link_big={me_in_university_big}/>
		</div>
	);
}

export default Study;