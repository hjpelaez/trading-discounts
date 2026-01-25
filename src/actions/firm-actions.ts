"use server";

import { deleteFirm, saveFirm } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto"; // Keep this import as crypto.randomUUID() is used

export async function deleteFirmAction(id: string) {
    await deleteFirm(id);
    revalidatePath("/");
    revalidatePath("/admin");
}

export async function saveFirmAction(formData: FormData) {
    const id = formData.get("id") as string || randomUUID(); // Use randomUUID from import

    // Helper to parse comma-separated values
    const parseArray = (value: string | null): string[] => {
        if (!value) return [];
        return value.split(",").map(s => s.trim()).filter(Boolean);
    };

    // Helper to parse optional number
    const parseNumber = (value: string | null): number | null => {
        if (!value) return null;
        const num = parseInt(value, 10);
        return isNaN(num) ? null : num;
    };

    const firm = {
        id,
        // Basic Info
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        link: formData.get("link") as string,
        imageUrl: (formData.get("imageUrl") as string) || null,
        discount: formData.get("discount") as string,
        code: formData.get("code") as string,
        featured: formData.get("featured") === "on",

        // Ratings
        rating: parseFloat(formData.get("rating") as string),
        trustpilotScore: parseFloat(formData.get("trustpilotScore") as string) || null,

        // Firm Details
        country: (formData.get("country") as string) || null,
        activeYears: parseNumber(formData.get("activeYears") as string),
        maxAllocation: (formData.get("maxAllocation") as string) || null,
        broker: (formData.get("broker") as string) || null,

        // Categories & Platforms
        categories: parseArray(formData.get("categories") as string),
        platforms: parseArray(formData.get("platforms") as string),
        instruments: parseArray(formData.get("instruments") as string),
        assets: parseArray(formData.get("assets") as string),

        // Trading Info
        minPrice: parseInt(formData.get("minPrice") as string, 10),
        maxLeverage: formData.get("maxLeverage") as string,
        drawdownType: formData.get("drawdownType") as "Trailing" | "Static" | "Balance-based" | "Step-based",

        // Features & Rules
        features: parseArray(formData.get("features") as string),
        rules: parseArray(formData.get("rules") as string),
        consistencyRules: (formData.get("consistencyRules") as string) || null,
        prohibitedPractices: parseArray(formData.get("prohibitedPractices") as string),

        // Payout Info
        paymentMethods: parseArray(formData.get("paymentMethods") as string),
        payoutMethods: parseArray(formData.get("payoutMethods") as string),
        payoutFrequency: (formData.get("payoutFrequency") as string) || null,
        minPayout: (formData.get("minPayout") as string) || null,
    };

    await saveFirm(firm);
    revalidatePath("/admin");
    revalidatePath("/");
    redirect("/admin");
}
