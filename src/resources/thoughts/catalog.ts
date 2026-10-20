export const POSTS = [
    {
        number: "001",
        title: "RELAGRAM",
        description: "Latent recursion for vehicle routing. The ideas, architecture, and engineering behind RELAGRAM.",
        image: "/thoughts/001/preview.jpg",
    },
    {
        number: "002",
        title: "Something here.",
        description: "Notes and thoughts by Vladimir Kirill Bickov.",
    },
];

export const POSTS_BY_ID = Object.fromEntries(POSTS.map(post => [post.number, post]));
