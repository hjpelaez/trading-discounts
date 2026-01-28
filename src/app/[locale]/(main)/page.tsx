import { getFirms } from "@/lib/db";
import { FirmCard } from "@/components/firm-card";
import { SearchInput } from "@/components/search-input";
import { FilterBar } from "@/components/filter-bar";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { PropFirm } from "@/lib/data";
import { getBlogPosts, BlogPost } from "@/lib/db";
import { FAQ } from "@/components/faq";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DecorativeSeparator } from "@/components/decorative-separator";
import { AIPromo } from "@/components/ai-promo";
import { BackgroundAurora } from "@/components/background-aurora";
import { BlogCard } from "@/components/blog-card";
import { Testimonials } from "@/components/testimonials";
import { JsonLd } from "@/components/json-ld";

interface SearchParams {
  q?: string;
  platform?: string;
  rating?: string;
  drawdown?: string;
}


export default async function Home({ searchParams, params }: { searchParams: Promise<SearchParams>; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // Create a unique key based on all filter params to force re-render
  const resultsKey = JSON.stringify(resolvedSearchParams);
  const tHero = await getTranslations('Hero');
  const tHome = await getTranslations('Home');
  const tTestimonials = await getTranslations('Testimonials');
  const prefix = `/${locale}`;

  // Filter Logic - Using a more robust approach
  const searchQ = (resolvedSearchParams.q as string || "").toLowerCase();
  const filterPlatform = resolvedSearchParams.platform as string | undefined;
  const filterRating = resolvedSearchParams.rating ? parseFloat(resolvedSearchParams.rating as string) : 0;
  const filterDrawdown = resolvedSearchParams.drawdown as string | undefined;

  const allFirms = await getFirms();
  const blogPosts = await getBlogPosts();

  const filteredFirms = allFirms.filter((firm: PropFirm) => {
    // 1. Search Query
    const matchesQuery = !searchQ ||
      firm.name.toLowerCase().includes(searchQ) ||
      (firm.description && typeof firm.description === 'object' && (
        (firm.description as { en: string; es: string }).en?.toLowerCase()?.includes(searchQ) ||
        (firm.description as { en: string; es: string }).es?.toLowerCase()?.includes(searchQ)
      )) ||
      (typeof firm.description === 'string' && firm.description.toLowerCase().includes(searchQ));

    // 2. Platform
    const matchesPlatform = !filterPlatform ||
      firm.platforms.some(p => p === filterPlatform);

    // 3. Rating
    const matchesRating = firm.rating >= filterRating;

    // 4. Drawdown
    const matchesDrawdown = !filterDrawdown ||
      firm.drawdownType === filterDrawdown;

    return matchesQuery && matchesPlatform && matchesRating && matchesDrawdown;
  });

  const featuredFirms = filteredFirms.filter(f => f.featured);
  const otherFirms = filteredFirms.filter(f => !f.featured);
  const displayFirms = [...featuredFirms, ...otherFirms];

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Trading Discounts",
        "url": "https://trading-discounts.com",
        "logo": "https://trading-discounts.com/logo.png",
        "sameAs": [
          "https://twitter.com/tradingdiscounts",
          "https://instagram.com/tradingdiscounts"
        ]
      }} />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <BackgroundAurora />
        <FadeIn className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-primary mb-6 animate-fade-in shadow-sm border border-primary/20">
            {tHero('pill')}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-4 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: tHero.raw('title').replace('<highlight>', '<span class="text-primary">').replace('</highlight>', '</span>') }}>
          </h1>
          <div className="flex items-center justify-center gap-2 mb-8 text-xs font-bold text-green-500 uppercase tracking-widest bg-green-500/5 py-2 px-4 rounded-full w-fit mx-auto border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {tHero('trustBadge', { date: new Date().toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) })}
          </div>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mb-10">
            {tHero('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`${prefix}/forex`}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {tHero('exploreForex')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={`${prefix}/futures`}
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {tHero('futuresDeals')}
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Firms Grid */}
      <section className="container mx-auto px-4 md:px-6 py-12">
        <FadeIn delay={0.2} className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold tracking-tight">{tHome('topDeals')}</h2>
          <SearchInput />
        </FadeIn>

        <FadeIn delay={0.3} className="mb-8">
          <FilterBar allFirms={allFirms} />
        </FadeIn>

        {displayFirms.length > 0 ? (
          <StaggerContainer key={resultsKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFirms.map((firm) => (
              <StaggerItem key={firm.id}>
                <FirmCard firm={firm} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">{tHome('noFirms')}</p>
            <Link href={prefix} className="text-primary hover:underline mt-2 inline-block">
              {tHome('clearFilters')}
            </Link>
          </div>
        )}

        <AIPromo />
      </section>

      {/* Blog Preview */}
      <section className="container mx-auto px-4 md:px-6 py-28 md:py-36 border-t border-border/50">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold tracking-tight">{tHome('recentArticles')}</h2>
          <Link href={`${prefix}/blog`} className="text-primary font-bold flex items-center hover:underline">
            {tHome('viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {blogPosts.slice(0, 3).map((post: BlogPost) => (
            <BlogCard
              key={post.id}
              post={post}
              locale={locale}
              readMoreLabel={tHome('readArticle')}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border/50 bg-muted/5">
        <Testimonials
          locale={locale}
          title={tHome('testimonialsTitle')}
          subtitle={tHome('testimonialsSubtitle')}
          testimonials={{
            testimonial1Name: tTestimonials('testimonial1Name'),
            testimonial1Role: tTestimonials('testimonial1Role'),
            testimonial1Text: tTestimonials('testimonial1Text'),
            testimonial2Name: tTestimonials('testimonial2Name'),
            testimonial2Role: tTestimonials('testimonial2Role'),
            testimonial2Text: tTestimonials('testimonial2Text'),
            testimonial3Name: tTestimonials('testimonial3Name'),
            testimonial3Role: tTestimonials('testimonial3Role'),
            testimonial3Text: tTestimonials('testimonial3Text'),
            testimonial4Name: tTestimonials('testimonial4Name'),
            testimonial4Role: tTestimonials('testimonial4Role'),
            testimonial4Text: tTestimonials('testimonial4Text'),
            testimonial5Name: tTestimonials('testimonial5Name'),
            testimonial5Role: tTestimonials('testimonial5Role'),
            testimonial5Text: tTestimonials('testimonial5Text'),
            testimonial6Name: tTestimonials('testimonial6Name'),
            testimonial6Role: tTestimonials('testimonial6Role'),
            testimonial6Text: tTestimonials('testimonial6Text'),
          }}
        />
      </section>

      <section className="border-t border-border/50 bg-background">
        <FAQ />
      </section>
    </div>
  );
}
