"use client";

import { savePageAction } from "@/actions/page-actions";
import { Page } from "@/lib/db";
import { ChevronLeft, Save, Globe } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { RichTextEditor } from "./rich-text-editor";
import { useState } from "react";
import { cn, slugify } from "@/lib/utils";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
            {pending ? "Saving..." : "Save Page"} <Save className="ml-2 h-4 w-4" />
        </button>
    );
}

export function PageForm({ page }: { page?: Page }) {
    const [contentEn, setContentEn] = useState(page?.content?.en || "");
    const [contentEs, setContentEs] = useState(page?.content?.es || "");
    const [activeTab, setActiveTab] = useState<"en" | "es">("en");

    const [slugEn, setSlugEn] = useState(page?.slug?.en || "");
    const [slugEs, setSlugEs] = useState(page?.slug?.es || "");

    const handleTitleChangeEn = (e: React.ChangeEvent<HTMLInputElement>) => {
        // If slug is empty or matches slugified version of previous input (heuristic), auto-update
        // Simplest UX: Only auto-update if user hasn't manually edited slug (hard to track without extra state)
        // OR: Only auto-update if slug is empty. 
        // User Request: "que los slug sean los titulos..." implies strong correlation.
        // Let's strict sync ONLY if slug is empty OR we are creating a new page?
        // Let's just update `slug` if it's not locked.
        // Better UX: Update slug as you type title, but stop if user edits slug field.
        // Implementation: We'll simplisticly update slug if it was empty.

        const val = e.target.value;
        if (!slugEn || !page) {
            setSlugEn(slugify(val));
        }
    };

    const handleTitleChangeEs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!slugEs || !page) {
            setSlugEs(slugify(val));
        }
    };

    return (
        <form action={savePageAction} className="space-y-8 max-w-5xl mx-auto pb-20">
            <input type="hidden" name="originalSlug" value={page?.slug?.en || ""} />
            <input type="hidden" name="content_en" value={contentEn} />
            <input type="hidden" name="content_es" value={contentEs} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages" className="h-10 w-10 flex items-center justify-center bg-card border rounded-full hover:bg-muted transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">{page ? `Edit Page` : "New Page"}</h1>
                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                            <Globe className="h-3 w-3" /> Multi-language Content
                        </p>
                    </div>
                </div>
                <SubmitButton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex p-1 bg-muted/50 rounded-xl w-fit border border-border/50">
                        <button
                            type="button"
                            onClick={() => setActiveTab("en")}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                                activeTab === "en" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <span className="text-[10px] font-black bg-primary/10 px-1 rounded">EN</span> English
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("es")}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                                activeTab === "es" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <span className="text-[10px] font-black bg-primary/10 px-1 rounded">ES</span> Spanish
                        </button>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6 border-t-4 border-t-primary">
                        {/* English Fields */}
                        {activeTab === "en" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Page Title (English)</label>
                                    <input
                                        name="title_en"
                                        defaultValue={page?.title?.en}
                                        onChange={handleTitleChangeEn}
                                        required
                                        placeholder="e.g. Terms of Service"
                                        className="w-full rounded-xl border bg-background px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">URL Slug (English)</label>
                                    <input
                                        name="slug_en"
                                        value={slugEn}
                                        onChange={(e) => setSlugEn(e.target.value)}
                                        required
                                        placeholder="e.g. terms-of-service"
                                        className="w-full rounded-xl border bg-background px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50"
                                    />
                                    <p className="text-[10px] text-muted-foreground px-1">Link: tradingdiscounts.com/en/<b>{slugEn}</b></p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Content (English)</label>
                                    <RichTextEditor
                                        content={contentEn}
                                        onChange={setContentEn}
                                        placeholder="Write your English page content here..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Spanish Fields */}
                        {activeTab === "es" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Page Title (Spanish)</label>
                                    <input
                                        name="title_es"
                                        defaultValue={page?.title?.es}
                                        onChange={handleTitleChangeEs}
                                        required
                                        placeholder="ej. Términos de Servicio"
                                        className="w-full rounded-xl border bg-background px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">URL Slug (Spanish)</label>
                                    <input
                                        name="slug_es"
                                        value={slugEs}
                                        onChange={(e) => setSlugEs(e.target.value)}
                                        required
                                        placeholder="ej. terminos-de-servicio"
                                        className="w-full rounded-xl border bg-background px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all border-border/50"
                                    />
                                    <p className="text-[10px] text-muted-foreground px-1">Enlace: tradingdiscounts.com/es/<b>{slugEs}</b></p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Content (Spanish)</label>
                                    <RichTextEditor
                                        content={contentEs}
                                        onChange={setContentEs}
                                        placeholder="Escribe el contenido en español aquí..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                        <h4 className="font-bold text-primary text-sm mb-2">Editor Pro-Tip</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Use the language tabs to ensure your platform is 100% accessible to global users. High-quality translations improve SEO!
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
}
