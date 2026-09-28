function VideoSelfAd()
{
	return (
		<div>
			<iframe
				src="https://www.youtube-nocookie.com/embed/nbpxBnBxIis"
				title="Video"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen
				referrerPolicy="strict-origin-when-cross-origin"
				style={{display: "block", border: "none", borderRadius: "8px", width: "100%", aspectRatio: "16 / 9"}}
			/>
		</div>
	);
}

export default VideoSelfAd;
