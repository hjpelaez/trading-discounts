"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface BlogFilterProps {
    categories: string[];
}

export function BlogFilter({ categories }: BlogFilterProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const tCommon = useTranslations('Common');
    const tBlog = useTranslations('Blog');

    const activeCategory = searchParams.get("category");

    const handleCategoryChange = useCallback(
        (category: string | null) => {
            const params = new URLSearchParams(window.location.search);

            if (category === null) {
                params.delete("category");
            } else if (params.get("category") === category) {
                params.delete("category");
            } else {
                params.set("category", category);
            }

            const queryString = params.toString();
            router.push(pathname + (queryString ? "?" + queryString : ""), { scroll: false });
        },
        [router, pathname]
    );

    return (
        <div className="flex flex-wrap items-center justify-center gap-4">
            <button
                onClick={() => handleCategoryChange(null)}
                className={cn(
                    "inline-flex items-center rounded-2xl border px-8 py-3 text-sm font-black transition-all",
                    !activeCategory
                        ? "bg-primary text-primary-foreground border-transparent shadow-xl shadow-primary/20 scale-110 rotate-1"
                        : "bg-background text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-foreground"
                )}
            >
                {tCommon('all')}
            </button>
            {categories.map((cat, i) => (
                <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={cn(
                        "inline-flex items-center rounded-2xl border px-8 py-3 text-sm font-black transition-all",
                        activeCategory === cat
                            ? "bg-primary text-primary-foreground border-transparent shadow-xl shadow-primary/20 scale-110 -rotate-1"
                            : "bg-background text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-foreground"
                    )}
                >
                    {tBlog(`categories.${cat}`) || cat}
                </button>
            ))}
        </div>
    );
}
