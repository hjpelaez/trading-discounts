"use client";

import { Copy, ExternalLink, Check, Heart, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { PropFirm } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { useComparison } from "@/lib/hooks/use-comparison";
import { useTranslations } from "next-intl";
import confetti from "canvas-confetti";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface FirmCardProps {
    firm: PropFirm;
    className?: string;
}

export function FirmCard({ firm, className }: FirmCardProps) {
    const [copied, setCopied] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const { toggleFavorite, isFavorite } = useFavorites();
    const { comparisonList, toggleComparison } = useComparison();
    const t = useTranslations('Common');

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

    const copyCode = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(firm.code);
        setCopied(true);

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
        <motion.div
            layout
            onMouseMove={handleMouseMove}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 h-full flex flex-col",
                firm.featured ? "border-primary/50 shadow-lg shadow-primary/5" : "",
                className
            )}
        >
            {/* Cursor Tracking Glow */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                    background: useTransform(
                        [springX, springY],
                        ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, var(--color-primary), transparent 80%)`
                    ),
                    opacity: 0.15
                }}
            />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        {firm.imageUrl ? (
                            <img
                                src={firm.imageUrl}
                                alt={`${firm.name} Logo`}
                                className="h-16 w-16 rounded-xl object-contain bg-background p-2 border shadow-sm transition-transform group-hover:scale-110"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm text-xl">
                                {firm.name.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <Link href={`/firms/${firm.id}`} className="hover:text-primary transition-colors">
                                <h3 className="text-xl font-black tracking-tight text-foreground leading-tight">{firm.name}</h3>
                            </Link>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase">
                                    ★ {firm.rating}
                                </div>
                                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-500 whitespace-nowrap gap-1">
                                    <Check className="h-3 w-3" /> {t('verified')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        {firm.featured && (
                            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] font-black text-primary-foreground uppercase tracking-widest shadow-lg shadow-primary/20 animate-pulse-slow">
                                <Sparkles className="h-3 w-3 mr-1" /> {t('featured')}
                            </span>
                        )}
                        <button
                            onClick={(e) => { e.preventDefault(); toggleFavorite(firm.id); }}
                            className={cn(
                                "h-10 w-10 rounded-full border flex items-center justify-center transition-all hover:scale-110 active:scale-95",
                                isFavorite(firm.id)
                                    ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20"
                                    : "bg-background border-border text-muted-foreground hover:text-red-500 hover:border-red-500/50"
                            )}
                        >
                            <Heart className={cn("h-5 w-5", isFavorite(firm.id) && "fill-current")} />
                        </button>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{firm.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                    {firm.platforms.map((p) => (
                        <span key={p} className="inline-flex items-center rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            {p}
                        </span>
                    ))}
                </div>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 group/discount transition-colors hover:bg-muted/50">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{t('discount')}</span>
                            <span className="text-2xl font-black text-primary group-hover/discount:scale-105 transition-transform origin-left">{firm.discount}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5">{t('code')}</span>
                            <button
                                onClick={copyCode}
                                className="flex items-center gap-2 text-sm font-black font-mono bg-card border border-border px-3 py-2 rounded-lg hover:border-primary transition-all hover:bg-primary/5 active:scale-90 shadow-sm"
                            >
                                {firm.code}
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-primary" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 py-1">
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

                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href={`/firms/${firm.id}`}
                            className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold transition-all hover:bg-muted hover:border-primary/30"
                        >
                            {t('details')}
                        </Link>
                        <Link
                            href={firm.link}
                            target="_blank"
                            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                        >
                            {t('visit')} <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
