import { getFirms, getFirmById } from "@/lib/db";
import { FirmCard } from "@/components/firm-card";
import { notFound } from "next/navigation";
import { Check, ExternalLink, TrendingUp, DollarSign, Monitor, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import { getTranslations } from "next-intl/server";
import { parseBilingual, parseBilingualArray } from "@/lib/utils";

const locales = ['en', 'es'];

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ locale: string; firmId: string }>;
}

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string, firmId: string }> }): Promise<Metadata> {
    const { firmId, locale } = await params;
    const firm = await getFirmById(firmId);

    if (!firm) return { title: 'Trading Discounts' };

    const description = parseBilingual(firm.description, locale);

    return {
        title: `${firm.name} Discount Code | Trading Discounts`,
        description: description || `Get instant access to exclusive discounts for ${firm.name}. Verified coupon codes for ${firm.categories.join(", ")} trading evaluations.`,
        openGraph: {
            title: `${firm.name} Discount Code | Trading Discounts`,
            description: description || `Save ${firm.discount} on your ${firm.name} challenge today.`,
            images: [firm.imageUrl || '/og-default.jpg'],
        }
    };
}

export async function generateStaticParams() {
    const firms = await getFirms();
    return firms.flatMap((firm) =>
        locales.map((locale) => ({
            locale: locale,
            firmId: firm.id,
        }))
    );
}

export default async function FirmPage({ params }: PageProps) {
    const { firmId, locale } = await params;
    // const lang = locale as "en" | "es"; // Not needed anymore

    const firm = await getFirmById(firmId);

    if (!firm) {
        notFound();
    }

    const t = await getTranslations('FirmDetails');

    const allFirms = await getFirms();

    // Similar firms logic
    const similarFirms = allFirms
        .filter(f => f.categories.some(c => firm.categories.includes(c)) && f.id !== firm.id)
        .slice(0, 3);

    const description = parseBilingual(firm.description, locale);
    const features = parseBilingualArray(firm.features, locale);
    const rules = parseBilingualArray(firm.rules, locale);
    const consistencyRules = parseBilingualArray(firm.consistencyRules, locale);
    const prohibitedPractices = parseBilingualArray(firm.prohibitedPractices, locale);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Header */}
            <section className="relative bg-muted/30 border-b">
                <div className="container mx-auto py-12 md:py-20 px-4 md:px-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{firm.name}</h1>
                                {firm.featured && (
                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary border border-primary/20">
                                        {t('featuredChoice')}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <span className="text-orange-400 font-bold">★ {firm.trustpilotScore}</span>
                                    <span className="text-sm">Trustpilot</span>
                                </div>
                                <span>•</span>
                                <span>{firm.categories.map(c => c.toUpperCase()).join(" / ")}</span>
                                {firm.country && (
                                    <>
                                        <span>•</span>
                                        <span>{firm.country}</span>
                                    </>
                                )}
                                {firm.activeYears && (
                                    <>
                                        <span>•</span>
                                        <span>{firm.activeYears} {t('yearsActive')}</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xl text-muted-foreground">{description}</p>
                        </div>

                        {/* CTA Card */}
                        <div className="w-full md:w-auto min-w-[300px] rounded-xl border bg-card p-6 shadow-lg">
                            <div className="text-center space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase font-semibold">{t('specialOffer')}</p>
                                    <p className="text-4xl font-bold text-primary mt-1">{firm.discount}</p>
                                </div>

                                {firm.code && (
                                    <div className="p-3 bg-muted rounded-lg border border-dashed border-primary/30">
                                        <p className="text-xs text-muted-foreground mb-1">{t('useCode')}</p>
                                        <div className="flex items-center justify-center gap-2">
                                            <code className="text-lg font-mono font-bold">{firm.code}</code>
                                            <CopyButton code={firm.code} />
                                        </div>
                                    </div>
                                )}

                                <Link
                                    href={firm.link}
                                    target="_blank"
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                >
                                    {t('claim')} <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                                <p className="text-xs text-muted-foreground">
                                    {t('terms')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-12">

                        {/* At a Glance Grid */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">{t('glance')}</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 rounded-lg bg-muted/40 border">
                                    <TrendingUp className="h-5 w-5 text-primary mb-2" />
                                    <p className="text-xs text-muted-foreground">{t('maxLeverage')}</p>
                                    <p className="font-bold">{firm.maxLeverage}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/40 border">
                                    <DollarSign className="h-5 w-5 text-primary mb-2" />
                                    <p className="text-xs text-muted-foreground">{t('startingPrice')}</p>
                                    <p className="font-bold">${firm.minPrice}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/40 border col-span-2 sm:col-span-2">
                                    <Monitor className="h-5 w-5 text-primary mb-2" />
                                    <p className="text-xs text-muted-foreground">{t('platforms')}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {firm.platforms.map(p => (
                                            <span key={p} className="text-xs font-medium bg-muted/50 px-2 py-0.5 rounded border">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {firm.maxAllocation && (
                                    <div className="p-4 rounded-lg bg-muted/40 border col-span-2">
                                        <p className="text-xs text-muted-foreground">Max Allocation</p>
                                        <p className="font-bold">{firm.maxAllocation}</p>
                                    </div>
                                )}
                                {firm.drawdownType && (
                                    <div className="p-4 rounded-lg bg-muted/40 border col-span-2">
                                        <p className="text-xs text-muted-foreground">Drawdown Type</p>
                                        <p className="font-bold">{firm.drawdownType}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Features */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">{t('whyChoose', { name: firm.name })}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-1 rounded-full bg-green-500/10 p-1">
                                            <Check className="h-3 w-3 text-green-500" />
                                        </div>
                                        <span className="text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Trading Environment Details */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">{t('tradingEnv')}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-card border rounded-xl p-6">
                                {firm.broker && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-1">{t('broker')}</h3>
                                        <p className="font-medium">{firm.broker}</p>
                                    </div>
                                )}
                                {firm.payoutFrequency && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-1">{t('payoutFreq')}</h3>
                                        <p className="font-medium">{firm.payoutFrequency}</p>
                                    </div>
                                )}
                                {firm.assets && firm.assets.length > 0 && (
                                    <div className="sm:col-span-2">
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t('assets')}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {firm.assets.map(a => (
                                                <span key={a} className="text-xs font-medium bg-muted/50 px-2 py-0.5 rounded border">{a}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Rules & Consistency */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">{t('tradingRulesTitle')}</h2>
                            <div className="space-y-6">
                                <div className="rounded-xl border bg-card overflow-hidden">
                                    <div className="bg-muted/50 p-4 border-b">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4" />
                                            {t('rulesTitle')}
                                        </h3>
                                    </div>
                                    {rules.map((rule, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
                                            <span className="font-medium text-sm">{rule}</span>
                                        </div>
                                    ))}
                                </div>

                                {consistencyRules && consistencyRules.length > 0 && (
                                    <div className="rounded-xl border bg-yellow-500/5 border-yellow-500/20 p-6">
                                        <h3 className="font-bold text-yellow-600 mb-2">{t('consistency')}</h3>
                                        <ul className="space-y-2">
                                            {consistencyRules.map((rule, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                    <span className="text-yellow-500 font-bold">•</span>
                                                    {rule}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {prohibitedPractices.length > 0 && (
                                    <div className="rounded-xl border bg-red-500/5 border-red-500/20 p-6">
                                        <h3 className="font-bold text-red-600 mb-3">{t('prohibited')}</h3>
                                        <ul className="space-y-2">
                                            {prohibitedPractices.map((practice, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                    <span className="text-red-500 font-bold">•</span>
                                                    {practice}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Payment & Funding */}
                        {(firm.paymentMethods.length > 0 || (firm.payoutMethods && firm.payoutMethods.length > 0)) && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6">{t('banking')}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {firm.paymentMethods.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3">{t('depositMethods')}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {firm.paymentMethods.map(pm => (
                                                    <span key={pm} className="text-xs font-medium bg-muted/50 px-2 py-0.5 rounded border">
                                                        {pm}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {firm.payoutMethods && firm.payoutMethods.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3">{t('withdrawalMethods')}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {firm.payoutMethods.map(pm => (
                                                    <span key={pm} className="text-xs font-medium bg-muted/50 px-2 py-0.5 rounded border">
                                                        {pm}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}


                    </div>

                    {/* Sidebar / Similar Firms */}
                    <div>
                        <div className="sticky top-24">
                            <h3 className="text-lg font-bold mb-4">{t('similarTitle')}</h3>
                            <div className="flex flex-col gap-4">
                                {similarFirms.map(f => (
                                    <FirmCard key={f.id} firm={f} className="border-border bg-muted/20" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
