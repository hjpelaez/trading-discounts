import { getSubscribers } from "@/lib/db";
import { deleteSubscriberAction } from "@/actions/subscriber-actions";
import { FadeIn } from "@/components/animations";
import { Users, Mail, Calendar, Trash2 } from "lucide-react";
import { ExportCSVButton } from "@/components/ExportCSVButton";
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
        <FadeIn>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Suscriptores</h1>
                        <p className="text-muted-foreground text-sm">
                            Gestiona los leads capturados desde la landing page.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <ExportCSVButton />
                    </div>
                </div>

                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between bg-muted/50">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Total:</span>
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                                {subscribers.length} leads
                            </span>
                        </div>
                    </div>

                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nombre</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha Registro</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center text-muted-foreground bg-muted/5">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="h-12 w-12 opacity-20" />
                                            <p className="font-bold">No hay suscriptores aún</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((sub) => (
                                    <tr key={sub.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-bold text-foreground">
                                            {sub.name || <span className="text-muted-foreground italic">Sin nombre</span>}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                <span className="text-foreground">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground font-mono text-xs">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(sub.createdAt)}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <form action={deleteSubscriberAction.bind(null, sub.id)}>
                                                <button
                                                    type="submit"
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Eliminar Suscriptor"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
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
