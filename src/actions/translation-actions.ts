"use server";

import { saveDynamicTranslation, deleteDynamicTranslation } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveTranslationAction(formData: FormData) {
    const key = formData.get("key") as string;
    const en = formData.get("en") as string;
    const es = formData.get("es") as string;

    if (!key) return;

    await saveDynamicTranslation(key, en, es);
    revalidatePath("/admin/translations");
}

export async function deleteTranslationAction(key: string) {
    if (!key) return;

    await deleteDynamicTranslation(key);
    revalidatePath("/admin/translations");
}
