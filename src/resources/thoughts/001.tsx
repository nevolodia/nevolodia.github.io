import type { Post } from "./types";
import { VideoPlayer, NeutralVideoSkin, Video } from "@videojs/react/video";
import "@videojs/react/video/neutral-skin.css";
import { AudioPlayer, NeutralAudioSkin, Audio } from "@videojs/react/audio";
import "@videojs/react/audio/neutral-skin.css";

const post: Post = {
    number: "001",
    title: "RELAGRAM",
    content: (
        <>
            <div className="thought-audio" style={{padding: "12px", border: "1px solid rgba(255, 255, 255, 0.5)", borderRadius: "12px"}}>
            <AudioPlayer>
                <NeutralAudioSkin>
                    <div style={{fontSize: "1.2rem", fontWeight: 500, marginBottom: "8px"}}>Listen to RELAGRAM</div>
                    <Audio src="/thoughts/relagram-audio.mp3" preload="metadata" />
                </NeutralAudioSkin>
            </AudioPlayer>
            </div>

            <div style={{height: "0.5lh"}} />

            <p>
                Accepted at NeurIPS MLxOR, my first academic work studies the application of latent recursion, a new “fancy” ML architecture, to Graph Combinatorial Optimization.
            </p>
            <p>
                This page provides a user-friendly overview of the paper. More academic description and technical details are available in the paper.
            </p>
            
            <p>
                <a href="https://openreview.net/forum?id=bb4DbQgvgM">Read the paper on OpenReview</a>.
            </p>

            <VideoPlayer>
                <NeutralVideoSkin className="thought-video">
                    <Video src="/thoughts/relagram.mp4" playsInline preload="metadata">
                        <a href="/thoughts/relagram.mp4">Download the video</a>
                    </Video>
                </NeutralVideoSkin>
            </VideoPlayer>

            <hr />
            <nav>
                <h2>Contents</h2>
                <ol>
                    <li><a href="#latent-recursion">The Idea: Latent Recursion</a></li>
                    <li><a href="#motivation">Motivation</a></li>
                    <li><a href="#architecture">Problem and Architecture</a></li>
                    <li><a href="#opportunities">Results and Opportunities</a></li>
                    <li><a href="#poster">Poster</a></li>
                </ol>
            </nav>

            <hr />
            <h2 id="latent-recursion">The Idea: Latent Recursion</h2>
            <p>
                The latent recursion idea is quite simple: have a solution to the problem live in a latent state, and let the model work on it for a few cycles.
            </p>
            <p>
                This comes in contrast to the conventional approach of working with an explicit solution: either producing it in one pass or refining it and decoding it after each pass.
            </p>
            <p>
                The idea is implemented using two latent variables: a solution and a workspace. The latter is a "scratchpad" the model uses to reason. We pass the problem, the current solution, and the previous scratchpad through the model to produce an updated scratchpad. Then, we pass the updated scratchpad and the previous solution through the same model to produce the new solution.
            </p>
            <p>
                After the final latent recursion pass, the solution is decoded to produce the final answer.
            </p>

            <hr />
            <h2 id="motivation">Motivation</h2>
            <p>
                The motivation for applying latent recursion comes from the difficulty of solving a combinatorial problem in one pass and the lack of information flow between passes in refinement approaches.
            </p>
            <p>
                A one-pass solution requires the model to navigate an exponentially large solution space, respect constraints, and make many connected decisions with limited computation. A deeper network gives it more computation but also increases training and inference costs. Recursion lets us reuse the same network for several passes without adding more parameters.
            </p>
            <p>
                There is also an information bottleneck when only the explicit solution is passed between iterations. Anything the model represented internally but did not express in that solution is lost. In the paper, we call this a form of representational “amnesia”. Keeping the latent state allows the model to carry this information forward and build on its previous computation.
            </p>
            <p>
                Lastly, latent-recursive models have already shown strong results on Sudoku, maze solving, and ARC-AGI. We wanted to explore whether this approach could also work for graph combinatorial optimization. 
            </p>

            <hr />
            <h2 id="architecture">Problem and Architecture</h2>
            <p>
                The particular variant of Vehicle Routing we are solving is the Capacitated Vehicle Routing Problem (CVRP). In this problem, a fleet of vehicles with limited capacity must deliver goods to a set of customers. Each customer has a demand, and the goal is to minimize the total distance traveled while satisfying all demands and not exceeding vehicle capacities.
            </p>
            <p>
                The problem is represented as a directed graph, with the depot and customers as vertices. We encode the graph into a set of edge tokens. We then initialize two latent states for each edge: an answer state and a workspace.
            </p>
            <p>
                A small Transformer with two blocks, as described earlier, first updates the workspace using the graph input and both states and then updates the answer state using the new workspace. The latent states are detached between cycles to reduce memory consumption and allow each stage to learn to improve the solution from the previous cycle.
            </p>
            <p>
                After a few cycles, the answer state is decoded into per-edge logits. They are subsequently used by a decoder that builds a route while enforcing feasibility. The logit output is very flexible, allowing greedy and stochastic decoding, as well as a search over candidates.
            </p>
            <p>
                We use stochastic decoding during training to run REINFORCE with a mean baseline. Further, we use self-imitation to make the training signal denser. The shortest sampled route is used as a reference solution for the cross-entropy loss. Self-imitation was found to be very effective in experiments, suggesting that RL alone is not enough to train the model.
            </p>

            <hr />
            <h2 id="opportunities">Results and Opportunities</h2>
            <p>
                RELAGRAM does not reach SOTA performance and, in fact, is outperformed by other models, such as DeepACO, another edge-based model. However, we do not take the results as a failure: we treat them as early proof that recursion can work for graph combinatorial optimization. We also see a novel strength of the approach and several ways to improve the model and its training.
            </p>
            <p>
                RELAGRAM shows potential for a new axis of inference-time scaling: we can increase the computation by increasing the depth of the latent recursion. This gives the model more time to reason about the problem. In experiments, we have found this to be useful on large graphs, ones beyond the training size.
            </p>
            <p>
                We hypothesize that a significant limitation of RELAGRAM is the sparsity of the RL signal. We have seen signs of this in the self-imitation loss, which makes the signal denser and contributes greatly to performance. We further think that other architectures, such as pointer networks, are directions worth investigating.
            </p>
            <p>
                Lastly, dynamic problems are another interesting direction. Take a dynamic vehicle routing problem: one that changes over time and requires online re-planning. If the model scales along the dynamic axis as well as it scales along the recursion axis, it may give us a great opportunity to solve dynamic problems natively with a single model.
            </p>

            <hr />
            <h2 id="poster">Poster</h2>
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
