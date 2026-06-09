// My components
import GalleryComponent from "../components/GalleryComponent";
import manifest from "../resources/optimized-manifest.json";


function Gallery()
{
	// Auto-discover gallery images from the optimized manifest (replaces the
	// old try/require loop over the raw jpgs).
	const names = Object.keys(manifest)
		.filter((name) => name.startsWith("gallery/"))
		.sort();

	return (
		<div>
			<GalleryComponent
				names={names}
			/>
		</div>
	);
}

export default Gallery;
