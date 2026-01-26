"use client";

import { Sparkles, ArrowRight, ShieldCheck, Zap, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FadeIn } from "./animations";
import { useTranslations } from "next-intl";

export function PreFooter() {
    const t = useTranslations("PreFooter");
    const pathname = usePathname();
    if (pathname?.includes("/admin")) return null;
    return (
        <section className="relative py-24 overflow-hidden border-t">
            {/* Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="bg-card border-x border-y border-border/50 rounded-[40px] p-8 md:p-16 relative overflow-hidden shadow-2xl">
                    {/* Glass Decor */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="h-40 w-40 text-primary" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-8 text-center lg:text-left">
                            <FadeIn>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20 mb-6">
                                    <Star className="h-3 w-3 fill-current" /> {t("pill")}
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
                                    {t("titlePart1")} <span className="text-primary">{t("titleHighlight")}</span>{t("titlePart2")}
                                </h2>
                                <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
                                    {t("description")}
                                </p>
                            </FadeIn>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/forex"
                                    className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-lg flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                                >
                                    {t("explore")} <ArrowRight className="h-5 w-5" />
                                </Link>
                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
                                    className="h-14 px-8 rounded-2xl bg-muted border border-border font-bold flex items-center gap-2 hover:bg-muted/80 transition-all"
                                >
                                    {t("askAi")}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: ShieldCheck, title: t("features.verifiedTitle"), desc: t("features.verifiedDesc") },
                                { icon: Zap, title: t("features.instantTitle"), desc: t("features.instantDesc") },
                                { icon: Sparkles, title: t("features.exclusiveTitle"), desc: t("features.exclusiveDesc") },
                                { icon: Star, title: t("features.guideTitle"), desc: t("features.guideDesc") },
                            ].map((item, i) => (
                                <FadeIn key={i} delay={i * 0.1}>
                                    <div className="p-6 rounded-3xl bg-background/50 border border-border/50 backdrop-blur-sm group hover:border-primary/30 transition-colors">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-bold mb-1">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
