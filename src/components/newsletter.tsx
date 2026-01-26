"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { subscribeAction } from "@/actions/subscriber-actions";

export function Newsletter() {
    const t = useTranslations("Newsletter");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [honeypot, setHoneypot] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        const result = await subscribeAction(email, name, honeypot);

        if (result.success) {
            setStatus("success");
            setEmail("");
            setName("");
            setHoneypot("");
        } else {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <section className="bg-primary/5 py-24 rounded-3xl border border-primary/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <AnimatePresence mode="wait">
                    {status === "success" ? (
                        <m.div
                            key="success"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center py-8"
                        >
                            <div className="bg-green-500/10 p-4 rounded-full mb-6">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">{t("successTitle")}</h2>
                            <p className="text-muted-foreground">{t("successMessage")}</p>
                        </m.div>
                    ) : (
                        <m.div key="form" exit={{ opacity: 0, y: -20 }}>
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                                {t("title")}
                            </h2>
                            <p className="text-muted-foreground text-lg mb-10">
                                {t("subtitle")}
                            </p>
                            <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
                                <div className="flex flex-col md:flex-row gap-3">
                                    <input
                                        type="text"
                                        required
                                        placeholder={t("namePlaceholder")}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex-1 h-14 px-6 rounded-2xl border-2 border-primary/20 bg-background shadow-xl focus:border-primary focus:outline-none transition-all"
                                    />
                                    {/* Honeypot field - hidden from humans, visible to bots */}
                                    <input
                                        type="text"
                                        name="website"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                        className="absolute opacity-0 pointer-events-none"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        aria-hidden="true"
                                    />
                                    <input
                                        type="email"
                                        required
                                        placeholder={t("placeholder")}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 h-14 px-6 rounded-2xl border-2 border-primary/20 bg-background shadow-xl focus:border-primary focus:outline-none transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-xl whitespace-nowrap"
                                    >
                                        {status === "loading" ? "..." : t("button")} <Send className={"h-4 w-4 " + (status === "error" ? "text-red-500" : "")} />
                                    </button>
                                </div>
                            </form>
                            {status === "error" && (
                                <m.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 text-sm text-red-500 font-bold flex items-center justify-center gap-1"
                                >
                                    <AlertCircle className="h-4 w-4" /> Error processing subscription.
                                </m.p>
                            )}
                            <p className="mt-6 text-xs text-muted-foreground">
                                {t("privacy")}
                            </p>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
