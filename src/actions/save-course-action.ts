"use server";

import { saveCourse, CourseDB, getCourseById } from "@/lib/db"; // Assuming saveCourse handles CourseDB interface
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveCourseAction(data: CourseDB) {
    await saveCourse(data);
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    // We don't redirect here, let the client handle it or redirect if new
}
