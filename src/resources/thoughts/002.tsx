import type { Post } from "./types";
import { POSTS_BY_ID } from "./catalog";

const post: Post = {
    ...POSTS_BY_ID["002"],
    content: (
        <p>
            I have not written anything here yet. Posts will be added as soon as I will stop being lazy and will start writing.
        </p>
    ),
};

export default post;
