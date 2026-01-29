import { getPageBySlug, getPages } from "@/lib/db";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/animations";
import { BackgroundAurora } from "@/components/background-aurora";
import { Clock, ShieldCheck, FileText } from "lucide-react";

const locales = ['en', 'es'];

export async function generateStaticParams() {
    const pages = await getPages();
    return pages.flatMap((page) =>
        locales.map((locale) => ({
            locale: locale,
            slug: locale === 'es' ? page.slug.es : page.slug.en,
        }))
    );
}

export default async function CMSPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { slug, locale } = await params;
    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    const title = locale === 'es' ? page.title.es : page.title.en;
    const content = locale === 'es' ? page.content.es : page.content.en;

    return (
        <div className="flex flex-col min-h-screen">
            {/* High-Impact Header */}
            <section className="relative py-24 md:py-40 overflow-hidden border-b bg-muted/5">
                <BackgroundAurora />
                <div className="container mx-auto px-4 relative z-10">
                    <FadeIn className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20 mb-10 animate-fade-in">
                            <ShieldCheck className="h-4 w-4" /> Official Document
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-10 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                            {title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-background/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50">
                                <Clock className="h-3.5 w-3.5 text-primary" />
                                Updated: {new Date(page.lastUpdated).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Content Area */}
            <section className="container mx-auto px-4 pt-24 pb-0 md:pt-32 md:pb-8 relative">
                <FadeIn delay={0.2}>
                    <div className="bg-card rounded-[40px] border border-border/50 p-8 md:p-16 shadow-2xl shadow-black/5 relative overflow-hidden">
                        {/* Decorative watermark icon */}
                        <FileText className="absolute -bottom-10 -right-10 h-64 w-64 text-primary/5 -rotate-12 pointer-events-none" />

                        <div
                            className="prose prose-gray dark:prose-invert max-w-none prose-base md:prose-lg
                            prose-headings:font-black prose-headings:tracking-tighter 
                            prose-headings:mt-8 prose-headings:mb-4
                            prose-headings:text-gray-900 dark:prose-headings:text-neutral-400
                            prose-p:text-foreground prose-p:leading-relaxed prose-p:my-4
                            prose-ul:my-4 prose-li:text-foreground prose-li:my-1
                            prose-strong:text-foreground prose-strong:font-black
                            relative z-10 w-full"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </FadeIn>
            </section>
        </div>
    );
}
