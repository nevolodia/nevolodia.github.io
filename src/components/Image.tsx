import React, { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css'
import Picture, { Manifest, PictureEntry } from './Picture';
import manifestJson from '../resources/optimized-manifest.json';
import '../css/image.css';

const manifest = manifestJson as Manifest;

// Highest-resolution source for the zoom overlay: prefer the largest AVIF
// variant, fall back to the largest WebP, then the fallback raster.
function zoomSrc(entry: PictureEntry): string {
	const last = (arr: { src: string }[]) => (arr.length ? arr[arr.length - 1].src : undefined);
	return last(entry.avif) || last(entry.webp) || entry.fallback.src;
}

function Image(props: {
	// Manifest key, e.g. "me.jpg" or "gallery/001.jpg".
	name: string,
	// Optional manifest key for a higher-resolution image used only when zoomed.
	big?: string,
	highFetchPriority?: boolean,
	sizes?: string
}) {
	const { name, big, highFetchPriority, sizes } = props;
	const entry = manifest[name];

	// The zoom wrapper attaches only after mount: react-medium-image-zoom
	// renders random ids, so its markup can never match the prerendered home
	// snapshot (scripts/prerender-home.mjs). First render = plain <Picture>
	// everywhere -> clean hydration; Zoom wraps it a tick later.
	const [interactive, setInteractive] = useState(false);
	useEffect(() => setInteractive(true), []);

	// Defensive fallback if an image is missing from the manifest.
	if (!entry) {
		return (
			<img className={"image-component"} src={`/optimized/${name}`}
			     loading="lazy" decoding="async" />
		);
	}

	const bigEntry = big ? manifest[big] : undefined;

	const picture = (
		<Picture
			entry={entry}
			className={"image-component"}
			sizes={sizes}
			eager={!!highFetchPriority}
		/>
	);

	if (!interactive) {
		return picture;
	}

	return (
		<Zoom
			zoomImg={{
				src: zoomSrc(bigEntry ?? entry),
			}}
			IconUnzoom={() => null}
		>
			{picture}
		</Zoom>
	);
}

export default Image;
