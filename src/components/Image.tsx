import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css'
import  '../css/image.css';

function Image(props: { link: string, link_big?: string }) {
	return (
		<Zoom
			zoomImg={{
				src: props.link_big ? props.link_big : props.link,
			}}
			IconUnzoom={() => null}
		>
			<img className={"image-component"} src={props.link} loading="lazy" />
		</Zoom>
	);
}

export default Image;