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
        <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Apps:</span>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => handleFilterChange("platform", null)}
                            className={cn(
                                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all",
                                !activePlatform
                                    ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20 scale-105"
                                    : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                            )}
                        >
                            {t('all')}
                        </button>
                        {availablePlatforms.map((platform) => (
                            <button
                                key={platform}
                                onClick={() => handleFilterChange("platform", platform)}
                                className={cn(
                                    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all",
                                    activePlatform === platform
                                        ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20 scale-105"
                                        : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                                )}
                            >
                                {platform}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-px h-6 bg-border hidden sm:block mx-1" />

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Rating:</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleFilterChange("rating", null)}
                            className={cn(
                                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all",
                                !activeRating
                                    ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20 scale-105"
                                    : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                            )}
                        >
                            {t('all')}
                        </button>
                        <button
                            onClick={() => handleFilterChange("rating", "4.5")}
                            className={cn(
                                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all",
                                activeRating === "4.5"
                                    ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20 scale-105"
                                    : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                            )}
                        >
                            4.5+ ⭐
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Drawdown:</span>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => handleFilterChange("drawdown", null)}
                        className={cn(
                            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all",
                            !activeDrawdown
                                ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20 scale-105"
                                : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                        )}
                    >
                        {t('all')}
                    </button>
                    {availableDrawdowns.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleFilterChange("drawdown", type)}
                            className={cn(
                                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all whitespace-nowrap",
                                activeDrawdown === type
                                    ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20 scale-105"
                                    : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
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
