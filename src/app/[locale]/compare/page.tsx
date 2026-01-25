"use client";

import { useComparison } from "@/lib/hooks/use-comparison";
import { getFirms } from "@/lib/db";
import { PropFirm } from "@/lib/data";
import { useEffect, useState } from "react";
import { ComparisonTable } from "@/components/comparison-table";
import { Link as LocalizedLink } from "@/i18n/routing";
import { ArrowLeft, BarChart3, Search } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { useTranslations } from "next-intl";

export default function ComparePage() {
    const { comparisonList, toggleComparison } = useComparison();
    const [firms, setFirms] = useState<PropFirm[]>([]);
    const [loading, setLoading] = useState(true);
    const t = useTranslations('Compare');

    useEffect(() => {
        const loadFirms = async () => {
            try {
                const data = await fetch('/api/firms').then(res => res.json());
                const selected = data.filter((f: PropFirm) => comparisonList.includes(f.id));
                setFirms(selected);
            } catch (e) {
                console.error("API error, using comparisonList count:", comparisonList.length);
            } finally {
                setLoading(false);
            }
        };

        if (comparisonList.length > 0) {
            loadFirms();
        } else {
            setFirms([]);
            setLoading(false);
        }
    }, [comparisonList]);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <FadeIn>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                        <div className="space-y-2">
                            <LocalizedLink href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" /> {t('back')}
                            </LocalizedLink>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
                                dangerouslySetInnerHTML={{ __html: t.raw('title').replace('<highlight>', '<span class="text-primary">').replace('</highlight>', '</span>') }}>
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>
                </FadeIn>

                {comparisonList.length === 0 ? (
                    <FadeIn delay={0.2} className="text-center py-24 rounded-2xl border-2 border-dashed border-muted/50 bg-muted/5">
                        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">{t('noFirms')}</h2>
                        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                            {t('noFirmsDesc')}
                        </p>
                        <LocalizedLink
                            href="/"
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-1"
                        >
                            {t('explore')}
                        </LocalizedLink>
                    </FadeIn>
                ) : (
                    <FadeIn delay={0.2}>
                        <ComparisonTable firms={firms} onRemove={toggleComparison} />
                    </FadeIn>
                )}
            </div>
        </div>
    );
}
