import React from 'react';
import Image from './Image';
import '../css/gallery-component.css';

function GalleryComponent( props: { names: string[] } ) {
	return (
		<div className="gallery-component">
			{props.names.map((name, index) => (
				<Image key={name} name={name} sizes="(min-width: 1050px) 360px, 50vw" />
			))}
		</div>
	);
}

export default GalleryComponent;
