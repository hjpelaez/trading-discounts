import { CourseForm } from "../_components/course-form";
import { getCourseById } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface EditCoursePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
    const { id } = await params;
    const course = await getCourseById(id);

    if (!course) {
        notFound();
    }

    return (
        <div>
            <CourseForm initialData={course} />
        </div>
    );
}
