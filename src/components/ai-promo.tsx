"use client";

import { useTranslations } from "next-intl";
import { Sparkles, ArrowRight, Bot } from "lucide-react";
import { FadeIn } from "./animations";

export function AIPromo() {
    const t = useTranslations("AIPromo");

    // Dispatch a custom event to open the chat assistant
    const openChat = () => {
        window.dispatchEvent(new CustomEvent("open-ai-chat"));
    };

    return (
        <FadeIn delay={0.4} className="mt-24 mb-12">
            <div className="relative overflow-hidden rounded-3xl bg-sky-500/5 border border-スカy-500/10 p-8 md:p-12">
                {/* Background Decoration */}
                <div className="absolute -right-20 -top-20 h-64 w-64 bg-sky-500/10 blur-[100px] rounded-full" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 bg-blue-500/10 blur-[100px] rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                        <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-foreground flex items-center justify-center shadow-2xl rotate-3">
                            <Bot className="h-10 w-10 md:h-12 md:w-12 text-background" />
                            <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-background border-2 border-foreground flex items-center justify-center animate-bounce">
                                <Sparkles className="h-4 w-4 text-foreground" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            {t("title")}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                            {t("subtitle")}
                        </p>
                    </div>

                    <div className="flex-shrink-0 w-full md:w-auto">
                        <button
                            onClick={openChat}
                            className="w-full md:w-auto inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-xl shadow-sky-500/20 transition-all hover:scale-105 active:scale-95 hover:bg-primary/90"
                        >
                            {t("button")} <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}
