import React from 'react';
import GalleryComponent from "../components/GalleryComponent";

function Gallery() {

	let images = [];
	let i = 1;
	while (true) {
		// check if the image exists
		try {
			const num = `${String(i).padStart(3, '0')}`;
			images.push(
				require(`../resources/images/gallery/${num}.jpg`)
			);
		} catch (e) {
			break;
		}
		i++;
	}

	return (
		<div>

			<GalleryComponent
				images={images}
			/>

		</div>
	);
}

export default Gallery;