import React, { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css'
import  '../css/image.css';

function Image(props: { link: string, link_big?: string, highFetchPriority?: boolean }) {
	// The zoom wrapper attaches only after mount: react-medium-image-zoom
	// renders random ids, so its markup can never match the prerendered home
	// snapshot (scripts/prerender-home.mjs). First render = plain <img>
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
