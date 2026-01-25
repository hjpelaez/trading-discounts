"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function CookieConsent() {
    const t = useTranslations("Cookies");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Show with a slight delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-4 md:w-[400px] z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="bg-card/95 backdrop-blur-md border border-primary/20 p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary animate-bounce">
                        <Cookie className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-sm">{t("title")}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {t("description")}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={handleAccept}
                        className="bg-primary text-primary-foreground font-bold text-xs px-6 py-2.5 rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                        {t("accept")}
                    </button>
                </div>
            </div>
        </div>
    );
}
