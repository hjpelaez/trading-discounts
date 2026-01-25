"use server";

import { deleteBlogPost, saveBlogPost, BlogPost } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

export async function deleteBlogPostAction(id: string) {
    await deleteBlogPost(id);
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
}

export async function saveBlogPostAction(formData: FormData) {
    const id = formData.get("id") as string | null;

    const post: BlogPost = {
        id: id || randomUUID(),
        slug: formData.get("slug") as string,
        title: {
            en: formData.get("title_en") as string,
            es: formData.get("title_es") as string,
        },
        excerpt: {
            en: formData.get("excerpt_en") as string,
            es: formData.get("excerpt_es") as string,
        },
        content: {
            en: formData.get("content_en") as string,
            es: formData.get("content_es") as string,
        },
        date: formData.get("date") as string || new Date().toISOString().split('T')[0],
        author: formData.get("author") as string,
        imageUrl: formData.get("imageUrl") as string,
        category: formData.get("category") as string,
    };

    await saveBlogPost(post);

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    redirect("/admin/blog");
}
