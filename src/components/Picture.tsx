import React, { useState } from 'react';

// A single image's optimized variants, as produced by scripts/optimize-images.mjs.
export type ImageSource = { src: string; width: number };
export type PictureEntry = {
	avif: ImageSource[];
	webp: ImageSource[];
	fallback: { src: string; width: number; height: number };
	width: number;
	height: number;
	lqip: string;
};

export type Manifest = Record<string, PictureEntry>;

function srcSet(sources: ImageSource[]): string {
	return sources.map((s) => `${s.src} ${s.width}w`).join(', ');
}

type PictureProps = {
	entry: PictureEntry;
	sizes?: string;
	className?: string;
	// Above-the-fold images should load eagerly with high priority.
	eager?: boolean;
	// Show the blurred LQIP placeholder until the image decodes.
	lqip?: boolean;
	style?: React.CSSProperties;
};

function Picture(props: PictureProps) {
	const { entry, sizes = '100vw', className, eager = false, lqip = false, style } = props;
	const [loaded, setLoaded] = useState(false);

	// Reserve layout space from the intrinsic ratio to avoid CLS.
	const showLqip = lqip && !loaded;
	const imgStyle: React.CSSProperties = {
		...(showLqip
			? {
					backgroundImage: `url(${entry.lqip})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}
			: {}),
		...style,
	};

	return (
		<picture>
			<source type="image/avif" srcSet={srcSet(entry.avif)} sizes={sizes} />
			<source type="image/webp" srcSet={srcSet(entry.webp)} sizes={sizes} />
			<img
				className={className}
				src={entry.fallback.src}
				width={entry.width}
				height={entry.height}
				sizes={sizes}
				decoding="async"
				fetchPriority={eager ? 'high' : 'auto'}
				onLoad={() => setLoaded(true)}
				style={imgStyle}
			/>
		</picture>
	);
}

export default Picture;
