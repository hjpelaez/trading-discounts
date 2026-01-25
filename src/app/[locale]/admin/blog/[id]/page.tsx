import { getBlogPostById, getBlogCategories } from "@/lib/db";
import { BlogForm } from "@/components/blog-form";
import { notFound } from "next/navigation";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getBlogPostById(id);
    const categories = await getBlogCategories();

    if (!post) notFound();

    return (
        <div className="container mx-auto py-10">
            <BlogForm post={post} categories={categories} />
        </div>
    );
}
