import { getBlogPosts } from "@/lib/db";
import { PlusCircle, Pencil, Trash2, ExternalLink, Tag, Eye, EyeOff, Newspaper } from "lucide-react";
import Link from "next/link";
import { deleteBlogPostAction, toggleBlogPostVisibilityAction } from "@/actions/blog-actions";
import { FadeIn } from "@/components/animations";

export default async function AdminBlogPage() {
    const posts = await getBlogPosts({ admin: true });

    return (
        <FadeIn>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestión del Blog</h1>
                        <p className="text-muted-foreground text-sm">Gestiona tu contenido educativo y noticias.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/admin/blog/categories"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background text-sm font-bold hover:bg-muted transition-colors"
                        >
                            <Tag className="h-4 w-4" /> Categorías
                        </Link>
                        <Link
                            href="/admin/blog/new"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                        >
                            <PlusCircle className="h-4 w-4" /> Nuevo Post
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Post</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoría</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Visibilidad</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <div className="p-20 text-center text-muted-foreground bg-muted/5">
                                            <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                            <p className="text-lg font-bold">No se encontraron posts</p>
                                            <p className="text-sm">Escribe tu primer artículo para empezar a publicar contenido.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">{post.title.es.replace(/<[^>]*>?/gm, '')}</span>
                                                <span className="text-xs text-muted-foreground font-mono">/{post.slug}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border",
                                                (post.isVisible ?? true)
                                                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                                                    : "bg-red-500/10 text-red-600 border-red-500/20"
                                            )}>
                                                {(post.isVisible ?? true) ? (
                                                    <><div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Público</>
                                                ) : (
                                                    <><div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Oculto</>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">{post.date}</td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <form action={toggleBlogPostVisibilityAction.bind(null, post.id, post.isVisible ?? true)}>
                                                    <button
                                                        type="submit"
                                                        className={cn(
                                                            "p-2 rounded-lg transition-all border shadow-sm hover:shadow-md",
                                                            (post.isVisible ?? true)
                                                                ? "text-green-600 border-green-500/20 hover:bg-green-500/10"
                                                                : "text-red-500 border-red-500/20 hover:bg-red-500/10"
                                                        )}
                                                        title={(post.isVisible ?? true) ? "Ocultar Post" : "Mostrar Post"}
                                                    >
                                                        {(post.isVisible ?? true) ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                    </button>
                                                </form>
                                                <Link
                                                    href={`/en/blog/${post.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-muted-foreground border border-border/50 hover:bg-muted rounded-lg transition-all shadow-sm hover:shadow-md"
                                                    title="Ver en Vivo"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/blog/${post.id}`}
                                                    className="p-2 text-blue-500 border border-blue-500/20 hover:bg-blue-500/10 rounded-lg transition-all shadow-sm hover:shadow-md"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <form action={deleteBlogPostAction.bind(null, post.id)}>
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
            </div>
        </FadeIn>
    );
}

// Para usar 'cn' en el lado del servidor si no está importado, mejor lo importamos
import { cn } from "@/lib/utils";
