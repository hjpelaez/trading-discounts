"use client";

import { ExternalLink, Check, Heart, Sparkles, Clock, BarChart, ArrowRight, Globe, Tag } from "lucide-react";
import { CourseDB } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";

interface CourseCardProps {
    course: CourseDB;
    className?: string;
}

import { useLocale } from "next-intl";

// ...

export function CourseCard({ course, className }: CourseCardProps) {
    const t = useTranslations('Common');
    const locale = useLocale() as 'en' | 'es';

    // Helper to get localized content safely
    const getLocalized = (field: { en: string; es: string } | string) => {
        if (typeof field === 'string') return field;
        return field[locale] || field['en'];
    };

    const getLocalizedArray = (field?: { en: string[]; es: string[] } | string[]) => {
        if (!field) return [];
        if (Array.isArray(field)) return field; // Legacy support
        return field[locale] || field['en'] || [];
    };

    const title = getLocalized(course.title);
    const description = getLocalized(course.description);
    const learningPoints = getLocalizedArray(course.learningPoints);

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

    return (
        <m.div
            onMouseMove={handleMouseMove}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col",
                course.featured ? "border-primary/50 shadow-lg shadow-primary/5" : "",
                className
            )}
        >
            {/* Cursor Tracking Glow */}
            <m.div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                    background: useTransform(
                        [springX, springY],
                        ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, var(--color-primary), transparent 80%)`
                    ),
                    opacity: 0.15
                }}
            />

            <div className="relative z-10 flex flex-col">
                <div className="flex gap-4 items-start mb-4">
                    {/* Logo Section */}
                    {course.imageUrl ? (
                        <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-background border shadow-sm transition-transform group-hover:scale-110">
                            <Image
                                src={course.imageUrl}
                                alt={`${title} Logo`}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </div>
                    ) : (
                        <div className="h-16 w-16 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm text-xl group-hover:scale-110 transition-transform">
                            {title.substring(0, 1).toUpperCase()}
                        </div>
                    )}

                    <div className="space-y-1">
                        {course.featured && (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 mb-2">
                                <Sparkles className="h-3 w-3 mr-1" /> Featured
                            </span>
                        )}
                        <h3 className="text-xl font-black tracking-tight text-foreground leading-tight group-hover:text-primary transition-colors">
                            <Link href={course.link} target="_blank">{title}</Link>
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <span>by {course.instructor}</span>
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <div className="flex items-center text-yellow-500">
                                ★ {course.rating}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {description}
                </p>

                {/* Highlights */}
                {learningPoints && learningPoints.length > 0 && (
                    <div className="mb-6 space-y-1.5">
                        {learningPoints.slice(0, 3).map((point, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground/80">
                                <Check className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{point}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-3 text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-2 bg-muted/50 px-2 py-1.5 rounded-lg">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 px-2 py-1.5 rounded-lg">
                        <BarChart className="h-3.5 w-3.5 text-primary" />
                        <span>{t(`Levels.${course.level}` as any)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 px-2 py-1.5 rounded-lg">
                        <Globe className="h-3.5 w-3.5 text-primary" />
                        <span>{t(`Languages.${course.language}` as any)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 px-2 py-1.5 rounded-lg">
                        <Tag className="h-3.5 w-3.5 text-primary" />
                        <span>{t(`Categories.${course.category}` as any)}</span>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-xl font-black text-foreground">
                            {course.priceLabel}
                        </div>
                        <Link
                            href={course.link}
                            target="_blank"
                            className="w-1/2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 group-hover:shadow-primary/30"
                        >
                            {t('viewCourse')} <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </m.div>
    );
}
