// Libraries
import { useEffect, useState } from "react";

// My components
import Link from "../components/Link";

// Posts (explicit typed import map — add a new post by importing its JSON
// and appending an entry below; keeps everything build-time and type-checked)
import post001 from "../resources/thoughts/001.json";

// Styles
import '../css/thoughts.css';


type Post =
{
    number: string
    title: string
    content: string
};

const POSTS: Post[] = [
    { number: "001", title: post001.title, content: post001.content },
].sort((a, b) => Number(a.number) - Number(b.number));

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
                {
                    post.content.split('\n').map(
                        (line: string, i: number) =>
                            <p key={i} className="thought-text">
                                { line }
                            </p>
                    )
                }
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
		<div>
            <p>
                {content}
            </p>
		</div>
	);
}

export default Thoughts;
