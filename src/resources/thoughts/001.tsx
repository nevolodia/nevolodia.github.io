import type { Post } from "./types";
import { POSTS_BY_ID } from "./catalog";
import ThoughtVideo, { ThoughtLoop } from "../../components/ThoughtVideo";
import RelagramAudio from "./RelagramAudio";

const post: Post = {
    ...POSTS_BY_ID["001"],
    content: (
        <>
            <RelagramAudio />

            <div style={{height: "0.5lh"}} />

            <p>
                RELAGRAM, my first academic work, was accepted at NeurIPS workshop MLxOR. It applies latent recursion to vehicle routing: a neural model refines an answer in an internal space before producing a solution.
            </p>
            <p>
                This page is the "human-friendly" presentation of the motivations for the research, the story of making it, and the intuition behind the paper's concepts. An academic presentation, technical details and full results are presented in the paper.
            </p>
            
            <p>
                <a href="https://arxiv.org/abs/2610.15106">Read the paper on arXiv!</a>
            </p>

            <ThoughtVideo src="/thoughts/001/main67.mp4" />

        {/* TODO
        - we -> I
        - solution -> answer
        - kool images
        - koold design MAze vs tiME
        - make an article heading
        */}


            <hr />
            <nav>
                <h2>Contents</h2>
                <ol>
                    <li><a href="#latent-recursion">The Idea</a></li>
                    <li><a href="#motivation">Motivation for Thinking in Latent Space</a></li>
                    <li><a href="#puzzles-to-routing">From Puzzles to Routing</a></li>
                    <li><a href="#design-choices">Bounds</a></li>
                    <li><a href="#architecture">Architecture</a></li>
                    <li><a href="#engineering">Re La Gra M Engineering</a></li>
                    <li><a href="#depth-scaling">The New Scaling Axis</a></li>
                    <li><a href="#opportunities">Results and Opportunities</a></li>
                    <li><a href="#acknowledgments">Thank you</a></li>
                    <li><a href="#poster">Poster</a></li>
                </ol>
            </nav>

            <hr />
            <h2 id="latent-recursion">The Idea</h2>
            <p>
                The latent recursion idea is simple: let a solution to the problem live in an internal state of the neural model, and let the model reason about this solution: repeatedly pass the state through the same network, improving it with each pass.
            </p>
            <p>
                 This comes in contrast to two conventional approaches: producing a solution in a single pass of the model, or starting with an existing solution and using a refinement model to improve the solution in explicit space through big number of small changes.
            </p>
            <p>
                <i>
                Just to clear up the terminology, the internal or latent state is rich, high-dimensional state that lives inside the model; when this state is decoded into the form required by the problem, such as a completed Sudoku grid or a set of vehicle routes, we call it an explicit solution. Notice that an explicit solution is often discrete and is a simple set, or sequence, while the internal state is continuous and orders of magnitude larger. RELAGRAM's internal space spans hundreds of dimensions; those of larger models, especially LLMs, span thousands.
                </i>
            </p>
            <p>
                The distinction between reasoning in latent and explicit space is a little like working through a problem in your head before writing down the answer. You can consider an idea, revise it, turn it over in the shower, or wake up with an insight, all in your head's internal space, without formalizing each thought in explicit space - on paper. Latent recursion gives the neural model ability to do something similar.
            </p>

            <hr />
            <h2 id="motivation">Motivation for Thinking in Latent Space</h2>
            <p>
                The motivation for latent recursion comes from two difficulties: the complexity of solving a combinatorial problem in a single pass, and the loss of information between improvement steps when using a refinement model.
            </p>
            <p>
                In a single pass, the model must navigate an exponentially large solution space, satisfy all constraints, and make many interdependent decisions with limited computation. Deeper networks provide more computation but increase both training and inference costs. Recursion lets us reuse the same network for several passes.
            </p>
            <p>
                Passing only an explicit solution between iterations creates an information bottleneck. Anything the model represented internally but did not express in the explicit solution is lost. In the paper, we call this a form of representational “amnesia”. Latent recursion keeps the latent state lets the model carry this information forward and build on its previous reasoning.
            </p>

            <hr />
            <h2 id="puzzles-to-routing">From Puzzles to Routing</h2>
            <p>
                Latent recursion is not only a compelling-sounding idea: the academic community has obtained promising results from applying it. In particular, very small latent-recursive models have achieved strong results on Sudoku, maze solving, and the ARC-AGI benchmark.
            </p>
            <p>
                ARC-AGI is particularly interesting: this benchmark was developed to measure an LLM's ability to reason, generalize, and learn from a few examples. Yet latent-recursive models have achieved results competitive with those of contemporary frontier LLMs while having orders of magnitude fewer parameters.
            </p>
            <p>
                The promise of latent-recursive models was very nice, so much so that it attracted great attention from the research community. Yet little work has explored the application of latent recursion to graph combinatorial optimization.
            </p>
            <p>
                My work, RELAGRAM, addresses this gap.
            </p>
            <p>
                For the problem to run latent recursion on, I chose the Capacitated Vehicle Routing Problem (CVRP) because it is well known, has practical applications, and is substantially harder than many other graph combinatorial optimization problems such as the Traveling Salesman Problem (TSP).
            </p>
            <ThoughtLoop className="thought-video" src="/thoughts/001/m_1.mp4" muted loop playsInline />
            <p>
                If you are unfamiliar with CVRP, picture a graph whose vertices are customers and a depot storing the goods. Each edge represents a travel route between two locations, and its weight gives the travel cost of the trip. The graph is typically complete, meaning you can directly find the cost of the route between any two locations. Your task is to make deliveries of the goods from the depot to every customer using a fleet of vehicles. The word "capacitated" in the problem's name adds a constraint: each vehicle can carry only a limited load. A valid solution is a set of routes that covers all customers and respects every vehicle's capacity limits.
            </p>
            <p> 
                Travel cost is the sum of the selected route weights. The optimization goal is to minimize the travel cost.
            </p>
            <p>
                This problem is hard because the space of possible solutions is enormous: it grows exponentially with the number of customers. No algorithm to efficiently find an optimal solution is known, making problem NP-hard. A good solution requires coordinating multiple routes while respecting vehicle capacity limits and the relations between customers both within a route and across routes.
            </p>

            <hr />
            <h2 id="design-choices">Bounds</h2>
            <p>
                There are many ways to build a latent-recursive model for CVRP. Limited time and computational resources meant I could not explore them all, so I chose the direction I found most interesting and most useful to investigate. Further, these early choices defined the scope of the study: different choices would have led to different research questions, each worth a study of its own.
            </p>
            <p>
                First, we decide if we want to build an end-to-end model or a refinement model. As described earlier, an end-to-end model will generate a whole solution as the output of a single pass, while a refinement model will start with an existing solution and improve it through a series of small changes.
            </p>
            <p>
                The iterative refinement approach drastically simplifies the model's task by reducing the task into small changes to an existing solution - each change only needs to improve the solution now or make a later improvement possible. That is also why I did not choose this approach. I wanted to put latent recursion to a much harder test: could it solve the full combinatorial problem from scratch? Starting from an existing solution would largely supply the very structure I wanted latent recursion to learn to build: how to group customers into routes and coordinate those routes into a complete answer.
            </p>
            <p>
                Next, I had to decide which problem's and solution's representation to use. For that, a literature review was very useful. Relevant work argued that autoregressive decoding works poorly for latent recursion (Rauba et al., 2026). Of the remaining representations, an edge-based one was the most attractive choice. It was further supported by papers like DIFUSCO showing it to be effective.
            </p>

            <hr />
            <h2 id="architecture">Architecture</h2>
            <p>
                I will now give a brief presentation of the model's architecture. For more details, you may want to refer to the paper.
            </p>
            <p>
                We represent the Capacitated Vehicle Routing Problem as a directed graph and encode its edges as tokens. Encoding every edge would make the token count grow quadratically with the number of vertices. To keep the number of tokens manageable, we encode only edges from each vertex to its k nearest neighbors. In our experiments, we use k of 20.
            </p>

            <ThoughtLoop className="thought-video" src="/thoughts/001/m_3.mp4" muted loop playsInline />

            <p>
                We then initialize two latent states: the answer state and the workspace. The answer state carries the developing solution. The workspace is a scratchpad for the model's intermediate reasoning.
            </p>
            <p>
                We run four cycles of latent recursion on a task. Each cycle has two steps. First,
                we run model on the problem, current answer and scratchpad to produce an updated scratchpad. Second, we run model on the newly updated scratchpad and the current answer to produce an updated answer.
            </p>
            <p>
                The intuition is simple: the model first works out how to improve the answer in the scratchpad, then uses that work to update it.
            </p>
            <p>
                A small Transformer with two blocks performs both updates. We detach the latent states between cycles to stop gradients from propagating across cycles, training each cycle to improve on the state left by the previous one.
            </p>
            <p>
                After the final cycle, the answer state is decoded into per-edge logits: scores for the probability of including an edge in a route. The decoder subsequently uses these scores to build routes and makes sure the vehicles' capacity limits are satisfied.
            </p>
            <p>
                We can turn the same scores into routes in different ways. In the paper, we use greedy decoding, which takes the highest-scoring move at each step; stochastic decoding, which randomly samples moves with probability according to their scores; and search over the routes produced by stochastic decoding.
            </p>
            <p>
                We further use stochastic decoding during training to run REINFORCE with a per-instance mean reward baseline. We also use a self-imitation loss described in what follows.
            </p>

            <hr />
            <h2 id="engineering">Re La Gra M Engineering</h2>
            <p>
                Finally, I will now present some of the engineering work that went into training the model.
            </p>
            <p>
                The very first experiments were promising: the model was able to learn to route. Yet it was plateauing very fast, and training it for longer brought little improvement.
            </p>
            <p>
                Largely, the reason was a limitation of how reinforcement learning works here. It is a powerful technique and a natural fit for routing: optimal reference solutions are rarely available, and suboptimal ones are expensive to find. Instead, we reward the model based on the quality of its own solutions - in our case, how short they are. Computing that reward adds no overhead to training.
            </p>
            <ThoughtLoop className="thought-video" src="/thoughts/001/m_2.mp4" muted loop playsInline />
            <p>
                After some experimentation, I found reinforcement learning technique effective for our model: using stochastic decoding, we sample multiple solutions for each instance-solution pair. We then compare each one's reward with the average.
            </p>
            <p> 
                Unfortunately, the signal still was very sparse.
            </p>
            <p>
                To counter that, I ran many experiments attempting to strengthen the RL signal: such as POMO-style rollouts, entropy regularization, or different RL baselines. Most of these attempts did not help or even made the performance worse.
            </p>
            <p>
                Yet one of the experiments, adding the self-imitation loss to the RL signal, turned out to be very useful. Self imitation is a simple yet clever technique: out of solutions generated for an instance, we take the best and use it as our reference. We then train rest of solutions to lean toward reference with cross-entropy loss, simulating supervised learning. This gives us free training labels, and provides a denser learning signal.
            </p>
            <p>
                A number of other techniques and engineering choices, such as noise-augmented decoding, also helped and became part of the model.
            </p>

            <hr />
            <h2 id="depth-scaling">The New Scaling Axis</h2>
            <p>
                One of the nicest things about RELAGRAM is recursion depth scaling. We always trained the model with four recursion cycles, yet on large graphs it noticeably benefits from additional cycles at inference time. The reason is intuitive: larger, more complex problems require more reasoning, and extra passes give the model more computation to work on them. What makes this particularly pretty is the ability to dynamically adjust the computation at inference time to the size of the problem, with no additional engineering or training required.
            </p>

            <hr />
            <h2 id="opportunities">Results and Opportunities</h2>
            <p>
                RELAGRAM does not reach state-of-the-art performance: other models, including the edge-based DeepACO, produce better solutions. Nevertheless, we do not see the results as a failure. They instead give a proof that latent recursion can work for graph combinatorial optimization, open up a new axis of inference-time scaling, and point to several ways to improve both the model and its training.
            </p>


            <hr />
            <h2 id="acknowledgments">Thank you</h2>
            <p>
                I thank my advisor, Neil Yorke-Smith, for his guidance and support throughout this project! I further thank the NeurIPS 2026 MLxOR reviewers for their feedback and the MLxOR organizers for accepting the paper and hosting the workshop! I lastly thank BeNeLearn 2026 for accepting the paper as well!
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
