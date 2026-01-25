"use client";

import { useTranslations } from "next-intl";
import { Mail, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/animations";
import { sendContactEmailAction } from "@/actions/contact-actions";

export function ContactForm({ privacyNote }: { privacyNote: string }) {
    const t = useTranslations("Contact");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        const formData = new FormData(e.currentTarget);
        await sendContactEmailAction(formData);
        setStatus("success");
    };

    return (
        <div className="container mx-auto px-4 -mt-16 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info Sidebar */}
                <FadeIn className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border p-8 rounded-3xl shadow-xl">
                        <h2 className="text-2xl font-bold mb-8">{t("infoTitle")}</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-2xl">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold">{t("email")}</p>
                                    <p className="text-muted-foreground">support@tradingdiscounts.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-2xl">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold">{t("support")}</p>
                                    <p className="text-muted-foreground">24/7 Response Time</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-12 border-t border-border/50">
                            <p className="text-sm text-muted-foreground italic">
                                {privacyNote}
                            </p>
                        </div>
                    </div>
                </FadeIn>

                {/* Form */}
                <FadeIn delay={0.2} className="lg:col-span-2">
                    <div className="bg-card border border-border p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20"
                                >
                                    <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">{t("successTitle")}</h2>
                                    <p className="text-muted-foreground text-lg mb-8">
                                        {t("successMessage")}
                                    </p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="font-bold text-primary hover:underline"
                                    >
                                        {t("sendAnother")}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    exit={{ opacity: 0, y: 20 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground pl-1">
                                                {t("nameLabel")}
                                            </label>
                                            <input
                                                name="name"
                                                required
                                                className="w-full h-14 bg-muted/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-2xl px-6 transition-all outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground pl-1">
                                                {t("emailLabel")}
                                            </label>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full h-14 bg-muted/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-2xl px-6 transition-all outline-none"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground pl-1">
                                            {t("subjectLabel")}
                                        </label>
                                        <input
                                            name="subject"
                                            required
                                            className="w-full h-14 bg-muted/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-2xl px-6 transition-all outline-none"
                                            placeholder="Prop Firm Inquiry"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground pl-1">
                                            {t("messageLabel")}
                                        </label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={6}
                                            className="w-full bg-muted/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-2xl p-6 transition-all outline-none resize-none"
                                            placeholder={t("messagePlaceholder")}
                                        />
                                    </div>
                                    <button
                                        disabled={status === "loading"}
                                        className="w-full h-16 bg-primary text-primary-foreground font-black text-xl rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {status === "loading" ? "..." : t("submitButton")} <Send className="h-6 w-6" />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
