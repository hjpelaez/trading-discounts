import { getFirms, getBlogPosts, getSubscribers, getCourses } from "@/lib/db";
import { deleteFirmAction } from "@/actions/firm-actions";
import Link from "next/link";
import { Pencil, Trash2, PlusCircle, Building2, FileText, Users, TrendingUp, ExternalLink, GraduationCap } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { GrowthChart } from "@/components/admin/growth-chart";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const firms = await getFirms();
    const posts = await getBlogPosts();
    const subscribers = await getSubscribers();
    const courses = await getCourses();

    const stats = [
        { label: "Firmas Totales", value: firms.length, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Cursos", value: courses.length, icon: GraduationCap, color: "text-violet-500", bg: "bg-violet-500/10" },
        { label: "Artículos Blog", value: posts.length, icon: FileText, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { label: "Suscriptores", value: subscribers.length, icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
                    <p className="text-muted-foreground text-sm">Bienvenido de nuevo. Aquí tienes un resumen de tu sitio.</p>
                </div>
                <Link
                    href="/admin/firms/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                    <PlusCircle className="h-4 w-4" /> Añadir Firma
                </Link>
            </div>

            {/* Stats Grid */}
            <FadeIn>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                                    <p className="text-4xl font-black">{stat.value}</p>
                                </div>
                                <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>

                            {/* Render Chart only for Subscribers card */}
                            {stat.label === "Suscriptores" ? (
                                <GrowthChart data={subscribers} />
                            ) : (
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-tighter">
                                    <TrendingUp className="h-3 w-3" /> Datos en Vivo
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold tracking-tight">Gestionar Firmas</h2>
                        <p className="text-xs text-muted-foreground font-mono">{firms.length} entradas</p>
                    </div>
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nombre</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Código</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Descuento</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Puntuación</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {firms.map((firm) => (
                                    <tr key={firm.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-bold">{firm.name}</td>
                                        <td className="p-4 align-middle"><span className="bg-muted px-2 py-1 rounded font-mono text-xs text-muted-foreground">{firm.code}</span></td>
                                        <td className="p-4 align-middle text-primary font-black">{firm.discount}</td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center text-yellow-500 font-bold">★ {firm.rating}</div>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={firm.link}
                                                    target="_blank"
                                                    title="Visitar Web"
                                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/firms/${firm.id}`}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <form action={deleteFirmAction.bind(null, firm.id)}>
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
                                ))}
                            </tbody>
                        </table>
                        {firms.length === 0 && (
                            <div className="p-20 text-center text-muted-foreground bg-muted/5">
                                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-bold">No se encontraron firmas</p>
                                <p className="text-sm">Crea tu primera oferta para empezar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
