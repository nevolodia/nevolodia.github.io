import Image from "../components/Image";
import Link from '../components/Link';

function Home() {
	const me = require('../resources/images/me.jpg');

	return (
		<div>
			<p>
				Hello, dear visitor!

				<br/>
				<br/>

				My name is Vladimir, and this is my website.

				<br/>
				<br/>

				I like Computer Science, Mathematics, and some other things, you can find on these pages:

				<br/>
				<br/>

				<Link link="?p=study" a_style={true}>
					Study
				</Link> & <Link link="?p=work" a_style={true}>
					Work
				</Link> &lt;- Where do I study? Where do I work?

				<br/>
				<br/>

				Some achievements, like making Braif. compiler, or winning hackathons -&gt; <Link link="?p=achievements" a_style={true}>
					Achievements
				</Link>

				<br/>
				<br/>

				Some blog posts of mine -&gt; <Link link="?p=thoughts" a_style={true}>
					Thoughts
				</Link>

				<br/>
				<br/>

				<Link link="?p=gallery" a_style={true}>
					Gallery
				</Link> &lt;- Some photos, memes, and other stuff I like

				<br/>
				<br/>

				How to contact me? -&gt; <Link link="?p=contact" a_style={true}>
					Contact
				</Link>

				<br/>
				<br/>

				<Image link={me}/>

				<br/>

				I use Arch btw;)
			</p>
		</div>
	);
}

export default Home;