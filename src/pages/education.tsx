// My components
import Divide67 from "../components/Divide67"
import Image from "../components/Image"
import Link from "../components/Link"
import BB from "../components/BB"

// Resources
import me_in_university_big from '../resources/images/tud.jpg'
import me_in_university from '../resources/images/tud_sm.jpg'


function Education()
{
	return (
		<div>
			<p>
				<b>Education.</b>
				<BB />

				— BSc Computer Science @ Delft University of Technology (GPA: 8.9/10, 4.0/4.0 US)
				<br />
				— Exchange @ University of Illinois, Urbana-Champaign (UIUC)

				<Divide67 />

				<b>Research.</b>
				<BB />

				— NeurIPS workshop MLxOR paper, <Link link="/thoughts/001/" a_style={true}>Latent-recursive Reinforcement Learning Model for Graph Combinatorial Optimization</Link>

				<BB />

				— Research and software engineering project in LLM interpretability under supervision of researchers from Google, DeepMind and AI4SE Lab.

				<Divide67 />

				<b>Work.</b>
				<BB />

				— Data Engineer @ Bunq — RnD AI project (Jun 2025 - Dec 2025)
				<br />
				
				— Few websites back in the day, such as <Link link="https://binatec.eu/" a_style={true}>Binatec</Link>

				<Divide67 />

				<b>AI Olympiad.</b>
				<BB />

				— Founder of first-in-history <Link link="https://omi.lv/" a_style={true}>Latvian AI Olympiad</Link>.
				<br />

				— Led Latvia's participation in International Olympiad in AI, where we won Bronze and Silver!
				<BB />

				— Created Lemon AI, a non-profit developing AI education for students worldwide.

				<Divide67 />

				<b>Academic Service.</b>
				<BB />

				&gt; Conference reviewer for:

				<br />
				<br />

				— IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP) 2027
				<br />

				— Learning for Dynamics & Control Conference (L4DC) 2027
				
				<BB />

				&gt; Workshop reviewer for:
				<BB />

				— ICASSP Workshop ERC-LM 2027
				<br />

				— AAAI Workshop MultiRobust, 2027

				<br />
			</p>

			<Image link={me_in_university} link_big={me_in_university_big}/>
		</div>
	)
}

export default Education
