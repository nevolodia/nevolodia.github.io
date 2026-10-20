import { useEffect, useRef, useState, type VideoHTMLAttributes } from "react";
import { VideoPlayer, NeutralVideoSkin, Video } from "@videojs/react/video";
import "@videojs/react/video/neutral-skin.css";
import { usePageActive } from "../navigation";

export default function ThoughtVideo({ src }: { src: string }) {
    const active = usePageActive();
    const video = useRef<HTMLVideoElement>(null);
    const [enhanced, setEnhanced] = useState(false);
    useEffect(() => setEnhanced(true), []);
    useEffect(() => { if (!active) video.current?.pause(); }, [active]);
    return (
        <VideoPlayer>
            <NeutralVideoSkin className={`thought-video${enhanced ? "" : " native-player"}`}>
                <Video ref={video} src={src} controls={!enhanced} playsInline preload={active ? "metadata" : "none"}>
                    <a href={src}>Download the video</a>
                </Video>
            </NeutralVideoSkin>
        </VideoPlayer>
    );
}

export function ThoughtLoop(props: VideoHTMLAttributes<HTMLVideoElement>) {
    const active = usePageActive();
    const video = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (active) void video.current?.play().catch(() => {});
        else video.current?.pause();
    }, [active]);
    return <video {...props} ref={video} autoPlay={active} preload={active ? "metadata" : "none"} />;
}
