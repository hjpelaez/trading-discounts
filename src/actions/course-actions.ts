"use server";

import { deleteCourse, saveCourse, getCourseById } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteCourseAction(id: string) {
    try {
        await deleteCourse(id);
        revalidatePath("/", "layout");
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
}

export async function toggleCourseVisibilityAction(id: string, currentVisibility: boolean) {
    try {
        const course = await getCourseById(id);
        if (!course) throw new Error("Course not found");

        await saveCourse({ ...course, isVisible: !currentVisibility });
        revalidatePath("/", "layout");
    } catch (error) {
        console.error("Error toggling course visibility:", error);
        throw error;
    }
}
