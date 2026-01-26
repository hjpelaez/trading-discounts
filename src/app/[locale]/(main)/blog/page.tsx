import { getBlogPosts } from "@/lib/db";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { BlogFilter } from "@/components/blog-filter";
import { BackgroundAurora } from "@/components/background-aurora";
import { BlogCard } from "@/components/blog-card";

interface SearchParams {
    category?: string;
}

export const dynamic = 'force-dynamic';

export default async function BlogPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<SearchParams> }) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams;
    const t = await getTranslations("Blog");

    // Create a unique key for the results grid
    const resultsKey = JSON.stringify(resolvedSearchParams);

    const allPosts = await getBlogPosts();

    // Extract unique categories
    const categories = Array.from(new Set(allPosts.map(p => p.category))).sort();

    // Filter Logic
    const filterCategory = resolvedSearchParams.category;
    const posts = allPosts.filter(p => !filterCategory || p.category === filterCategory);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Premium Header Section */}
            <section className="relative py-24 md:py-48 overflow-hidden border-b">
                <BackgroundAurora />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <FadeIn className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20 mb-10 animate-fade-in shadow-xl shadow-primary/5">
                            <Sparkles className="h-3 w-3 fill-current" /> Trading Insights
                        </div>
                        <h1
                            className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-10 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 drop-shadow-sm"
                            dangerouslySetInnerHTML={{ __html: t.raw("title") }}
                        />
                        <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                            {t("subtitle")}
                        </p>
                    </FadeIn>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <FadeIn delay={0.1} className="mb-24">
                    <BlogFilter categories={categories} />
                </FadeIn>

                {posts.length > 0 ? (
                    <StaggerContainer key={resultsKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                        {posts.map((post) => (
                            <StaggerItem key={post.id}>
                                <BlogCard
                                    post={post}
                                    locale={locale}
                                    readMoreLabel={t("readMore")}
                                />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                ) : (
                    <div className="text-center py-40 border rounded-[40px] bg-muted/5 border-dashed">
                        <Sparkles className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
                        <p className="text-2xl font-black text-muted-foreground">{t('noPosts')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
