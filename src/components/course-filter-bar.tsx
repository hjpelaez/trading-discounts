"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { PriceRangeSlider } from "@/components/price-range-slider";
import { useTranslations } from "next-intl";

export function CourseFilterBar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("Common");

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === "All" || value === "") {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilter = (name: string, value: string) => {
        router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false });
    };

    const activeCategory = searchParams.get("category") || "All";
    const activeLanguage = searchParams.get("language") || "All";
    const activePrice = searchParams.get("maxPrice") || "All";

    return (
        <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col gap-3">
                <span className="text-sm font-bold text-muted-foreground">{t('filters.categoryLabel')}</span>
                <div className="flex flex-wrap gap-2">
                    {["All", "Forex", "Crypto", "Futures", "Options", "Stocks"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleFilter("category", cat)}
                            className={cn(
                                "h-10 px-4 rounded-xl text-sm font-bold transition-all border cursor-pointer flex items-center justify-center",
                                activeCategory === cat
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:bg-muted/50"
                            )}
                        >
                            {cat === "All" ? t('all') : t(`Categories.${cat}`)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full">
                <div className="flex flex-col gap-3 w-full sm:w-auto">
                    <span className="text-sm font-bold text-muted-foreground">{t('filters.languageLabel')}</span>
                    <div className="flex flex-wrap gap-2">
                        {["All", "English", "Spanish"].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => handleFilter("language", lang)}
                                className={cn(
                                    "h-10 px-4 rounded-xl text-sm font-bold transition-all border cursor-pointer flex items-center justify-center",
                                    activeLanguage === lang
                                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                        : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:bg-muted/50"
                                )}
                            >
                                {lang === "All" ? t('filters.anyLanguage') : t(`Languages.${lang}`)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-px h-8 bg-border hidden sm:block mt-8" />

                <PriceRangeSlider />
            </div>
        </div>
    );
}
