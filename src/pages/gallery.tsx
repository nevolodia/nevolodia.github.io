// My components
import GalleryComponent from "../components/GalleryComponent";

// All gallery photos, auto-discovered at build time (Vite's replacement for
// the old try/require loop), in filename order. The grid shows the generated
// small version (public/gallery_sm/, see scripts/gallery-thumbs.mjs); zoom
// opens the untouched original.
const galleryImages = import.meta.glob("../resources/images/gallery/*.jpg", {
	eager: true,
	query: "?url",
	import: "default",
});


function Gallery()
{
	const images = Object.keys(galleryImages)
		.sort()
		.map((key) => ({
			small: `/gallery_sm/${key.split("/").pop()}`,
			big: galleryImages[key] as string,
		}));

	return (
		<div>
			<GalleryComponent
				images={images}
			/>
		</div>
	);
}

export default Gallery;
