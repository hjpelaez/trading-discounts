"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeAction } from "@/actions/subscriber-actions";

export function Newsletter() {
    const t = useTranslations("Newsletter");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        const result = await subscribeAction(email, name);

        if (result.success) {
            setStatus("success");
            setEmail("");
            setName("");
        } else {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <section className="bg-primary/5 py-16 md:py-24 rounded-3xl border border-primary/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <AnimatePresence mode="wait">
                    {status === "success" ? (
                        <motion.div
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
                        </motion.div>
                    ) : (
                        <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                                {t("title")}
                            </h2>
                            <p className="text-muted-foreground text-lg mb-10">
                                {t("subtitle")}
                            </p>
                            <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
                                <div className="flex flex-col gap-3 mb-3">
                                    <input
                                        type="text"
                                        required
                                        placeholder={t("namePlaceholder")}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full h-14 px-6 rounded-2xl border-2 border-primary/20 bg-background shadow-xl focus:border-primary focus:outline-none transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        placeholder={t("placeholder")}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 pl-6 pr-32 rounded-2xl border-2 border-primary/20 bg-background shadow-xl focus:border-primary focus:outline-none transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="absolute right-2 top-2 h-10 px-6 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                                    >
                                        {status === "loading" ? "..." : t("button")} <Send className={"h-4 w-4 " + (status === "error" ? "text-red-500" : "")} />
                                    </button>
                                </div>
                            </form>
                            {status === "error" && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 text-sm text-red-500 font-bold flex items-center justify-center gap-1"
                                >
                                    <AlertCircle className="h-4 w-4" /> Error processing subscription.
                                </motion.p>
                            )}
                            <p className="mt-6 text-xs text-muted-foreground">
                                {t("privacy")}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
