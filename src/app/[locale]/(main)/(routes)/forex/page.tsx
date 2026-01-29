import { getFirms } from "@/lib/db";
import { FirmCard } from "@/components/firm-card";
import { SearchInput } from "@/components/search-input";
import { FilterBar } from "@/components/filter-bar";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/animations";
import { AIPromo } from "@/components/ai-promo";
import { getTranslations } from "next-intl/server";

interface SearchParams {
    q?: string;
    platform?: string;
    rating?: string;
}

export const dynamic = 'force-dynamic';

export default async function ForexPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const resolvedSearchParams = await searchParams;
    const { q, platform, rating: ratingStr } = resolvedSearchParams;
    const allFirms = await getFirms();
    const tHome = await getTranslations("Home");
    const tForex = await getTranslations("Forex");

    const resultsKey = JSON.stringify(resolvedSearchParams);
    const searchQ = (q as string || "").toLowerCase();
    const filterPlatform = platform as string | undefined;
    const filterRating = ratingStr ? parseFloat(ratingStr as string) : 0;

    const firms = allFirms.filter((f) => {
        const isForex = f.categories.includes("forex");
        const matchesQuery = !searchQ ||
            f.name.toLowerCase().includes(searchQ) ||
            (typeof f.description === 'object' && (
                f.description?.en?.toLowerCase()?.includes(searchQ) ||
                f.description?.es?.toLowerCase()?.includes(searchQ)
            )) ||
            (typeof f.description === 'string' && (f.description as string).toLowerCase().includes(searchQ));
        const matchesPlatform = !filterPlatform ||
            f.platforms.some(p => p === filterPlatform);
        const matchesRating = f.rating >= filterRating;

        return isForex && matchesQuery && matchesPlatform && matchesRating;
    });

    return (
        <div className="container mx-auto py-24 px-4 md:px-6">
            <FadeIn className="mb-12">
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4">
                    {tForex('titlePart1')} <span className="text-primary">{tForex('titlePart2')}</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                    {tForex('description')}
                </p>
            </FadeIn>

            <FadeIn className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h2 className="text-3xl font-bold tracking-tight">{tHome('topDeals')}</h2>
                <SearchInput />
            </FadeIn>

            <FadeIn delay={0.2} className="mb-12">
                <FilterBar allFirms={allFirms} />
            </FadeIn>

            {firms.length > 0 ? (
                <StaggerContainer key={resultsKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {firms.map((firm) => (
                        <StaggerItem key={firm.id}>
                            <FirmCard firm={firm} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            ) : (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
                    <p className="text-xl font-medium text-muted-foreground">{tHome('noFirms')}</p>
                </div>
            )}

            <div className="mt-24">
                <AIPromo />
            </div>
        </div>
    );
}
