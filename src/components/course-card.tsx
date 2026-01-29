"use client";

import { ExternalLink, Check, Sparkles, Clock, BarChart, Globe, Tag } from "lucide-react";
import { CourseDB } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";

interface CourseCardProps {
    course: CourseDB;
    className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
    const isSpanish = course.language === 'Spanish' || course.language === 'Español' || (typeof course.language === 'object' && ((course.language as any).es || (course.language as any).en) === 'Spanish');

    // Helper to handle legacy bilingual objects or direct strings
    const renderString = (val: any) => {
        if (typeof val === 'string') return val;
        if (typeof val === 'object' && val !== null) {
            return val[isSpanish ? 'es' : 'en'] || val.en || val.es || '';
        }
        return val ? String(val) : '';
    };

    const renderArray = (val: any) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'object' && val !== null) {
            return val[isSpanish ? 'es' : 'en'] || val.en || val.es || [];
        }
        return [];
    };

    const title = renderString(course.title);
    const description = renderString(course.description);
    const learningPoints = renderArray(course.learningPoints);
    const instructor = renderString(course.instructor);
    const platform = renderString(course.platform);
    const duration = renderString(course.duration);
    const level = renderString(course.level);
    const language = renderString(course.language);
    const category = renderString(course.category);
    const priceLabel = renderString(course.priceLabel);

    // Helper for labels based on COURSE language (not UI user language)
    const getLabel = (type: 'Level' | 'Category' | 'Language' | 'Button', value: string) => {
        type Localization = { es: string; en: string };
        const dictionary: Record<string, Record<string, Localization>> = {
            Level: {
                'Beginner': { es: 'Principiante', en: 'Beginner' },
                'Intermediate': { es: 'Intermedio', en: 'Intermediate' },
                'Advanced': { es: 'Avanzado', en: 'Advanced' },
                'All Levels': { es: 'Todos los niveles', en: 'All Levels' }
            },
            Category: {
                'General': { es: 'General', en: 'General' },
                'Forex': { es: 'Forex', en: 'Forex' },
                'Crypto': { es: 'Cripto', en: 'Crypto' },
                'Futures': { es: 'Futuros', en: 'Futures' },
                'Options': { es: 'Opciones', en: 'Options' },
                'Stocks': { es: 'Acciones', en: 'Stocks' }
            },
            Language: {
                'English': { es: 'Inglés', en: 'English' },
                'Spanish': { es: 'Español', en: 'Spanish' },
                'Mixed': { es: 'Mixto', en: 'Mixed' }
            },
            Button: {
                'View': { es: 'Ver Curso', en: 'View Course' }
            }
        };

        if (type === 'Button') return isSpanish ? dictionary.Button.View.es : dictionary.Button.View.en;

        const entry = dictionary[type][value];
        return isSpanish ? (entry?.es || value) : (entry?.en || value);
    };

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
                "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col h-full",
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

            <div className="relative z-10 flex flex-col h-full">
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
                            {(() => {
                                const words = title.trim().split(/\s+/);
                                if (words.length >= 2) {
                                    return (words[0][0] + words[1][0]).toUpperCase();
                                }
                                return title.substring(0, 2).toUpperCase();
                            })()}
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
                            <span>{isSpanish ? 'Por' : 'by'} {instructor}</span>
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <div className="flex items-center text-yellow-500">
                                ★ {course.rating}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                        {description}
                    </p>

                    {/* Highlights (All points) */}
                    {learningPoints && Array.isArray(learningPoints) && learningPoints.length > 0 && (
                        <div className="mb-6 space-y-1.5">
                            {learningPoints.map((point: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground/80">
                                    <Check className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{renderString(point)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-3 text-xs font-bold text-muted-foreground">
                        <div className="flex items-center gap-2 bg-muted/50 px-2 py-1.5 rounded-lg">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span>{duration}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-2 py-1.5 rounded-lg">
                            <BarChart className="h-3.5 w-3.5 text-primary" />
                            <span>{getLabel('Level', level)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-2 py-1.5 rounded-lg">
                            <Globe className="h-3.5 w-3.5 text-primary" />
                            <span>{getLabel('Language', language)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-2 py-1.5 rounded-lg">
                            <Tag className="h-3.5 w-3.5 text-primary" />
                            <span>{getLabel('Category', category)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-2">
                        <div className="text-xl font-black text-foreground">
                            {priceLabel}
                        </div>
                        <Link
                            href={course.link}
                            target="_blank"
                            className="w-1/2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 group-hover:shadow-primary/30"
                        >
                            {getLabel('Button', 'View')} <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </m.div>
    );
}
