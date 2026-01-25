import { getBlogPosts } from "./db";

export { type BlogPost } from "./db";

export async function getStaticBlogPosts() {
    return await getBlogPosts();
}
