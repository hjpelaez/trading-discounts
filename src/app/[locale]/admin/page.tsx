import { getFirms, getBlogPosts, getSubscribers, getCourses } from "@/lib/db";
import Link from "next/link";
import { PlusCircle, Building2, FileText, Users, TrendingUp, GraduationCap } from "lucide-react";
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
                    <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
                    <p className="text-muted-foreground text-sm">Bienvenido de nuevo. Aquí tienes un resumen de tu sitio.</p>
                </div>
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
        </div>
    );
}
