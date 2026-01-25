"use server";

import { deleteFirm, getFirmById, saveFirm } from "@/lib/db";
import { PropFirm } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

export async function deleteFirmAction(id: string) {
    await deleteFirm(id);
    revalidatePath("/");
    revalidatePath("/admin");
}

export async function saveFirmAction(formData: FormData) {
    const id = formData.get("id") as string | null;

    // Parse complex fields (JSON strings or comma separated in form)
    // For simplicity in this v1, we assume simple comma separated strings for arrays
    const parseArray = (key: string) => (formData.get(key) as string)?.split(",").map(s => s.trim()).filter(Boolean) || [];

    const firm: PropFirm = {
        id: id || randomUUID(),
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        discount: formData.get("discount") as string,
        code: formData.get("code") as string,
        link: formData.get("link") as string,
        categories: parseArray("categories") as ("crypto" | "forex" | "futures")[],
        featured: formData.get("featured") === "on",
        rating: parseFloat(formData.get("rating") as string) || 0,
        platforms: parseArray("platforms"),
        minPrice: parseFloat(formData.get("minPrice") as string) || 0,
        features: parseArray("features"),
        rules: parseArray("rules"),
        maxLeverage: formData.get("maxLeverage") as string,
        paymentMethods: parseArray("paymentMethods"),
        trustpilotScore: parseFloat(formData.get("trustpilotScore") as string) || 0,
        imageUrl: formData.get("imageUrl") as string,
        drawdownType: formData.get("drawdownType") as "Trailing" | "Static" | "Balance-based" | "Step-based",
    };

    await saveFirm(firm);

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
}
