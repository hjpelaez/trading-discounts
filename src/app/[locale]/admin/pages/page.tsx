import { getPages } from "@/lib/db";
import { deletePageAction } from "@/actions/page-actions";
import Link from "next/link";
import { Edit, Trash2, Plus, FileText, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/animations";

export default async function AdminPagesDashboard() {
    const pages = await getPages();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Gestor de Páginas</h1>
                <Link
                    href="/admin/pages/new"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" /> Nueva Página
                </Link>
            </div>

            <FadeIn>
                <div className="rounded-md border bg-card">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Slug (URL)</th>
                                <th className="px-6 py-4">Última Actualización</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {pages.map((page) => (
                                <tr key={page.slug.en} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-medium">
                                        {page.title.en}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-muted-foreground">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <span className="flex items-center gap-1"><span className="text-primary font-bold">EN:</span> /{page.slug.en}</span>
                                            <span className="flex items-center gap-1"><span className="text-primary font-bold">ES:</span> /{page.slug.es}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{new Date(page.lastUpdated).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/${page.slug.en}`}
                                                target="_blank"
                                                className="p-2 hover:bg-muted rounded-md transition-colors"
                                                title="Ver Página Pública"
                                            >
                                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                            </Link>
                                            <Link
                                                href={`/admin/pages/${page.slug.en}`}
                                                className="p-2 hover:bg-muted rounded-md transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4 text-muted-foreground" />
                                            </Link>
                                            <form action={deletePageAction.bind(null, page.slug.en)}>
                                                <button
                                                    type="submit"
                                                    className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors"
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
                    {pages.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                            No se encontraron páginas. Crea una (ej. Política de Privacidad).
                        </div>
                    )}
                </div>
            </FadeIn>
        </div>
    );
}
