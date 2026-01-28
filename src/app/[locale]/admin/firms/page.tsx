import { getFirms } from "@/lib/db";
import { deleteFirmAction } from "@/actions/firm-actions";
import Link from "next/link";
import { Pencil, Trash2, PlusCircle, Building2, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/animations";

export const dynamic = 'force-dynamic';

export default async function AdminFirmsPage() {
    const firms = await getFirms();

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestionar Firmas</h1>
                    <p className="text-muted-foreground text-sm">Administra el listado de prop firms y sus ofertas en tiempo real.</p>
                </div>
                <Link
                    href="/admin/firms/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                    <PlusCircle className="h-4 w-4" /> Añadir Firma
                </Link>
            </div>

            <FadeIn>
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
            </FadeIn>
        </div>
    );
}
