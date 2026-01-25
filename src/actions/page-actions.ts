"use server";

import { deletePage, savePage } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePageAction(slug: string) {
    await deletePage(slug);
    revalidatePath("/admin/pages");
}

export async function savePageAction(formData: FormData) {
    const originalSlug = formData.get("originalSlug") as string | null;

    const slugEn = (formData.get("slug_en") as string).toLowerCase().replace(/\s+/g, '-');
    const slugEs = (formData.get("slug_es") as string).toLowerCase().replace(/\s+/g, '-');

    // We use the English slug as the primary key for checking existence IF we can't find original
    // But better to check if EITHER matches original

    // If slug changed, delete old one
    if (originalSlug && (originalSlug !== slugEn)) {
        await deletePage(originalSlug);
    }

    const page = {
        slug: {
            en: slugEn,
            es: slugEs
        },
        title: {
            en: formData.get("title_en") as string,
            es: formData.get("title_es") as string,
        },
        content: {
            en: formData.get("content_en") as string,
            es: formData.get("content_es") as string,
        },
        lastUpdated: new Date().toISOString(),
    };

    await savePage(page);

    revalidatePath("/admin/pages");
    revalidatePath(`/${slugEn}`);
    revalidatePath(`/${slugEs}`);
    redirect("/admin/pages");
}
