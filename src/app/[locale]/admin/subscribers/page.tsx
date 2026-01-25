import { getSubscribers } from "@/lib/db";
import { deleteSubscriberAction } from "@/actions/subscriber-actions";
import { FadeIn } from "@/components/animations";
import { Users, Mail, Calendar, Download, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function SubscribersPage() {
    const subscribers = await getSubscribers();

    // Format date helper
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" />
                        Suscriptores
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Gestiona los leads capturados desde la landing page.
                    </p>
                </div>
                <button
                    className="inline-flex items-center justify-center rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-all opacity-50 cursor-not-allowed"
                    title="Próximamente"
                >
                    <Download className="mr-2 h-4 w-4" /> Exportar CSV
                </button>
            </div>

            <FadeIn>
                <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                    <div className="p-6 border-b flex items-center justify-between bg-muted/20">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Total:</span>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black">
                                {subscribers.length} leads
                            </span>
                        </div>
                    </div>

                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-muted/50 text-muted-foreground uppercase font-black tracking-wider text-[10px] border-b">
                            <tr>
                                <th className="px-6 py-4">Nombre</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Fecha Registro</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {subscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-bold text-foreground">
                                        {sub.name || <span className="text-muted-foreground italic">Sin nombre</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                            {sub.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(sub.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <form action={deleteSubscriberAction.bind(null, sub.id)}>
                                            <button
                                                type="submit"
                                                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                                                title="Eliminar Suscriptor"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {subscribers.length === 0 && (
                        <div className="p-20 text-center text-muted-foreground bg-muted/5">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-bold">No hay suscriptores aún</p>
                            <p className="text-sm">Comparte tu link para empezar a captar leads.</p>
                        </div>
                    )}
                </div>
            </FadeIn>
        </div>
    );
}
