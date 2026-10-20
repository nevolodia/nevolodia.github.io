import Link from "../components/Link";
import type { Post } from "../resources/thoughts/types";
import "../css/thoughts.css";

export default function ThoughtDetail({ post }: { post: Post }) {
    return (
        <div className="thought-page">
            <div className="thought-container">
                <Link link="/thoughts/">← Back</Link>
                <h2 className="thought-heading">{post.title}</h2>
                <div className="thought-content">{post.content}</div>
            </div>
        </div>
    );
}
