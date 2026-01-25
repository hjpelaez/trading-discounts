"use server";

import { saveBlogCategory, deleteBlogCategory } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addCategoryAction(formData: FormData) {
    const category = formData.get("category") as string;
    if (!category || category.trim() === "") return;

    await saveBlogCategory(category.trim());
    revalidatePath("/admin/blog");
    revalidatePath("/admin/blog/categories");
}

export async function deleteCategoryAction(category: string) {
    await deleteBlogCategory(category);
    revalidatePath("/admin/blog");
    revalidatePath("/admin/blog/categories");
}
