import type { Post } from "./types";
import { VideoPlayer, NeutralVideoSkin, Video } from "@videojs/react/video";
import "@videojs/react/video/neutral-skin.css";

const post: Post = {
    number: "001",
    title: "RELAGRAM",
    content: (
        <>
            <p>
                Accepted at NeurIPS MLxOR, my first academic work studies the application of latent recursion, a new “fancy” ML architecture, to Graph Combinatorial Optimization.
            </p>
            
            <p>
                <a href="https://openreview.net/forum?id=bb4DbQgvgM">Read the paper on OpenReview</a>.
            </p>

            <VideoPlayer>
                <NeutralVideoSkin className="thought-video">
                    <Video src="/thoughts/relagram.mp4" playsInline preload="metadata" aria-label="RELAGRAM video">
                        <a href="/thoughts/relagram.mp4">Download the video</a>
                    </Video>
                </NeutralVideoSkin>
            </VideoPlayer>

            <p>
                Latent recursion repeatedly processes internal representations through the same network. Recent work has shown this approach to be effective on structured reasoning tasks such as Sudoku and maze solving. However, whether latent recursion can support neural routing remains unclear.
            </p>
            <p>
                We introduce RELAGRAM (Recursive Latent Graph Model), a novel approach that brings latent recursion to graph combinatorial optimization.
            </p>
            <p>
                RELAGRAM encodes a capacitated vehicle routing problem (CVRP) instance as edge tokens; a compact Transformer recurrently updates their latent representations. An output head maps the answer state to an edge heatmap, from which an autoregressive decoder constructs a feasible solution.
            </p>
            <p>
                On CVRP-100, the 0.53M-parameter RELAGRAM achieves optimality gaps of 13.4%, 9.8%, and 8.3% under greedy decoding, eightfold symmetry augmentation, and 256-candidate search, respectively. Trained only on CVRP-100, it generalizes zero-shot to CVRP-500 and CVRP-1000, achieving gaps of 15.6% and 21.7% under 256-candidate search.
            </p>
            <p>
                Together, these results demonstrate that latent recursion is a viable approach to neural routing.
            </p>

            <iframe
                src="/relagram/relagram-poster.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
                title="RELAGRAM poster"
                loading="lazy"
                style={{display: "block", border: "none", borderRadius: "8px", width: "100%", aspectRatio: "2 / 3"}}
            />
            <p>
                <a href="/relagram/relagram-poster.pdf" target="_blank" rel="noopener noreferrer">Open poster</a>.
            </p>
        </>
    ),
};

export default post;
