"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { PropFirm } from "@/lib/data";
import { useTranslations } from "next-intl";

const PLATFORMS_LIST = ["MT4", "MT5", "cTrader", "Tradovate", "Rithmic", "NinjaTrader"];
const DRAWDOWN_TYPES_LIST = ["Trailing", "Static", "Balance-based"];

export function FilterBar({ allFirms }: { allFirms: PropFirm[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('Common');

    const handleFilterChange = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(window.location.search);

            if (value === null) {
                params.delete(name);
            } else if (params.get(name) === value) {
                params.delete(name);
            } else {
                params.set(name, value);
            }

            const queryString = params.toString();
            router.push(pathname + (queryString ? "?" + queryString : ""), { scroll: false });
        },
        [router, pathname]
    );

    const activePlatform = searchParams.get("platform");
    const activeRating = searchParams.get("rating");
    const activeDrawdown = searchParams.get("drawdown");

    // Smart Filter: Only show options that actually have firms
    const availablePlatforms = useMemo(() =>
        PLATFORMS_LIST.filter(p => allFirms.some(f => f.platforms.includes(p))),
        [allFirms]);

    const availableDrawdowns = useMemo(() =>
        DRAWDOWN_TYPES_LIST.filter(d => allFirms.some(f => f.drawdownType === d)),
        [allFirms]);

    return (
        <div className="flex flex-col gap-10 py-6">
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 overflow-hidden w-full">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] whitespace-nowrap">{t('filters.apps')}:</span>
                    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <button
                            onClick={() => handleFilterChange("platform", null)}
                            className={cn(
                                "h-10 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center border",
                                !activePlatform
                                    ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-sky-500/20 scale-105"
                                    : "bg-secondary text-secondary-foreground border-input hover:border-primary/50 hover:bg-secondary/80"
                            )}
                        >
                            {t('all')}
                        </button>
                        {availablePlatforms.map((platform) => (
                            <button
                                key={platform}
                                onClick={() => handleFilterChange("platform", platform)}
                                className={cn(
                                    "h-10 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center border",
                                    activePlatform === platform
                                        ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-sky-500/20 scale-105"
                                        : "bg-secondary text-secondary-foreground border-input hover:border-primary/50 hover:bg-secondary/80"
                                )}
                            >
                                {platform}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-px h-8 bg-border hidden sm:block mx-2" />

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 overflow-hidden w-full">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] whitespace-nowrap">{t('filters.rating')}:</span>
                    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <button
                            onClick={() => handleFilterChange("rating", null)}
                            className={cn(
                                "h-10 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center border",
                                !activeRating
                                    ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-sky-500/20 scale-105"
                                    : "bg-secondary text-secondary-foreground border-input hover:border-primary/50 hover:bg-secondary/80"
                            )}
                        >
                            {t('all')}
                        </button>
                        <button
                            onClick={() => handleFilterChange("rating", "4.5")}
                            className={cn(
                                "h-10 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center border",
                                activeRating === "4.5"
                                    ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-sky-500/20 scale-105"
                                    : "bg-secondary text-secondary-foreground border-input hover:border-primary/50 hover:bg-secondary/80"
                            )}
                        >
                            4.5+ ⭐
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 overflow-hidden w-full">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] whitespace-nowrap">{t('filters.drawdown')}:</span>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                    <button
                        onClick={() => handleFilterChange("drawdown", null)}
                        className={cn(
                            "h-10 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center border",
                            !activeDrawdown
                                ? "bg-primary text-primary-foreground border-transparent shadow-lg scale-105"
                                : "bg-secondary text-secondary-foreground border-input hover:border-primary/50 hover:bg-secondary/80"
                        )}
                    >
                        {t('all')}
                    </button>
                    {availableDrawdowns.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleFilterChange("drawdown", type)}
                            className={cn(
                                "h-10 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center justify-center border",
                                activeDrawdown === type
                                    ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-sky-500/20 scale-105"
                                    : "bg-secondary text-secondary-foreground border-input hover:border-primary/50 hover:bg-secondary/80"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
