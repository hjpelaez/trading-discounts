"use client";

import { useComparison } from "@/lib/hooks/use-comparison";
import { Link as LocalizedLink } from "@/i18n/routing";
import { X, ArrowRight, BarChart3 } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ComparisonBar() {
    const { comparisonList, toggleComparison, clearComparison } = useComparison();
    const pathname = usePathname();
    const t = useTranslations('Compare');

    // Don't show on admin or compare page
    if (pathname.includes("/admin") || pathname.includes("/compare")) return null;

    return (
        <AnimatePresence>
            {comparisonList.length > 0 && (
                <m.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl"
                >
                    <div className="bg-card/95 backdrop-blur-md border border-primary/20 shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-primary/10 p-2 rounded-lg hidden sm:block">
                                <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex -space-x-2">
                                {comparisonList.map((id) => (
                                    <div key={id} className="relative group">
                                        <div className="h-10 w-10 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center text-xs font-bold shadow-sm">
                                            {id.substring(0, 2).toUpperCase()}
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => toggleComparison(id)}
                                                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t('remove')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm font-medium hidden sm:block">
                                {comparisonList.length} {t('selected')}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={clearComparison}
                                            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {t('clear')}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('clearAll')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <LocalizedLink
                                href="/compare"
                                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
                            >
                                {t('now')} <ArrowRight className="ml-2 h-4 w-4" />
                            </LocalizedLink>
                        </div>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
}
