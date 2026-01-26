"use client";

import { Calendar, User, ArrowRight, Sparkles, ImageOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BlogPost {
    id: string;
    slug: string;
    title: { en: string; es: string; };
    excerpt: { en: string; es: string; };
    content: { en: string; es: string; };
    date: string;
    author: string;
    imageUrl: string;
    category: string;
}

interface BlogCardProps {
    post: BlogPost;
    locale: string;
    readMoreLabel: string;
}

export function BlogCard({ post, locale, readMoreLabel }: BlogCardProps) {
    const [imageStatus, setImageStatus] = useState<"loading" | "success" | "error">(
        post.imageUrl ? "loading" : "error"
    );
    const title = post.title[locale as "en" | "es"];
    const excerpt = post.excerpt[locale as "en" | "es"];

    return (
        <Link href={`/${locale}/blog/${post.slug}`} className="group block h-full">
            <article className="h-full bg-card rounded-[40px] border border-border/50 overflow-hidden hover:border-primary transition-all hover:shadow-[0_20px_80px_-15px_rgba(var(--primary-rgb),0.15)] flex flex-col group-hover:-translate-y-2 duration-500 relative">
                <div className="aspect-[16/10] overflow-hidden relative bg-muted/20">
                    <Image
                        src={post.imageUrl}
                        alt=""
                        fill
                        className={cn(
                            "object-cover transition-transform duration-700 ease-out group-hover:scale-110",
                            imageStatus === "success" ? "opacity-100" : "opacity-0"
                        )}
                        onLoad={() => setImageStatus("success")}
                        onError={() => setImageStatus("error")}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {(imageStatus === "error" || imageStatus === "loading") && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/40 gap-3 bg-gradient-to-br from-primary/5 to-primary/10 animate-pulse">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <ImageOff className="h-8 w-8 text-primary/60" />
                            </div>
                            <div className="text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1">
                                    {imageStatus === "loading" ? "Loading Visuals" : "Visual Placeholder"}
                                </span>
                                <div className="h-1 w-12 bg-primary/20 rounded-full mx-auto" />
                            </div>
                        </div>
                    )}

                    <div className="absolute top-6 left-6 z-10">
                        <span className="bg-background/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-foreground uppercase tracking-widest border border-border/50 shadow-sm">
                            {post.category}
                        </span>
                    </div>
                </div>

                <div className="p-8 md:p-10 flex flex-col flex-1 relative z-10">
                    <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-tighter text-muted-foreground mb-6">
                        <span className="flex items-center gap-1.5 font-bold"><Calendar className="h-3 w-3 text-primary" /> {post.date}</span>
                        <span className="flex items-center gap-1.5 font-bold"><User className="h-3 w-3 text-primary" /> {post.author}</span>
                    </div>

                    <h2
                        className="text-2xl md:text-3xl font-black mb-5 group-hover:text-primary transition-colors leading-tight line-clamp-2 min-h-[2.4em]"
                        dangerouslySetInnerHTML={{ __html: title }}
                    />

                    <p className="text-muted-foreground text-base line-clamp-3 mb-8 leading-relaxed font-medium opacity-80">
                        {excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                        <span className="text-primary font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            {readMoreLabel} <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                        </span>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Sparkles className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
