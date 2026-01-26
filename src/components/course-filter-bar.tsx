"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { PriceRangeSlider } from "@/components/price-range-slider";

export function CourseFilterBar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

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
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-muted-foreground mr-2">Category:</span>
                {["All", "Forex", "Crypto", "Futures", "Options", "Stocks"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleFilter("category", cat)}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                            activeCategory === cat
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card text-muted-foreground border-border hover:border-primary/50"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-muted-foreground mr-2">Language:</span>
                    {["All", "English", "Spanish", "Mixed"].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => handleFilter("language", lang)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                activeLanguage === lang
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card text-muted-foreground border-border hover:border-primary/50"
                            )}
                        >
                            {lang === "All" ? "Any Language" : lang}
                        </button>
                    ))}
                </div>

                <div className="w-px h-6 bg-border hidden sm:block" />

                <PriceRangeSlider />
            </div>
        </div>
    );
}
