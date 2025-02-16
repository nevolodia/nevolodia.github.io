import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css'

function Image(props: { link: string, link_big?: string }) {
	return (
		<Zoom
			zoomImg={{
				src: props.link_big ? props.link_big : props.link,
			}}
		>
			<img src={props.link} />
		</Zoom>
	);
}

export default Image;