import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css'
import  '../css/image.css';

function Image(props: { link: string, link_big?: string, highFetchPriority?: boolean }) {
	return (
		<Zoom
			zoomImg={{
				src: props.link_big ? props.link_big : props.link,
			}}
			IconUnzoom={() => null}
		>
			<img className={"image-component"} src={props.link}
			     fetchPriority={props.highFetchPriority ? "high" : "low"} />
		</Zoom>
	);
}

export default Image;