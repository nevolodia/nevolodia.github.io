import { useEffect, useRef, useState } from "react";
import { AudioPlayer, NeutralAudioSkin, Audio } from "@videojs/react/audio";
import "@videojs/react/audio/neutral-skin.css";
import { syncAmbientAudio } from "./ambient-audio";

export default function RelagramAudio() {
    const narration = useRef<HTMLAudioElement>(null);
    const ambient = useRef<HTMLAudioElement>(null);
    const [enabled, setEnabled] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (ambient.current) ambient.current.volume = 0.06732;
    }, []);

    useEffect(() => {
        if (!enabled || !narration.current || !ambient.current) return;
        return syncAmbientAudio(narration.current, ambient.current, () => {
            setEnabled(false);
            setError(true);
        });
    }, [enabled]);

    return (
        <div className="thought-audio" style={{padding: "12px", border: "1px solid rgba(255, 255, 255, 0.5)", borderRadius: "12px"}}>
            <AudioPlayer>
                <NeutralAudioSkin>
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
                    <Audio ref={narration} src="/thoughts/001/media_audio_67.mp3" preload="metadata" />
                </NeutralAudioSkin>
            </AudioPlayer>
            <audio ref={ambient} src="/thoughts/001/media_autio_69.mp3" loop preload="metadata" />
            {error && <div className="thought-ambient-error">Ambient audio could not play. Try turning it on again.</div>}
        </div>
    );
}
