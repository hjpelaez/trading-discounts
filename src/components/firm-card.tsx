"use client";

import { Copy, ExternalLink, Check, Heart, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { PropFirm } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { useComparison } from "@/lib/hooks/use-comparison";
import { useTranslations, useLocale } from "next-intl";
import { m, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { SuccessToast } from "./success-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { parseBilingual } from "@/lib/utils";

interface FirmCardProps {
    firm: PropFirm;
    className?: string;
}

export function FirmCard({ firm, className }: FirmCardProps) {
    const [copied, setCopied] = useState(false);
    const [recentCopy, setRecentCopy] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const { toggleFavorite, isFavorite } = useFavorites();
    const { comparisonList, toggleComparison } = useComparison();
    const t = useTranslations('Common');
    const locale = useLocale();
    const pathname = usePathname();
    const isAdmin = pathname?.includes("/admin");

    // Random minutes for "Verified X min ago" urgency
    const [verifiedMin, setVerifiedMin] = useState(5);
    useEffect(() => {
        setVerifiedMin(Math.floor(Math.random() * 15) + 2);
    }, []);

    const description = parseBilingual(firm.description, locale);

    // Mouse Tracking Glow
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const copyCode = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Lazy load confetti
        const confetti = (await import("canvas-confetti")).default;

        if (!firm.code) return;
        navigator.clipboard.writeText(firm.code);
        setCopied(true);
        setRecentCopy(true);

        // Premium Celebration
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        confetti({
            particleCount: 40,
            spread: 60,
            origin: {
                x: (rect.left + rect.width / 2) / window.innerWidth,
                y: (rect.top + rect.height / 2) / window.innerHeight
            },
            colors: ['#22d3ee', '#3b82f6', '#ffffff'],
            ticks: 200,
            gravity: 1.2,
            scalar: 0.7,
        });

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <m.div
                layout
                onMouseMove={handleMouseMove}
                className={cn(
                    "group relative overflow-hidden rounded-2xl border border-border bg-card p-4 md:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col",
                    firm.featured ? "ring-1 ring-foreground/5 shadow-lg" : "",
                    className
                )}
            >
                {/* Cursor Tracking Glow */}
                <m.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                        background: useTransform(
                            [springX, springY],
                            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, #0ea5e9, transparent 80%)`
                        ),
                        opacity: 0.15
                    }}
                />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="grid grid-cols-[1fr_auto] gap-4 mb-4">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            {firm.imageUrl ? (
                                <div className="relative h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-xl overflow-hidden bg-background border shadow-sm transition-transform group-hover:scale-110">
                                    <Image
                                        src={firm.imageUrl}
                                        alt={`${firm.name} Logo`}
                                        fill
                                        className="object-contain p-2"
                                        sizes="64px"
                                    />
                                </div>
                            ) : (
                                <div className="h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm text-lg md:text-xl">
                                    {firm.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0">
                                <Link href={`/firms/${firm.id}`} className="hover:text-primary transition-colors block">
                                    <h3 className="text-lg md:text-xl font-black tracking-tight text-foreground leading-tight line-clamp-2 md:line-clamp-none">{firm.name}</h3>
                                </Link>
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                    <div className="flex items-center text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase shrink-0">
                                        ★ {firm.rating}
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:text-green-500 whitespace-nowrap gap-1.5 border border-green-500/40 shrink-0">
                                        <div className="relative flex h-1.5 w-1.5 shrink-0">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                        </div>
                                        {t('verified')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                            {firm.featured && (
                                <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] font-black text-primary-foreground uppercase tracking-widest shadow-lg shadow-sky-500/20 animate-pulse-slow">
                                    <Sparkles className="h-3 w-3 mr-1" /> {t('featured')}
                                </span>
                            )}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={(e) => { e.preventDefault(); toggleFavorite(firm.id); }}
                                            className={cn(
                                                "h-8 w-8 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95",
                                                isFavorite(firm.id)
                                                    ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20"
                                                    : "bg-background border-border text-muted-foreground hover:text-red-500 hover:border-red-500/50"
                                            )}
                                        >
                                            <Heart className={cn("h-4 w-4", isFavorite(firm.id) && "fill-current")} />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left" sideOffset={10}>
                                        {!isAdmin && <p>{isFavorite(firm.id) ? t('removeFromFavorites') : t('addToFavorites')}</p>}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {firm.platforms.map((p) => (
                            <span key={p} className="inline-flex items-center rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                {p}
                            </span>
                        ))}
                    </div>

                    <div className="mt-auto space-y-4">
                        {firm.code ? (
                            <div className="relative group/discount overflow-hidden p-4 rounded-xl bg-secondary/50 border border-border transition-all hover:bg-secondary">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{t('discount')}</span>
                                        <span className="text-3xl font-black text-primary group-hover/discount:scale-110 transition-transform origin-left drop-shadow-sm">{firm.discount}</span>
                                    </div>
                                    <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5">{t('code')}</span>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={copyCode}
                                                        className={cn(
                                                            "flex items-center justify-between sm:justify-center gap-2 text-sm font-black font-mono px-4 py-2.5 rounded-lg transition-all active:scale-95 shadow-lg relative overflow-hidden w-full sm:w-auto min-h-[44px]",
                                                            copied
                                                                ? "bg-green-500 text-white border-green-500 scale-105"
                                                                : "bg-foreground text-background border-foreground hover:bg-foreground/90"
                                                        )}
                                                    >
                                                        <span className="relative z-10">{firm.code}</span>
                                                        {copied ? <Check className="h-4 w-4 relative z-10" /> : <Copy className="h-4 w-4 relative z-10" />}
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {!isAdmin && <p>{copied ? t('copied') : t('copyCode')}</p>}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href={firm.link}
                                target="_blank"
                                className="relative group/discount overflow-hidden p-4 rounded-xl bg-secondary/50 border border-border transition-all hover:bg-secondary block"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{t('discount')}</span>
                                        <span className="text-3xl font-black text-primary group-hover/discount:scale-110 transition-transform origin-left drop-shadow-sm">{firm.discount}</span>
                                    </div>
                                    <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5 opacity-0 hidden sm:block">Link</span>
                                        <div
                                            className="flex items-center justify-between sm:justify-center gap-2 text-sm font-black font-mono px-4 py-2.5 rounded-lg transition-all shadow-lg relative overflow-hidden bg-foreground text-background border-foreground hover:bg-foreground/90 w-full sm:w-auto min-h-[44px]"
                                        >
                                            <span className="relative z-10">LINK</span>
                                            <ExternalLink className="h-4 w-4 relative z-10" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        <div className="flex items-center gap-3 py-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-3 min-h-[24px]">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    disabled={!comparisonList.includes(firm.id) && comparisonList.length >= 4}
                                                    checked={comparisonList.includes(firm.id)}
                                                    onChange={() => toggleComparison(firm.id)}
                                                    id={`compare-${firm.id}`}
                                                    className="peer h-5 w-5 rounded-md border-border bg-background text-primary focus:ring-primary cursor-pointer disabled:opacity-50 transition-all checked:bg-primary"
                                                />
                                                <Check className="absolute h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none left-[3px]" />
                                            </div>
                                            <label htmlFor={`compare-${firm.id}`} className="text-xs font-bold text-muted-foreground cursor-pointer select-none uppercase tracking-wider">
                                                Compare <span className="text-primary ml-1">{comparisonList.length}/4</span>
                                            </label>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {!isAdmin && <p>{comparisonList.includes(firm.id) ? t('removeFromCompare') : t('addToCompare')}</p>}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href={`/firms/${firm.id}`}
                                className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold transition-all hover:bg-muted hover:border-primary/30 min-h-[48px]"
                            >
                                {t('details')}
                            </Link>
                            <Link
                                href={firm.link}
                                target="_blank"

                                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-black text-primary-foreground shadow-xl shadow-sky-500/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 min-h-[48px]"
                            >
                                {t('visit')} <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </m.div>

            <AnimatePresence>
                {recentCopy && (
                    <SuccessToast
                        key="toast"
                        message={`Código ${firm.code || ''} listo para usar en ${firm.name}`}
                        onClose={() => setRecentCopy(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
