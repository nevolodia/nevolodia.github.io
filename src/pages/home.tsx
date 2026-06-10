// My components
import Link from '../components/Link';
import Image from "../components/Image";


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

				<Image name="me.jpg" highFetchPriority={true}/>

			</p>
		</div>
	);
}

export default Home;