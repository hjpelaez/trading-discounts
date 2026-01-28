"use server";

import { saveCourse, CourseDB, getCourseById } from "@/lib/db"; // Assuming saveCourse handles CourseDB interface
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveCourseAction(data: CourseDB) {
    try {
        console.log("Saving course to DB:", data.id);
        await saveCourse(data);
        console.log("Course saved successfully. Revalidating all paths...");
        revalidatePath("/", "layout");
    } catch (error) {
        console.error("CRITICAL ERROR SAVING COURSE:", error);
        throw error;
    }
}
