import Link from "../components/Link";
import { POSTS } from "../resources/thoughts/catalog";
import "../css/thoughts.css";

export default function Thoughts() {
    return (
        <div className="thought-page">
            {POSTS.map((post, index) => (
                <div key={post.number}>
                    {index + 1}. <Link link={`/thoughts/${post.number}/`}>{post.title}</Link>
                </div>
            ))}
        </div>
    );
}
