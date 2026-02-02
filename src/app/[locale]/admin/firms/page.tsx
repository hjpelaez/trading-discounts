import { getFirms } from "@/lib/db";
import { Pencil, Trash2, PlusCircle, Building2, ExternalLink, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";
import { toggleFirmVisibilityAction, deleteFirmAction } from "@/actions/firm-actions";

export const dynamic = 'force-dynamic';

export default async function AdminFirmsPage() {
    const firms = await getFirms({ admin: true });

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
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nombre / Código</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Descuento</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Visibilidad</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Puntuación</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {firms.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <div className="p-20 text-center text-muted-foreground bg-muted/5">
                                            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                            <p className="text-lg font-bold">No se encontraron firmas</p>
                                            <p className="text-sm">Crea tu primera oferta para empezar a atraer traders.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                firms.map((firm) => (
                                    <tr key={firm.id} className="transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{firm.name}</span>
                                                <span className="text-xs text-muted-foreground font-mono">{firm.code}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle font-mono font-bold text-primary">
                                            {firm.discount}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border",
                                                firm.isVisible !== false
                                                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                                                    : "bg-red-500/10 text-red-600 border-red-500/20"
                                            )}>
                                                {firm.isVisible !== false ? (
                                                    <><div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Público</>
                                                ) : (
                                                    <><div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Oculto</>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-yellow-500 font-bold">
                                            ★ {firm.rating}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2 text-nowrap">
                                                <form action={toggleFirmVisibilityAction.bind(null, firm.id, firm.isVisible !== false)}>
                                                    <button
                                                        type="submit"
                                                        className={cn(
                                                            "p-2 rounded-lg transition-all border shadow-sm hover:shadow-md",
                                                            firm.isVisible !== false
                                                                ? "text-green-600 border-green-500/20 hover:bg-green-500/10"
                                                                : "text-red-500 border-red-500/20 hover:bg-red-500/10"
                                                        )}
                                                        title={firm.isVisible !== false ? "Ocultar Firma" : "Mostrar Firma"}
                                                    >
                                                        {firm.isVisible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                    </button>
                                                </form>
                                                <Link
                                                    href={firm.link}
                                                    target="_blank"
                                                    title="Ver en web (Externo)"
                                                    className="p-2 text-muted-foreground border border-border/50 hover:bg-muted rounded-lg transition-all shadow-sm hover:shadow-md"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/firms/${firm.id}`}
                                                    className="p-2 text-blue-500 border border-blue-500/20 hover:bg-blue-500/10 rounded-lg transition-all shadow-sm hover:shadow-md"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <form action={deleteFirmAction.bind(null, firm.id)}>
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
            </FadeIn>
        </div>
    );
}
