import { getPages } from "@/lib/db";
import { deletePageAction } from "@/actions/page-actions";
import Link from "next/link";
import { Pencil, Trash2, Plus, FileText, ExternalLink, PlusCircle } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";

export default async function AdminPagesDashboard() {
    const pages = await getPages();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Gestor de Páginas</h1>
                    <p className="text-muted-foreground text-sm">Administra las páginas institucionales y legales.</p>
                </div>
                <Link
                    href="/admin/pages/new"
                    className="inline-flex items-center gap-2 h-10 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] border border-blue-400/20"
                >
                    <PlusCircle className="h-4 w-4" /> Nueva Página
                </Link>
            </div>

            <FadeIn>
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Título</th>
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Slug (URL)</th>
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Actualización</th>
                                <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground font-black">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {pages.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-0">
                                        <div className="p-20 text-center text-muted-foreground bg-muted/5">
                                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                            <p className="text-lg font-bold text-white">No hay páginas creadas</p>
                                            <p className="text-sm">Crea tus políticas legales o secciones informativas aquí.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pages.map((page) => (
                                    <tr key={page.slug.en} className="transition-colors hover:bg-muted/50 group">
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white group-hover:text-primary transition-colors">{page.title.es}</span>
                                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">{page.title.en}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle font-mono text-muted-foreground">
                                            <div className="flex flex-col gap-0.5 text-[10px]">
                                                <span className="flex items-center gap-1 opacity-70"><span className="text-blue-400 font-bold w-4">EN:</span> /{page.slug.en}</span>
                                                <span className="flex items-center gap-1"><span className="text-blue-500 font-bold w-4">ES:</span> /{page.slug.es}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-xs font-medium">
                                            {new Date(page.lastUpdated).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/es/${page.slug.es}`}
                                                    target="_blank"
                                                    title="Ver Página Pública"
                                                    className="p-2 text-muted-foreground border border-border/50 hover:bg-muted/80 rounded-lg transition-all shadow-sm hover:shadow-md"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/pages/${page.slug.en}`}
                                                    className="p-2 text-blue-500 border border-blue-500/20 hover:bg-blue-500/10 rounded-lg transition-all shadow-sm hover:shadow-md"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <form action={deletePageAction.bind(null, page.slug.en)}>
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
