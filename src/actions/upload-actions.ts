"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export async function uploadImageAction(formData: FormData) {
    try {
        console.log("Upload action started");
        const file = formData.get("file") as File;
        const slug = formData.get("slug") as string;

        console.log(`File: ${file?.name}, Size: ${file?.size}, Slug: ${slug}`);

        if (!file || !slug) {
            console.error("Missing file or slug");
            return { error: "Missing file or slug" };
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Clean slug and filename
        const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
        // Get extension (default to jpg if missing, though typically present)
        const ext = path.extname(file.name) || ".jpg";

        // Timestamp to prevent caching issues if replaced
        const timestamp = Date.now();
        const filename = `${cleanSlug}-${timestamp}${ext}`;

        const uploadDir = path.join(process.cwd(), "public/images/blog");
        const filePath = path.join(uploadDir, filename);
        console.log(`Target path: ${filePath}`);

        // Ensure dir exists (redundant if mkdir run, but safe)
        try {
            await fs.access(uploadDir);
        } catch {
            console.log("Creating directory...");
            await fs.mkdir(uploadDir, { recursive: true });
        }

        console.log("Writing file...");
        await fs.writeFile(filePath, buffer);
        console.log("File written successfully");

        const publicUrl = `/images/blog/${filename}`;

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Failed to upload image: " + (error as Error).message };
    }
}
