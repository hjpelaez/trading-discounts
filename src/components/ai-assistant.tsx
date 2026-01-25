"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendMessageAction } from "@/actions/chat-actions";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

interface Message {
    role: "user" | "model";
    content: string;
}

export function AIAssistant() {
    const pathname = usePathname();
    const t = useTranslations("AI");
    const locale = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener("open-ai-chat", handleOpenChat);
        return () => window.removeEventListener("open-ai-chat", handleOpenChat);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // Hide AI in Admin Panel
    if (pathname?.includes("/admin")) return null;

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: "user", content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await sendMessageAction(newMessages, locale);
            setMessages([...newMessages, { role: "model", content: response }]);
        } catch (error) {
            setMessages([...newMessages, { role: "model", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[350px] md:w-[400px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{t("title")}</h3>
                                <div className="flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[10px] opacity-80">{t("status")}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10 scroll-smooth"
                    >
                        {messages.length === 0 && (
                            <div className="text-center py-10 space-y-4">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-sm">{t("welcomeTitle")}</p>
                                    <p className="text-xs text-muted-foreground px-8">
                                        {t("welcomeText")}
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2 pt-2">
                                    {[
                                        t("suggestions.q1"),
                                        t("suggestions.q2"),
                                        t("suggestions.q3")
                                    ].map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => setInput(q)}
                                            className="text-[10px] px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    m.role === "user" ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                                    m.role === "user" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                                )}>
                                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm leading-relaxed",
                                    m.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-background border border-border rounded-tl-none shadow-sm"
                                )}>
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                                <div className="bg-background border border-border p-3 rounded-2xl rounded-tl-none">
                                    <div className="flex gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t bg-background">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder={t("placeholder")}
                                className="w-full bg-muted/50 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground mt-3">
                            {t("disclaimer")}
                        </p>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative",
                    isOpen ? "bg-card border border-border" : "bg-primary text-primary-foreground"
                )}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <>
                        <MessageCircle className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                        {/* Tooltip */}
                        <div className="absolute right-full mr-4 px-3 py-2 bg-primary text-primary-foreground border border-primary/20 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                            <p className="text-xs font-bold flex items-center gap-2">
                                <Sparkles className="h-3 w-3" /> {t("tooltip")}
                            </p>
                        </div>
                    </>
                )}
            </button>
        </div>
    );
}
