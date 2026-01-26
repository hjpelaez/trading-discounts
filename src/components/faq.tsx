"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function FAQ() {
    const t = useTranslations("FAQ");
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Dynamic FAQ items
    const faqs = [
        { q: t("q1"), a: t("a1") },
        { q: t("q2"), a: t("a2") },
        { q: t("q3"), a: t("a3") },
        { q: t("q4"), a: t("a4") },
    ];

    return (
        <section className="container mx-auto px-4 md:px-6 py-24 max-w-4xl">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-gradient-x">
                    {t("title")}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {t("subtitle")}
                </p>
            </div>

            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={cn(
                            "border rounded-2xl bg-card overflow-hidden transition-all duration-300",
                            openIndex === index
                                ? "border-primary/50 shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)] bg-muted/10 ring-1 ring-primary/20"
                                : "hover:border-primary/30 hover:bg-muted/50"
                        )}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="flex w-full items-center justify-between p-6 text-left"
                        >
                            <span className={cn(
                                "text-lg font-bold transition-colors",
                                openIndex === index ? "text-primary" : "text-foreground"
                            )}>
                                {faq.q}
                            </span>
                            {openIndex === index ? (
                                <ChevronUp className="h-5 w-5 text-primary transition-transform duration-300" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-300" />
                            )}
                        </button>
                        <AnimatePresence>
                            {openIndex === index && (
                                <m.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed border-t border-dashed border-border/50 bg-muted/5">
                                        <div className="pt-4">
                                            {faq.a}
                                        </div>
                                    </div>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
}
