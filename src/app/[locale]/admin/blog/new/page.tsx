import { BlogForm } from "@/components/blog-form";
import { getBlogCategories } from "@/lib/db";

export default async function NewBlogPostPage() {
    const categories = await getBlogCategories();

    return (
        <div className="container mx-auto py-10">
            <BlogForm categories={categories} />
        </div>
    );
}
