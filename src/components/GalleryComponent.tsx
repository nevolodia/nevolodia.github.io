import React, { useEffect } from 'react';
import Image from './Image';
import '../css/gallery-component.css';

function GalleryComponent( props: { images: { small: string, big: string }[] } ) {
	// Pre-fetch the originals at low priority once the gallery is mounted
	// (mounting happens at the post-load warm-up), so the first zoom is
	// instant. The small grid versions load first; these queue behind them.
	useEffect(() =>
	{
		for (const image of props.images)
		{
			const img = new window.Image();
			img.fetchPriority = "low";
			img.src = image.big;
		}
	}, [props.images]);

	return (
		<div className="gallery-component">
			{props.images.map((image, index) => (
				<Image key={index} link={image.small} link_big={image.big} />
			))}
		</div>
	);
}

export default GalleryComponent;
