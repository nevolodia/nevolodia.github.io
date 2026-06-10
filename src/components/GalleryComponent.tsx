import React from 'react';
import Image from './Image';
import '../css/gallery-component.css';

function GalleryComponent( props: { images: string[] } ) {
	return (
		<div className="gallery-component">
			{props.images.map((image, index) => (
				<Image key={index} link={image} />
			))}
		</div>
	);
}

export default GalleryComponent;
