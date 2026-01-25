import { getBlogPosts } from "@/lib/db";
import { Plus, Edit, Trash2, ExternalLink, Tag } from "lucide-react";
import Link from "next/link";
import { deleteBlogPostAction } from "@/actions/blog-actions";
import { FadeIn } from "@/components/animations";

export default async function AdminBlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión del Blog</h1>
                    <p className="text-muted-foreground">Gestiona tu contenido educativo y noticias.</p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/admin/blog/categories"
                        className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold shadow-sm transition-all hover:bg-muted hover:scale-105"
                    >
                        <Tag className="mr-2 h-4 w-4 text-primary" /> Categorías
                    </Link>
                    <Link
                        href="/admin/blog/new"
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Post
                    </Link>
                </div>
            </div>

            <FadeIn>
                <div className="rounded-md border bg-card">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Post</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoría</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Autor</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {posts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center">No se encontraron posts.</td>
                                    </tr>
                                ) : (
                                    posts.map((post) => (
                                        <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{post.title.es.replace(/<[^>]*>?/gm, '')}</span>
                                                    <span className="text-xs text-muted-foreground font-mono">/{post.slug}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">{post.author}</td>
                                            <td className="p-4 align-middle">{post.date}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/en/blog/${post.slug}`}
                                                        target="_blank"
                                                        className="p-2 hover:bg-muted rounded-md text-muted-foreground"
                                                        title="Ver en Vivo"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/blog/${post.id}`}
                                                        className="p-2 hover:bg-muted rounded-md text-blue-500"
                                                        title="Editar"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <form action={deleteBlogPostAction.bind(null, post.id)}>
                                                        <button
                                                            className="p-2 hover:bg-muted rounded-md text-destructive"
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
                </div>
            </FadeIn>
        </div>
    );
}
