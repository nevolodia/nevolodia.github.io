import Link from "../components/Link";
import titles from './thoughts/titles.json';

function Thoughts() {

    // if we have ?thought=n, we show the thought
    // oltherwise, we show the selection of thoughts

    var content;
    const thought = window.location.search.split('thought=')[1];

    if (thought) {
        const thoughtStr = thought.padStart(3, '0');
        const thoughtText = require(`./thoughts/${thoughtStr}.json`);
        content = <div>{thoughtText}</div>;
    } else {
        const titlesList = titles.map((title, index) => {
            return <Link key={index} link={`?p=thoughts&thought=${title.number}`}> {title.title}</Link>;
        });
        content = titlesList.map((title, index) => {
            return <>{index + 1}. {title}</>;
        });
    }

	return (
		<div>
            <p>
                {content}
            </p>
		</div>
	);
}

export default Thoughts;