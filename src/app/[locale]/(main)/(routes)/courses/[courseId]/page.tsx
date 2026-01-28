import { getCourseById } from "@/lib/db";
import { notFound } from "next/navigation";
import { BackgroundAurora } from "@/components/background-aurora";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Check, BookOpen, Clock, BarChart, ExternalLink, Sparkles, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string; locale: string }> }) {
    const { courseId, locale } = await params;
    const l = locale as 'en' | 'es';
    const course = await getCourseById(courseId);
    const tCommon = await getTranslations("Common");

    if (!course) {
        notFound();
    }

    const isSpanish = course.language === 'Spanish' || course.language === 'Español' || (typeof course.language === 'object' && ((course.language as any).es || (course.language as any).en) === 'Spanish');

    // Helper for legacy data
    const renderString = (val: any) => {
        if (typeof val === 'string') return val;
        if (typeof val === 'object' && val !== null) {
            return (val as any)[isSpanish ? 'es' : 'en'] || (val as any).en || (val as any).es || '';
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
    const priceLabel = renderString(course.priceLabel);

    return (
        <div className="min-h-screen pb-24">
            {/* Hero Section */}
            <div className="relative overflow-hidden border-b bg-muted/10">
                <BackgroundAurora />
                <div className="container mx-auto px-4 md:px-6 py-20 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <FadeIn>
                            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary uppercase tracking-widest border border-primary/20 mb-6">
                                <Sparkles className="h-3 w-3 mr-2" /> {platform}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
                                {title}
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 text-balance">
                                {description}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm font-bold text-muted-foreground mb-8">
                                <div className="flex items-center gap-2 bg-background/50 border px-3 py-1.5 rounded-lg">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    <span>{isSpanish ? 'Lecciones' : 'Lessons'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-background/50 border px-3 py-1.5 rounded-lg">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>{duration}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-background/50 border px-3 py-1.5 rounded-lg">
                                    <BarChart className="h-4 w-4 text-primary" />
                                    <span>{level}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={course.link}
                                    target="_blank"
                                    className="inline-flex h-14 items-center justify-center rounded-2xl bg-primary px-8 text-lg font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 hover:-translate-y-1"
                                >
                                    {l === 'es' ? 'Obtener Acceso - ' : 'Get Access Now - '} {priceLabel} <ExternalLink className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.2} className="relative">
                            <div className="relative aspect-video rounded-3xl overflow-hidden border border-border bg-muted shadow-2xl">
                                {course.imageUrl ? (
                                    <Image
                                        src={course.imageUrl}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-primary">
                                        <div className="h-20 w-20 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-4">
                                            <span className="text-4xl font-black">{title.charAt(0)}</span>
                                        </div>
                                        <span className="font-bold text-xl">{course.platform}</span>
                                    </div>
                                )}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Information Column */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* What you will learn */}
                        <FadeIn>
                            <h2 className="text-2xl font-black mb-8">{l === 'es' ? 'Lo que aprenderás' : "What you'll learn"}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {learningPoints.map((point: string, i: number) => (
                                    <div key={i} className="flex gap-3 p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors">
                                        <div className="h-6 w-6 shrink-0 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                                            <Check className="h-3.5 w-3.5 text-green-500" />
                                        </div>
                                        <span className="font-medium text-sm">{renderString(point)}</span>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        {/* Description (About) */}
                        <FadeIn delay={0.2}>
                            <h2 className="text-2xl font-black mb-6">{l === 'es' ? 'Sobre este curso' : 'About this course'}</h2>
                            <div className="prose prose-invert max-w-none text-muted-foreground">
                                <p className="leading-relaxed whitespace-pre-line">{description}</p>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Sidebar */}
                    <FadeIn delay={0.3} className="space-y-8">
                        <div className="p-6 rounded-3xl border bg-card shadow-lg sticky top-24">
                            <h3 className="font-black text-lg mb-6">{l === 'es' ? 'Instructor' : 'Instructor'}</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold border-2 border-primary/20">
                                    {instructor.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{instructor}</div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{l === 'es' ? 'Creador del Curso' : 'Course Creator'}</div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-dashed">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{l === 'es' ? 'Duración' : 'Duration'}</span>
                                    <span className="font-bold">{duration}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{l === 'es' ? 'Nivel' : 'Level'}</span>
                                    <span className="font-bold">{level}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{l === 'es' ? 'Idioma' : 'Language'}</span>
                                    <span className="font-bold">{language}</span>
                                </div>
                            </div>

                            <Link
                                href={course.link}
                                target="_blank"
                                className="mt-8 flex w-full items-center justify-center rounded-xl bg-primary h-12 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02]"
                            >
                                {l === 'es' ? 'Obtener Acceso' : 'Get Access Now'}
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
