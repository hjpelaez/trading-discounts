'use server'

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function deleteSubscriberAction(id: string) {
    try {
        await prisma.subscriber.delete({
            where: { id }
        });

        revalidatePath('/admin/subscribers');
        return { success: true };
    } catch (error) {
        console.error("Error deleting subscriber:", error);
        return { success: false, error: "Failed to delete subscriber" };
    }
}
