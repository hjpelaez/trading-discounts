import { getSubscribers } from "@/lib/db";
import { Mail, Calendar, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/animations";

export default async function SubscribersPage() {
    const subscribers = await getSubscribers();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Suscriptores (Email)</h1>
                    <p className="text-muted-foreground">Gestiona tus leads de marketing y exporta datos.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold border border-primary/20">
                        {subscribers.length} Leads Totales
                    </div>
                </div>
            </div>

            <FadeIn>
                <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground leading-none">Email</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground leading-none">Fecha Suscripción</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground leading-none text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {subscribers.length > 0 ? (
                                subscribers.map((s, i) => (
                                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <span className="font-bold">{s.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(s.subscribedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                                                Gestionar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                                        No hay suscriptores todavía. ¡Empieza tus campañas de marketing!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="font-bold text-blue-500 flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" /> Exportar Datos
                        </h3>
                        <p className="text-sm text-muted-foreground">Descarga tu lista de suscriptores para usar en herramientas como Mailchimp o Brevo.</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all">
                        Exportar CSV
                    </button>
                </div>
            </FadeIn>
        </div>
    );
}
