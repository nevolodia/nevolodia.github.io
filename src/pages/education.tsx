// My components
import Divide67 from "../components/Divide67";
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
				Education.
				<br />
				<br />

				— BSc Computer Science @ Delft University of Technology (GPA: 8.9/10, 4.0/4.0 US)
				<br />
				— Exchange @ University of Illinois, Urbana-Champaign (UIUC)

				<Divide67 />

				Research.
				<br />
				<br />

				— NeurIPS workshop MLxOR paper, <Link link="/thoughts/001/" a_style={true}>Latent-recursive Reinforcement Learning Model for Graph Combinatorial Optimization</Link>

				<br />
				<br />

				— Research and software engineering project in LLM interpretability under supervision of researchers from Google, DeepMind and AI4SE Lab.

				<Divide67 />

				Work.

				— Data Engineer @ Bunq — RnD AI project (Jun 2025 - Dec 2025)
				— Few websites back in the day: Binatec, LNK Boxing

				<Divide67 />

				Academic Service.
				<br />
				<br />

				&gt; Conference reviewer for:

				<br />
				<br />

				— IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP) 2027
				<br />

				— Learning for Dynamics & Control Conference (L4DC) 2027
				
				<br />
				<br />

				&gt; Workshop reviewer for:
				<br />
				<br />

				— ICASSP Workshop ERC-LM 2027
				<br />

				— AAAI Workshop MultiRobust, 2027

				<Divide67 />

				AI Olympiad.
				<br />
				<br />

				— Founder of first-in-history <Link link="/thoughts/001/" a_style={true}>Latvian AI Olympiad</Link>.
				<br />

				— Led Latvia's participation in International Olympiad in AI, where we won Bronze and Silver!
				<br />
				<br />

				— Created Lemon AI, a non-profit developing AI education for students worldwide.

				<br />
			</p>

			<Image link={me_in_university} link_big={me_in_university_big}/>
		</div>
	);
}

export default Education;
