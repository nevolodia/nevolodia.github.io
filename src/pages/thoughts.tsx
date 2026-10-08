// Libraries
import { useEffect, useState } from "react";

// My components
import Link from "../components/Link";

// Each article owns its metadata and complete body markup.
// Add articles by importing them and including them in POSTS.
import post001 from "../resources/thoughts/001";
import post002 from "../resources/thoughts/002";
import type { Post } from "../resources/thoughts/types";

// Styles
import '../css/thoughts.css';


const POSTS: Post[] = [post001, post002]
    .sort((a, b) => Number(a.number) - Number(b.number));

function normalizeThoughtId(id: string): string
{
    return String(Number(id)).padStart(3, '0');
}

function getPost(id: string): Post | undefined
{
    const normalized = normalizeThoughtId(id);
    return POSTS.find((p) => p.number === normalized || p.number === id);
}

function renderThoughtDetail(post: Post): React.ReactNode
{
    return (
        <div className="thought-container">
            <Link link="?p=thoughts">
                ← Back
            </Link>
            <h2 className="thought-heading">
                { post.title }
            </h2>
            <div className="thought-content">
                {post.content}
            </div>
        </div>
    );
}

function renderThoughtList(list: Post[]): React.ReactNode
{
    return list.map((post, index) => (
        <div key={post.number}>
            {index + 1}. <Link link={`?p=thoughts&thought=${post.number}`}>{post.title}</Link>
        </div>
    ));
}


function Thoughts()
{
    // if we have ?thought=n, we show the thought
    // otherwise, we show the selection of thoughts

    const [thought, setThought] = useState<string | null>(null);

    useEffect(() =>
    {
        const handleUrlChange = () =>
        {
            const urlParams = new URLSearchParams(window.location.search);
            setThought(urlParams.get('thought'));
        };

        // Initial load
        handleUrlChange();

        // Listen for URL changes
        window.addEventListener('popstate', handleUrlChange);
        return () => window.removeEventListener('popstate', handleUrlChange);
    }, []);

    let content: React.ReactNode;
    if (thought)
    {
        const post = getPost(thought);
        content = post
            ? renderThoughtDetail(post)
            : <div>Error loading thought content</div>;
    }
    else
    {
        content = renderThoughtList(POSTS);
    }

	return (
		<div className="thought-page">
            {content}
		</div>
	);
}

export default Thoughts;
