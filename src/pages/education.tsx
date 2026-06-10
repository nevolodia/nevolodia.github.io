// My components
import Image from "../components/Image";

// Resources
import me_in_university_big from '../resources/images/tud.jpg';
import me_in_university from '../resources/images/tud_sm.jpg';


function Education()
{
	return (
		<div>
			<p>
				I am studying Computer Science BSc at Technical University of Delft.

				<br />
				<br />

				Futher:

				<br />
				<br />

				&gt; researching Reinforcement Learning for Combinatorial Optimization at Dr. Neil Yorke-Smith,

				<br />
				<br />

				&gt; doing research of LLM interpretability under supervision of Google, DeepMind and AI4SE Lab researchers.
			</p>

			<Image link={me_in_university} link_big={me_in_university_big}/>
		</div>
	);
}

export default Education;