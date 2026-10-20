import { useEffect, useRef, useState } from "react";
import { createPlayer } from "@videojs/react";
import { audioFeatures, NeutralAudioSkin, Audio } from "@videojs/react/audio";
import { playbackRateFeature } from "@videojs/core/dom";
import "@videojs/react/audio/neutral-skin.css";
import { syncAmbientAudio } from "./ambient-audio";
import { usePageActive } from "../../navigation";

const { Player: AudioPlayer } = createPlayer({
    features: audioFeatures.map(feature => feature === playbackRateFeature ? {
        ...playbackRateFeature,
        state: (context: Parameters<typeof playbackRateFeature.state>[0]) => ({
            ...playbackRateFeature.state(context),
            playbackRates: [1, 1.42, 1.67],
        }),
    } : feature),
});

export default function RelagramAudio() {
    const active = usePageActive();
    const [enhanced, setEnhanced] = useState(false);
    const narration = useRef<HTMLAudioElement>(null);
    const ambient = useRef<HTMLAudioElement>(null);
    const [enabled, setEnabled] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!active) {
            narration.current?.pause();
            ambient.current?.pause();
        }
    }, [active]);

    useEffect(() => {
        setEnhanced(true);
        if (ambient.current) ambient.current.volume = 0.06732;
    }, []);

    useEffect(() => {
        if (!active || !enabled || !narration.current || !ambient.current) return;
        ambient.current.preload = "auto";
        if (ambient.current.readyState === 0) ambient.current.load();
        return syncAmbientAudio(narration.current, ambient.current, () => {
            setEnabled(false);
            setError(true);
        });
    }, [active, enabled]);

    return (
        <div className="thought-audio" style={{padding: "12px", border: "1px solid rgba(255, 255, 255, 0.5)", borderRadius: "12px"}}>
            <AudioPlayer>
                <NeutralAudioSkin className={enhanced ? undefined : "native-player"}>
                    <div className="thought-audio-heading">
                        <span>Listen to RELAGRAM</span>
                        <div className="thought-ambient-controls">
                            <button
                                type="button"
                                className={`thought-ambient-toggle${enabled ? " is-active" : ""}`}
                                onClick={() => { setError(false); setEnabled(!enabled); }}
                            >
                                Bg Ambient <span>{enabled ? "On" : "Off"}</span>
                            </button>
                        </div>
                    </div>
                    <Audio ref={narration} src="/thoughts/001/media_audio_67.mp3" controls={!enhanced} preload={active ? "metadata" : "none"} />
                </NeutralAudioSkin>
            </AudioPlayer>
            <audio ref={ambient} src="/thoughts/001/media_autio_69.mp3" loop preload="none" />
            {error && <div className="thought-ambient-error">Ambient audio could not play. Try turning it on again.</div>}
        </div>
    );
}
