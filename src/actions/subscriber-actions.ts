"use server";

import { saveSubscriber } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function subscribeAction(email: string) {
    try {
        await saveSubscriber(email);
        return { success: true };
    } catch (error) {
        console.error("Subscription error:", error);
        return { success: false, error: "Failed to subscribe" };
    }
}
