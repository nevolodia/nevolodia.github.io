// Keep the ambient loop on the narration's clock, including after seeking.
export function syncAmbientAudio(
    narration: HTMLAudioElement,
    ambient: HTMLAudioElement,
    onError: () => void,
) {
    let disposed = false;
    let playPending = false;

    const sync = (event?: Event) => {
        if (disposed) return;

        if (ambient.playbackRate !== narration.playbackRate) {
            ambient.playbackRate = narration.playbackRate;
        }

        const duration = ambient.duration;
        const hasDuration = Number.isFinite(duration) && duration > 0;
        // Repeated seeks to correct tiny timing differences interrupt the music.
        // Align at playback transitions, then let the native loop run freely.
        const align = !event || ["play", "seeking", "seeked", "loadedmetadata"].includes(event.type) ||
            (event.type === "playing" && ambient.paused);
        if (hasDuration && align) {
            const target = narration.currentTime % duration;
            const difference = Math.abs(ambient.currentTime - target);
            if (difference > 0.001) {
                ambient.currentTime = target;
            }
        }

        if (
            !hasDuration || narration.paused || narration.ended || narration.seeking ||
            narration.readyState < 3 || event?.type === "waiting"
        ) {
            ambient.pause();
            return;
        }

        if (ambient.paused && !playPending) {
            playPending = true;
            void ambient.play().catch((error: unknown) => {
                if (!disposed && !(error instanceof DOMException && error.name === "AbortError")) {
                    ambient.pause();
                    onError();
                }
            }).finally(() => { playPending = false; });
        }
    };

    const handleError = () => {
        ambient.pause();
        onError();
    };
    const events = ["play", "playing", "pause", "ended", "seeking", "seeked", "waiting", "canplay", "ratechange"];
    events.forEach(event => narration.addEventListener(event, sync));
    ambient.addEventListener("loadedmetadata", sync);
    ambient.addEventListener("canplay", sync);
    ambient.addEventListener("error", handleError);
    sync();

    return () => {
        disposed = true;
        events.forEach(event => narration.removeEventListener(event, sync));
        ambient.removeEventListener("loadedmetadata", sync);
        ambient.removeEventListener("canplay", sync);
        ambient.removeEventListener("error", handleError);
        ambient.pause();
    };
}
