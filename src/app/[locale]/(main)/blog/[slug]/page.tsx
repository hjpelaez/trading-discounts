import { getBlogPostBySlug } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/animations";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
    const { locale, slug } = await params;
    const post = await getBlogPostBySlug(slug);
    const t = await getTranslations("Blog");

    if (!post) notFound();

    const title = post.title[locale as "en" | "es"];
    const content = post.content[locale as "en" | "es"];

    return (
        <article className="min-h-screen pb-24">
            {/* Header */}
            <header className="relative py-24 md:py-32 overflow-hidden bg-muted/30">
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <Link href={`/${locale}/blog`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-12 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToList")}
                    </Link>
                    <FadeIn>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {post.category}
                            </span>
                        </div>
                        <h1
                            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight italic"
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                        <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-t border-border/50 pt-8">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                    {post.author.charAt(0)}
                                </div>
                                <span className="font-semibold text-foreground">{post.author}</span>
                            </div>
                            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {post.date}</span>
                        </div>
                    </FadeIn>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 max-w-4xl -mt-12 relative z-20">
                <FadeIn delay={0.2}>
                    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-2xl">
                        <img
                            src={post.imageUrl}
                            alt={title.replace(/<[^>]*>?/gm, '')}
                            className="w-full aspect-[21/9] object-cover"
                        />
                        <div
                            className="p-8 md:p-12 prose prose-slate md:prose-lg max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </FadeIn>
            </div>
        </article>
    );
}
