// Libraries
import { useEffect, useMemo, useState } from "react";

// My components
import Link from "../components/Link";

// Styles
import '../css/thoughts.css';


type ThoughtIndex =
{
    list:
    {
        number: string
        title?: string
    }[]
    byNumber: Record<string, any>
};

function createThoughtsIndex(): ThoughtIndex
{
    try
    {
        const ctx = (require as any).context('../resources/thoughts', false, /\.json$/);
        const entries:
        {
            number: string
            title?: string
        }[] = ctx.keys()
            .map((k: string) =>
            {
                const match = k.match(/(\d+)\.json$/);
                const num = match ? match[1] : k.replace('./', '');
                const data = ctx(k);
                const title = (data?.title || data?.heading || `Thought ${num}`) as string | undefined;
                return {
                    number: num,
                    title
                };
            })
            .sort((a: any, b: any) => Number(a.number) - Number(b.number));
        
        const byNumber: Record<string, any> = {};
        entries.forEach((e) =>
        {
            try
            {
                byNumber[e.number] = ctx(`./${e.number}.json`);
            }
            catch {}
        });
        return {
            list: entries,
            byNumber
        };
    }
    catch
    {
        return {
            list: [],
            byNumber: {}
        } as ThoughtIndex;
    }
}

function normalizeThoughtId(id: string): string
{
    return String(Number(id)).padStart(3, '0');
}

function extractHeading(payload: any, thought: string): string
{
    return payload?.title || payload?.heading || `Thought ${Number(thought)}`;
}

function extractBody(payload: any): string | any
{
    return payload?.content || payload?.text || payload?.body || payload;
}

function renderThoughtDetail(payload: any, thought: string): React.ReactNode
{
    const heading = extractHeading(payload, thought);
    const body = extractBody(payload);

    return (
        <div className="thought-container">
            <Link link="?p=thoughts">
                ← Back
            </Link>
            <h2 className="thought-heading">
                { heading }
            </h2>
            <div className="thought-content">
                {typeof body === 'string' ? body.split('\n').map((line: string, i: number) => <p key={i}>{line}</p>) : String(body)}
            </div>
        </div>
    );
}

function renderThoughtList(
    list:
    {
        number: string
        title?: string
    }[]
): React.ReactNode
{
    return (list.length ? list : []).map((t, index) => (
        <div key={t.number}>
            {index + 1}. <Link link={`?p=thoughts&thought=${t.number}`}>{t.title || `Thought ${t.number}`}</Link>
        </div>
    ));
}


function Thoughts()
{
    // if we have ?thought=n, we show the thought
    // otherwise, we show the selection of thoughts

    const [content, setContent] = useState<React.ReactNode>(null);
    const [thought, setThought] = useState<string | null>(null);

    // Build-time scan of resources/thoughts for json files
    const thoughtsIndex = useMemo<ThoughtIndex>(() => createThoughtsIndex(), []);

    useEffect(() =>
    {
        const handleUrlChange = () =>
        {
            const urlParams = new URLSearchParams(window.location.search);
            const thought = urlParams.get('thought');
            setThought(thought);
        };

        // Initial load
        handleUrlChange();

        // Listen for URL changes
        window.addEventListener('popstate', handleUrlChange);
        return () => window.removeEventListener('popstate', handleUrlChange);
    }, []);

    useEffect(() =>
    {
        const loadContent = () => {
            if (thought) {
                try {
                    const thoughtStr = normalizeThoughtId(thought);
                    const data = thoughtsIndex.byNumber[thoughtStr] || thoughtsIndex.byNumber[thought];
                    const payload = (data?.default ?? data) as any;
                    if (!payload) throw new Error('Not found');
                    setContent(renderThoughtDetail(payload, thought));
                } catch (error) {
                    console.error('Error loading thought:', error);
                    setContent(<div>Error loading thought content</div>);
                }
            } else {
                setContent(renderThoughtList(thoughtsIndex.list));
            }
        };

        loadContent();
    }, [thought, thoughtsIndex]);

    
	return (
		<div>
            <p>
                {content}
            </p>
		</div>
	);
}

export default Thoughts;