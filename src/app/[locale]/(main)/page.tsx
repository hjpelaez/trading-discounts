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
      <section className="relative section-spacing overflow-hidden border-b border-border/40">
        <BackgroundAurora />
        <FadeIn className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary-dark dark:text-primary mb-8 animate-fade-in shadow-sm border border-primary/20">
            {tHero('pill')}
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 mb-12 max-w-4xl mx-auto leading-[1.1] text-balance py-2" dangerouslySetInnerHTML={{ __html: tHero.raw('title').replace('<highlight>', '<span class="text-primary italic">').replace('</highlight>', '</span>') }}>
          </h1>
          <div className="flex items-center justify-center gap-2 mb-12 text-[10px] font-black text-green-500 uppercase tracking-[0.2em] bg-green-500/5 py-2.5 px-6 rounded-full w-fit mx-auto border border-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.05)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            {tHero('trustBadge', { date: new Date().toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) })}
          </div>
          <p className="mx-auto max-w-[650px] text-muted-foreground md:text-lg mb-16 leading-relaxed text-balance font-medium opacity-80">
            {tHero('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href={`${prefix}/forex`}
              className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-10 text-sm font-black text-primary-foreground shadow-2xl shadow-sky-500/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
            >
              {tHero('exploreForex')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={`${prefix}/futures`}
              className="inline-flex h-14 items-center justify-center rounded-xl border border-border bg-background px-10 text-sm font-bold shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:border-primary/30"
            >
              {tHero('futuresDeals')}
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Firms Grid */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <FadeIn delay={0.2} className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">{tHome('topDeals')}</h2>
          <SearchInput />
        </FadeIn>

        <FadeIn delay={0.3} className="mb-12">
          <FilterBar allFirms={allFirms} />
        </FadeIn>

        {displayFirms.length > 0 ? (
          <StaggerContainer key={resultsKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayFirms.map((firm) => (
              <StaggerItem key={firm.id}>
                <FirmCard firm={firm} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground font-medium">{tHome('noFirms')}</p>
            <Link href={prefix} className="text-primary font-bold hover:underline mt-4 inline-block">
              {tHome('clearFilters')}
            </Link>
          </div>
        )}

        <div className="mt-20">
          <AIPromo />
        </div>
      </section>

      <DecorativeSeparator />

      {/* Blog Preview */}
      <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">{tHome('recentArticles')}</h2>
          </div>
          <Link href={`${prefix}/blog`} className="text-primary font-black flex items-center hover:opacity-80 transition-opacity">
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
      <section className="bg-muted/5 py-12 md:py-16">
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

      <DecorativeSeparator />

      <section className="bg-background py-12 md:py-16">
        <FAQ />
      </section>
    </div>
  );
}
