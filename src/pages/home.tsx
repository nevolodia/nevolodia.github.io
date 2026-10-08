// My components
import Link from '../components/Link';
import Image from "../components/Image";

// Resources
import me from '../resources/images/me.jpg';


function Home()
{
	return (
		<div>
			<p>
				Hello, dear visitor!

				<br/>
				<br/>

				My name is Vladimir, and this is my website.

				<br/>
				<br/>

				— Read about my publication at NeurIPS workshop MLxOR: <Link link="/?p=thoughts&thought=001" a_style={true}>RELAGRAM</Link>

				<br/>
				<br/>

				<Image link={me} highFetchPriority={true}/>

			</p>
		</div>
	);
}

export default Home;
