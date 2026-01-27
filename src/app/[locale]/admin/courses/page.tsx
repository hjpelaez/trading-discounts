import Link from "next/link";
import { PlusCircle, Pencil, Trash2, ExternalLink } from "lucide-react";
import { getCourses, deleteCourse, CourseDB } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { FadeIn } from "@/components/animations";

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
    const courses = await getCourses();
    const t = await getTranslations("Admin");

    async function deleteCourseAction(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        await deleteCourse(id);
        revalidatePath("/admin/courses");
    }

    // Helper to get Spanish title for the list
    const getTitle = (course: CourseDB) => {
        return course.title;
    };

    return (
        <FadeIn>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de Cursos</h1>
                        <p className="text-muted-foreground text-sm">
                            Administra tu catálogo de cursos y ofertas educativas.
                        </p>
                    </div>
                    <Link
                        href="/admin/courses/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Nuevo Curso
                    </Link>
                </div>

                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                                    #
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Curso
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Detalles
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Precio
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-muted-foreground">
                                        No se encontraron cursos. Crea uno para comenzar.
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course, index) => (
                                    <tr key={course.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{index + 1}</td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">
                                                    {getTitle(course)}
                                                </span>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground font-semibold">{course.category}</span>
                                                    <span>•</span>
                                                    <span>{course.instructor}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="text-xs space-y-1">
                                                <div><span className="font-semibold">Idioma:</span> {course.language}</div>
                                                <div><span className="font-semibold">Nivel:</span> {course.level}</div>
                                                <div><span className="text-yellow-500">★ {course.rating}</span></div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle font-mono font-medium text-primary">
                                            {course.priceLabel}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/courses?highlight=${course.id}`}
                                                    target="_blank"
                                                    title="Ver en web"
                                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/courses/${course.id}`}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <form action={deleteCourseAction}>
                                                    <input type="hidden" name="id" value={course.id} />
                                                    <button
                                                        type="submit"
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </FadeIn>
    );
}
