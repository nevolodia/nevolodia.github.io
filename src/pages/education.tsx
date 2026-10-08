// My components
import Image from "../components/Image";
import Link from "../components/Link";

// Resources
import me_in_university_big from '../resources/images/tud.jpg';
import me_in_university from '../resources/images/tud_sm.jpg';


function Education()
{
	return (
		<div>
			<p>
				— BSc Computer Science @ Technical University of Delft

				<br />

				— Exchange @ University of Illinois, Urbana-Champaign

				<br />
				<br />

				&gt; GPA: 8.9/10 (4.0/4.0 US).

				<br />
				<br />

				&gt; NeurIPS workshop MLxOR paper, “<Link link="/?p=thoughts&thought=001" a_style={true}>Recursive Latent Graph Model for Capacitated Vehicle Routing Problem</Link>”.

				<br />
				<br />

				&gt; Research in Deep Learning and Latent Recursion for Combinatorial Optimization under the supervision of Dr. Neil Yorke-Smith.

				<br />
				<br />

				&gt; Research and software project on LLM interpretability under the supervision of researchers from Google, DeepMind and AI4SE Lab.

				<br />
				<br />

				&gt; Lead organizer of the Latvian AI Olympiad (more in <Link link="/?p=portfolio" a_style={true}>Portfolio</Link>).
			</p>

			<Image link={me_in_university} link_big={me_in_university_big}/>
		</div>
	);
}

export default Education;
