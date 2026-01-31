"use client";

import { saveBlogPostAction } from "@/actions/blog-actions";
import { BlogPost } from "@/lib/db";
import { ChevronLeft, Save, Globe, FileText, Image as ImageIcon, User, Calendar, Tag, Sparkles } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { RichTextEditor } from "./rich-text-editor";
import { useState, useEffect } from "react";
import { cn, slugify } from "@/lib/utils";
import { ImageUploader } from "@/components/admin/image-uploader";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
            {pending ? "Guardando..." : "Guardar Post"} <Save className="ml-2 h-4 w-4" />
        </button>
    );
}

export function BlogForm({ post, categories = ["Education", "Proptrading", "Strategy", "News"] }: { post?: BlogPost, categories?: string[] }) {
    const [contentEn, setContentEn] = useState(post?.content.en || "");
    const [contentEs, setContentEs] = useState(post?.content.es || "");
    const [activeTab, setActiveTab] = useState<"en" | "es">("es");

    // Image System State
    const [currentSlug, setCurrentSlug] = useState(post?.slug || "");
    const [coverImage, setCoverImage] = useState(post?.imageUrl || "");

    // Auto-generate slug from English title if empty
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentSlug && !post) {
            setCurrentSlug(slugify(e.target.value));
        }
    };

    // Also try to generate from Spanish title if English is empty and no slug exists
    const handleTitleChangeEs = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentSlug && !post) {
            setCurrentSlug(slugify(e.target.value));
        }
    };

    return (
        <form action={saveBlogPostAction} className="space-y-8 max-w-6xl mx-auto pb-20">
            <input type="hidden" name="id" value={post?.id || ""} />
            <input type="hidden" name="content_en" value={contentEn} />
            <input type="hidden" name="content_es" value={contentEs} />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="h-10 w-10 flex items-center justify-center bg-card border rounded-full hover:bg-muted transition-colors shrink-0">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{post ? `Editar Post` : "Nuevo Post"}</h1>
                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                            <Sparkles className="h-3 w-3 text-primary" /> Contenido de Educación y Noticias
                        </p>
                    </div>
                </div>
                <div className="w-full sm:w-auto">
                    <SubmitButton />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Language Tabs */}
                    <div className="flex p-1 bg-muted/50 rounded-xl w-fit border border-border/50">
                        <button
                            type="button"
                            onClick={() => setActiveTab("es")}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                                activeTab === "es" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <span className="text-[10px] font-black bg-primary/10 px-1 rounded">ES</span> Español
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("en")}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                                activeTab === "en" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <span className="text-[10px] font-black bg-primary/10 px-1 rounded">EN</span> Inglés
                        </button>
                    </div>

                    <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm space-y-8 border-t-4 border-t-primary">
                        {/* Spanish Fields */}
                        <div className={cn("space-y-8 animate-in fade-in slide-in-from-left-2 duration-300", activeTab !== "es" && "hidden")}>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Title (Spanish)</label>
                                <input
                                    name="title_es"
                                    defaultValue={post?.title.es}
                                    onChange={handleTitleChangeEs}
                                    required
                                    placeholder="e.g. Cómo elegir la mejor Prop Firm"
                                    className="w-full rounded-xl border bg-background px-5 py-4 text-xl font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Excerpt (Spanish)</label>
                                <textarea
                                    name="excerpt_es"
                                    defaultValue={post?.excerpt.es}
                                    required
                                    rows={3}
                                    placeholder="Breve resumen del artículo para las tarjetas de la web..."
                                    className="w-full rounded-xl border bg-background px-5 py-4 text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50 resize-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Body Content (Spanish)</label>
                                <RichTextEditor
                                    content={contentEs}
                                    onChange={setContentEs}
                                    placeholder="Escribe el contenido completo del artículo aquí..."
                                />
                            </div>
                        </div>

                        {/* English Fields */}
                        <div className={cn("space-y-8 animate-in fade-in slide-in-from-right-2 duration-300", activeTab !== "en" && "hidden")}>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Título (Inglés)</label>
                                <input
                                    name="title_en"
                                    defaultValue={post?.title.en}
                                    required
                                    onChange={handleTitleChange}
                                    placeholder="e.j. How to Choose the Best Prop Firm"
                                    className="w-full rounded-xl border bg-background px-5 py-4 text-xl font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Resumen (Inglés)</label>
                                <textarea
                                    name="excerpt_en"
                                    defaultValue={post?.excerpt.en}
                                    required
                                    rows={3}
                                    placeholder="Breve resumen en inglés..."
                                    className="w-full rounded-xl border bg-background px-5 py-4 text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50 resize-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Body Content (English)</label>
                                <RichTextEditor
                                    content={contentEn}
                                    onChange={setContentEn}
                                    placeholder="Write the full English content here..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Settings Panel */}
                    <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-6">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
                            <Globe className="h-4 w-4 text-primary" /> Ajustes y SEO
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1.5 ml-1">
                                    <FileText className="h-3 w-3" /> URL Slug
                                </label>
                                <input
                                    name="slug"
                                    value={currentSlug}
                                    onChange={(e) => setCurrentSlug(e.target.value)}
                                    required
                                    placeholder="e.j. guia-trading-fondeado"
                                    className="w-full rounded-xl border bg-muted/30 px-4 py-2.5 font-mono text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50"
                                />
                                <p className="text-[10px] text-muted-foreground">Esto también se usará como nombre de archivo para las imágenes.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1.5 ml-1">
                                    <ImageIcon className="h-3 w-3" /> Imagen de Portada
                                </label>

                                <ImageUploader
                                    slug={currentSlug}
                                    onUploadComplete={(url) => setCoverImage(url)}
                                />

                                <input
                                    name="imageUrl"
                                    value={coverImage}
                                    onChange={(e) => setCoverImage(e.target.value)}
                                    required
                                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50 text-muted-foreground"
                                    placeholder="Esperando subida..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1.5 ml-1">
                                    <User className="h-3 w-3" /> Autor
                                </label>
                                <input
                                    name="author"
                                    defaultValue={post?.author || "PFT Team"}
                                    required
                                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1.5 ml-1">
                                    <Tag className="h-3 w-3" /> Categoría
                                </label>
                                <select
                                    name="category"
                                    defaultValue={post?.category || categories[0]}
                                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50 appearance-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground flex items-center gap-1.5 ml-1">
                                    <Calendar className="h-3 w-3 text-primary" /> Fecha de Publicación
                                </label>
                                <input
                                    name="date"
                                    type="date"
                                    defaultValue={post?.date || new Date().toISOString().split('T')[0]}
                                    required
                                    className="w-full rounded-xl border bg-background px-4 py-2.5 text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                            <Sparkles className="h-24 w-24 text-primary" />
                        </div>
                        <h4 className="font-black text-primary text-xs uppercase tracking-widest mb-2 relative z-10">Soporte Admin</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
                            Tu contenido educativo está optimizado para conversión. Asegúrate de que tus slugs sean descriptivos para mejorar el ranking en Google.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
}
