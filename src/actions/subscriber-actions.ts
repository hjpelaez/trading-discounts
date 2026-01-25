'use server'

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function deleteSubscriberAction(id: string) {
    try {
        await prisma.subscriber.delete({
            where: { id }
        });

        revalidatePath('/admin/subscribers');
    } catch (error) {
        console.error("Error deleting subscriber:", error);
    }
}

export async function subscribeAction(email: string) {
    try {
        // Upsert to handle existing emails gracefully (or just create and catch error)
        // Since we want to be idempotent for newsletter:
        const existing = await prisma.subscriber.findUnique({
            where: { email }
        });

        if (!existing) {
            await prisma.subscriber.create({
                data: {
                    email,
                    // source removed from schema
                }
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error subscribing:", error);
        return { success: false, error: "Failed to subscribe" };
    }
}

return { success: true };
    } catch (error) {
    console.error("Error subscribing:", error);
    return { success: false, error: "Failed to subscribe" };
}
}
