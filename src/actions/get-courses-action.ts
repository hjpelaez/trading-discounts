"use server";

import { getCourses, CourseDB } from "@/lib/db";

export async function fetchMoreCourses(
    page: number,
    filters: { category?: string; language?: string; minPrice?: number; maxPrice?: number }
): Promise<CourseDB[]> {
    return await getCourses({
        ...filters,
        page,
        pageSize: 12
    });
}
