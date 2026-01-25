import { getFirms } from "@/lib/db";
import { FirmCard } from "@/components/firm-card";
import { SearchInput } from "@/components/search-input";
import { FilterBar } from "@/components/filter-bar";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { AIPromo } from "@/components/ai-promo";
import { BackgroundAurora } from "@/components/background-aurora";
import { getTranslations } from "next-intl/server";

interface SearchParams {
    q?: string;
    platform?: string;
    rating?: string;
}

export const dynamic = 'force-dynamic';

export default async function FuturesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const resolvedSearchParams = await searchParams;
    const { q, platform, rating: ratingStr } = resolvedSearchParams;
    const allFirms = await getFirms();
    const tHome = await getTranslations("Home");

    const resultsKey = JSON.stringify(resolvedSearchParams);
    const searchQ = (q as string || "").toLowerCase();
    const filterPlatform = platform as string | undefined;
    const filterRating = ratingStr ? parseFloat(ratingStr as string) : 0;

    const firms = allFirms.filter((f) => {
        const isFutures = f.categories.includes("futures");
        const matchesQuery = !searchQ ||
            f.name.toLowerCase().includes(searchQ) ||
            f.description.toLowerCase().includes(searchQ);
        const matchesPlatform = !filterPlatform ||
            f.platforms.some(p => p === filterPlatform);
        const matchesRating = f.rating >= filterRating;

        return isFutures && matchesQuery && matchesPlatform && matchesRating;
    });

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="relative overflow-hidden rounded-3xl mb-12 border border-border/50 shadow-2xl">
                <BackgroundAurora />
                <div className="relative z-10 py-16 md:py-24 text-center">
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                        Futures Prop Firms
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                        Trade futures contracts on CME, COMEX, and NYMEX. Best deals for futures evaluation accounts.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <SearchInput />
            </div>

            <div className="mb-12">
                <FilterBar allFirms={allFirms} />
            </div>

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
