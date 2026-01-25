'use server'

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteSubscriberAction(id: string) {
    try {
        const supabase = await createClient();
        await supabase
            .from('Subscriber')
            .delete()
            .eq('id', id);

        revalidatePath('/admin/subscribers');
    } catch (error) {
        console.error("Error deleting subscriber:", error);
    }
}

export async function subscribeAction(email: string) {
    try {
        const supabase = await createClient();

        // Check if already exists
        const { data: existing } = await supabase
            .from('Subscriber')
            .select('id')
            .eq('email', email)
            .single();

        if (!existing) {
            await supabase
                .from('Subscriber')
                .insert([{ email }]);
        }

        return { success: true };
    } catch (error) {
        console.error("Error subscribing:", error);
        return { success: false, error: "Failed to subscribe" };
    }
}

export async function exportSubscribersToCSV() {
    try {
        const supabase = await createClient();
        const { data: subscribers, error } = await supabase
            .from('Subscriber')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;

        // Create CSV header
        const headers = ['Name', 'Email', 'Registration Date'];

        // Create CSV rows
        const rows = subscribers?.map(sub => [
            sub.name || 'N/A',
            sub.email,
            new Date(sub.createdAt).toLocaleString('es-ES')
        ]) || [];

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return { success: true, data: csvContent };
    } catch (error) {
        console.error("Error exporting subscribers:", error);
        return { success: false, error: "Failed to export subscribers" };
    }
}
