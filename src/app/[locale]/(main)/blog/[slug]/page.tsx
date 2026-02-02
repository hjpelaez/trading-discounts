import { getBlogPostBySlug, getBlogPosts } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { ShareButtons } from "@/components/share-buttons";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) return { title: 'Trading Discounts' };

    const title = post.title[locale as "en" | "es"].replace(/<[^>]*>?/gm, '');
    const description = post.excerpt[locale as "en" | "es"];

    return {
        title: `${title} | Trading Discounts`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [post.imageUrl],
        }
    };
}
import Image from "next/image";

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
    const { locale, slug } = await params;
    const post = await getBlogPostBySlug(slug);
    const t = await getTranslations("Blog");
    const tHome = await getTranslations("Home");

    if (!post) notFound();

    const title = post.title[locale as "en" | "es"];
    const content = post.content[locale as "en" | "es"];

    // Get related posts (same category, exclude current, limit 3)
    const allPosts = await getBlogPosts();
    const relatedPosts = allPosts
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 3);

    // Format date safely
    const formattedDate = post.date ? new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(post.date)) : "";

    return (
        <article className="min-h-screen">
            {/* Header */}
            <header className="relative py-24 md:py-32 overflow-hidden bg-muted/30">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <Link href={`/${locale}/blog`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-12 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToList")}
                    </Link>
                    <FadeIn>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {t(`categories.${post.category}`) || post.category}
                            </span>
                        </div>
                        <h1
                            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight italic max-w-5xl"
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                        <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-t border-border/50 pt-8">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                    {post.author.charAt(0)}
                                </div>
                                <span className="font-semibold text-foreground">{post.author}</span>
                            </div>
                            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {formattedDate}</span>
                        </div>
                    </FadeIn>
                </div>
            </header>

            {/* Content - Full Width */}
            <div className="container mx-auto px-4 md:px-6 -mt-12 relative z-20">
                <FadeIn delay={0.2}>
                    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-2xl relative">
                        <div className="w-full aspect-[21/9] relative">
                            <Image
                                src={post.imageUrl}
                                alt={title.replace(/<[^>]*>?/gm, '')}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                            />
                        </div>
                        <div
                            className="p-8 md:p-16 lg:p-20 md:prose-lg lg:prose-xl prose-custom"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                        <div className="px-8 md:px-16 lg:px-20 pb-12">
                            <ShareButtons
                                url={`https://trading-discounts.com/${locale}/blog/${slug}`}
                                title={title.replace(/<[^>]*>?/gm, '')}
                            />
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <div className="container mx-auto px-4 md:px-6 mt-32 mb-12">
                    <FadeIn delay={0.4}>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                {t("relatedPostsTitle")}
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                {t("relatedPostsSubtitle")}
                            </p>
                        </div>

                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPosts.map((relatedPost) => (
                                <StaggerItem key={relatedPost.id}>
                                    <BlogCard
                                        post={relatedPost}
                                        locale={locale}
                                        readMoreLabel={tHome('readArticle')}
                                    />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </FadeIn>
                </div>
            )}
        </article>
    );
}
