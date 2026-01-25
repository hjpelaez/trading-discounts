import { getFirms, getBlogPosts, getSubscribers } from "@/lib/db";
import { deleteFirmAction } from "@/actions/firm-actions";
import Link from "next/link";
import { Edit, Trash2, Plus, Building2, FileText, Users, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/animations";

export default async function AdminDashboard() {
    const firms = await getFirms();
    const posts = await getBlogPosts();
    const subscribers = await getSubscribers();

    const stats = [
        { label: "Firmas Totales", value: firms.length, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Artículos Blog", value: posts.length, icon: FileText, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { label: "Suscriptores", value: subscribers.length, icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Panel de Control</h1>
                    <p className="text-muted-foreground text-sm">Bienvenido de nuevo. Aquí tienes un resumen de tu sitio.</p>
                </div>
                <Link
                    href="/admin/firms/new"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                >
                    <Plus className="mr-2 h-4 w-4" /> Añadir Firma
                </Link>
            </div>

            {/* Stats Grid */}
            <FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-tighter">
                                <TrendingUp className="h-3 w-3" /> Datos en Vivo
                            </div>
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
                    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-muted/50 text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b">
                                <tr>
                                    <th className="px-6 py-4">Nombre</th>
                                    <th className="px-6 py-4">Código</th>
                                    <th className="px-6 py-4">Descuento</th>
                                    <th className="px-6 py-4">Puntuación</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {firms.map((firm) => (
                                    <tr key={firm.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 font-bold">{firm.name}</td>
                                        <td className="px-6 py-4"><span className="bg-muted px-2 py-1 rounded font-mono text-xs text-muted-foreground">{firm.code}</span></td>
                                        <td className="px-6 py-4 text-primary font-black">{firm.discount}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-yellow-500 font-bold">★ {firm.rating}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/firms/${firm.id}`}
                                                    className="p-2 hover:bg-muted hover:text-primary rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <form action={deleteFirmAction.bind(null, firm.id)}>
                                                    <button
                                                        type="submit"
                                                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
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
