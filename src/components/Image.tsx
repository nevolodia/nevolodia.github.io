import React, { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css'
import  '../css/image.css';

function Image(props: { link: string, link_big?: string, highFetchPriority?: boolean }) {
	// The zoom wrapper attaches only after mount: react-medium-image-zoom
	// renders random ids, so its mounted markup cannot be prerendered.
	// First render = plain <img> in both static HTML and the browser
	// everywhere -> clean hydration; Zoom wraps it a tick later.
	const [interactive, setInteractive] = useState(false);
	useEffect(() => setInteractive(true), []);

	const img = (
		<img className={"image-component"} src={props.link}
		     fetchPriority={props.highFetchPriority ? "high" : "low"} />
	);

	if (!interactive) {
		return img;
	}

	return (
		<Zoom
			wrapElement="span"
			zoomImg={{
				src: props.link_big ? props.link_big : props.link,
			}}
			IconUnzoom={() => null}
		>
			{img}
		</Zoom>
	);
}

export default Image;
