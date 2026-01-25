"use server";

import { createClient } from "@/lib/supabase/server";
import path from "path";

export async function uploadImageAction(formData: FormData) {
    try {
        console.log("Upload action started (Supabase)");
        const file = formData.get("file") as File;
        const slug = formData.get("slug") as string;

        if (!file || !slug) {
            console.error("Missing file or slug");
            return { error: "Missing file or slug" };
        }

        const supabase = await createClient();

        // Clean slug and filename
        const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
        const ext = path.extname(file.name) || ".jpg";
        const timestamp = Date.now();
        const filename = `${cleanSlug}-${timestamp}${ext}`; // e.g. my-post-123456789.jpg

        const buffer = await file.arrayBuffer();

        // Upload to 'blog-images' bucket
        const { data, error } = await supabase
            .storage
            .from('blog-images')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false // Default to false, unique names preferred
            });

        if (error) {
            console.error("Supabase Storage Error:", error);
            return { error: "Storage upload failed: " + error.message };
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('blog-images')
            .getPublicUrl(filename);

        console.log(`File uploaded to: ${publicUrl}`);

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Upload handler error:", error);
        return { error: "Failed to upload image: " + (error as Error).message };
    }
}
