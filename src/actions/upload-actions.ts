"use server";

import { createClient } from "@/lib/supabase/server";
import path from "path";
import sharp from "sharp";

export async function uploadImageAction(formData: FormData) {
    try {
        console.log("Upload action started (Supabase + Sharp)");
        const file = formData.get("file") as File;
        const slug = formData.get("slug") as string;

        if (!file || !slug) {
            console.error("Missing file or slug");
            return { error: "Missing file or slug" };
        }

        const supabase = await createClient();

        // Convert file to buffer
        const buffer = await file.arrayBuffer();
        const inputBuffer = Buffer.from(buffer);

        // Optimize image with Sharp
        // Resize to max width 1200px, convert to WebP, quality 80
        const optimizedBuffer = await sharp(inputBuffer)
            .resize({ width: 1200, withoutEnlargement: true }) // Don't upscale small images
            .webp({ quality: 80, effort: 4 }) // Effort 4 is a good balance of speed/compression
            .toBuffer();

        // Clean slug and create new filename with .webp extension
        const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
        const timestamp = Date.now();
        const filename = `${cleanSlug}-${timestamp}.webp`;

        // Upload to 'blog-images' bucket
        const { data, error } = await supabase
            .storage
            .from('blog-images')
            .upload(filename, optimizedBuffer, {
                contentType: 'image/webp',
                upsert: false
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

        // console.log(`File optimized and uploaded to: ${publicUrl}`);

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Upload handler error:", error);
        return { error: "Failed to upload image: " + (error as Error).message };
    }
}
