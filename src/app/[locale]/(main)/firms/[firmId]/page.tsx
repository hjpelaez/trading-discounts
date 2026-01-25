import { getFirms, getFirmById } from "@/lib/db";
import { FirmCard } from "@/components/firm-card";
import { notFound } from "next/navigation";
import { Check, ExternalLink, TrendingUp, DollarSign, Monitor, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/copy-button";

const locales = ['en', 'es'];

interface PageProps {
    params: Promise<{ locale: string; firmId: string }>;
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

    const firm = await getFirmById(firmId);

    if (!firm) {
        notFound();
    }

    const allFirms = await getFirms();

    // Similar firms logic
    const similarFirms = allFirms
        .filter(f => f.categories.some(c => firm.categories.includes(c)) && f.id !== firm.id)
        .slice(0, 3);

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
                                        Featured Choice
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <span className="text-orange-400 font-bold">★ {firm.trustpilotScore}</span>
                                    <span className="text-sm">Trustpilot</span>
                                </div>
                                <span>•</span>
                                <span>{firm.categories.map(c => c.toUpperCase()).join(" / ")}</span>
                            </div>
                            <p className="text-xl text-muted-foreground">{firm.description}</p>
                        </div>

                        {/* CTA Card */}
                        <div className="w-full md:w-auto min-w-[300px] rounded-xl border bg-card p-6 shadow-lg">
                            <div className="text-center space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase font-semibold">Special Offer</p>
                                    <p className="text-4xl font-bold text-primary mt-1">{firm.discount}</p>
                                </div>

                                <div className="p-3 bg-muted rounded-lg border border-dashed border-primary/30">
                                    <p className="text-xs text-muted-foreground mb-1">Use Code at Checkout:</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <code className="text-lg font-mono font-bold">{firm.code}</code>
                                        <CopyButton code={firm.code} />
                                    </div>
                                </div>

                                <Link
                                    href={firm.link}
                                    target="_blank"
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                >
                                    Claim Discount <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                                <p className="text-xs text-muted-foreground">
                                    *Terms and conditions apply on the firm&apos;s website.
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
                            <h2 className="text-2xl font-bold mb-6">At a Glance</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 rounded-lg bg-muted/40 border">
                                    <TrendingUp className="h-5 w-5 text-primary mb-2" />
                                    <p className="text-xs text-muted-foreground">Max Leverage</p>
                                    <p className="font-bold">{firm.maxLeverage}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/40 border">
                                    <DollarSign className="h-5 w-5 text-primary mb-2" />
                                    <p className="text-xs text-muted-foreground">Starting Price</p>
                                    <p className="font-bold">${firm.minPrice}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/40 border col-span-2 sm:col-span-2">
                                    <Monitor className="h-5 w-5 text-primary mb-2" />
                                    <p className="text-xs text-muted-foreground">Platforms</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {firm.platforms.map(p => (
                                            <span key={p} className="text-xs font-medium bg-background px-2 py-0.5 rounded border">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Features */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Why Choose {firm.name}?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {firm.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-1 rounded-full bg-green-500/10 p-1">
                                            <Check className="h-3 w-3 text-green-500" />
                                        </div>
                                        <span className="text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Rules */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Key Trading Rules</h2>
                            <div className="rounded-xl border bg-card overflow-hidden">
                                {firm.rules.map((rule, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors">
                                        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">{rule}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* Sidebar / Similar Firms */}
                    <div>
                        <div className="sticky top-24">
                            <h3 className="text-lg font-bold mb-4">Similar Funded Accounts</h3>
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
