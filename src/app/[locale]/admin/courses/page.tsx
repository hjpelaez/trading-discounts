import { PlusCircle, Pencil, Trash2, ExternalLink, Eye, EyeOff, BookOpen } from "lucide-react";
import Link from "next/link";
import { getCourses, CourseDB } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";
import { toggleCourseVisibilityAction, deleteCourseAction } from "@/actions/course-actions";

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
    const courses = await getCourses({ admin: true });
    const t = await getTranslations("Admin");


    // Helper for legacy bilingual data
    const getTitle = (course: CourseDB) => {
        const title = course.title;
        if (typeof title === 'string') return title;
        if (typeof title === 'object' && title !== null) {
            return (title as any).es || (title as any).en || "Untitled";
        }
        return "Untitled";
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

                <div className="rounded-xl border bg-card shadow-sm overflow-hidden text-card-foreground">
                    <table className="w-full text-sm text-left border-collapse">
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
                                    Visibilidad
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Precio
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <div className="p-20 text-center text-muted-foreground bg-muted/5">
                                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                            <p className="text-lg font-bold">No se encontraron cursos</p>
                                            <p className="text-sm">Crea tu primer curso educativo para empezar a atraer alumnos.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course, index) => (
                                    <tr key={course.id} className="transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{index + 1}</td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-bold">
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
                                                <div><span className="text-yellow-500 font-bold">★ {course.rating}</span></div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border",
                                                (course.isVisible !== false)
                                                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                                                    : "bg-red-500/10 text-red-600 border-red-500/20"
                                            )}>
                                                {(course.isVisible !== false) ? (
                                                    <><div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Visible</>
                                                ) : (
                                                    <><div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Oculto</>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle font-mono font-bold text-primary text-xs">
                                            {course.priceLabel}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2 text-nowrap">
                                                <form action={toggleCourseVisibilityAction.bind(null, course.id, course.isVisible !== false)}>
                                                    <button
                                                        type="submit"
                                                        className={cn(
                                                            "p-2 rounded-lg transition-all border shadow-sm hover:shadow-md",
                                                            (course.isVisible !== false)
                                                                ? "text-green-600 border-green-500/20 hover:bg-green-500/10"
                                                                : "text-red-500 border-red-500/20 hover:bg-red-500/10"
                                                        )}
                                                        title={(course.isVisible !== false) ? "Ocultar Curso" : "Mostrar Curso"}
                                                    >
                                                        {(course.isVisible !== false) ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                    </button>
                                                </form>
                                                <Link
                                                    href={course.link}
                                                    target="_blank"
                                                    title="Ver en web"
                                                    className="p-2 text-muted-foreground border border-border/50 hover:bg-muted rounded-lg transition-all shadow-sm hover:shadow-md"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/courses/${course.id}`}
                                                    className="p-2 text-blue-500 border border-blue-500/20 hover:bg-blue-500/10 rounded-lg transition-all shadow-sm hover:shadow-md"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <form action={deleteCourseAction.bind(null, course.id)}>
                                                    <button
                                                        type="submit"
                                                        className="p-2 text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-all shadow-sm hover:shadow-md"
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
        </FadeIn >
    );
}
