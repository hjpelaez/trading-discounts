"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Rocket, Sparkles } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname, useRouter, Link as LocalizedLink } from "@/i18n/routing";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const [isOpen, setIsOpen] = React.useState(false);
    const t = useTranslations('Navbar');

    // Hide on Admin
    if (pathname?.includes("/admin")) return null;

    const routes = [
        { href: `/`, label: t('home') },
        { href: `/forex`, label: t('forex') },
        { href: `/futures`, label: t('futures') },
        { href: `/crypto`, label: t('crypto') },
        { href: `/courses`, label: t('courses') },
        { href: `/blog`, label: t('blog') },
        { href: `/contact`, label: t('contact') },
    ];

    const switchLocale = (newLocale: 'en' | 'es') => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <LocalizedLink href="/" className="flex items-center space-x-2 font-bold text-xl">
                    <Rocket className="h-6 w-6 text-primary" />
                    <span>Trading<span className="text-primary">Discounts</span></span>
                </LocalizedLink>
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {routes.map((route) => {
                        const isActive = pathname === route.href;
                        return (
                            <LocalizedLink
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "transition-colors hover:text-primary relative",
                                    isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                                )}
                            >
                                {route.label}
                                {isActive && (
                                    <span className="absolute -bottom-[21px] left-0 w-full h-[2px] bg-primary animate-in fade-in zoom-in duration-300" />
                                )}
                            </LocalizedLink>
                        );
                    })}
                </nav>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-2 text-sm font-medium border-r pr-4">
                        <button
                            onClick={() => switchLocale('en')}
                            className={cn("hover:text-primary transition-colors", locale === 'en' ? "text-primary font-bold" : "text-muted-foreground")}
                        >
                            EN
                        </button>
                        <span className="text-muted-foreground">/</span>
                        <button
                            onClick={() => switchLocale('es')}
                            className={cn("hover:text-primary transition-colors", locale === 'es' ? "text-primary font-bold" : "text-muted-foreground")}
                        >
                            ES
                        </button>
                    </div>
                    <ModeToggle />
                    <button
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                window.dispatchEvent(new CustomEvent("open-ai-chat"));
                            }
                        }}
                        className="hidden md:flex h-9 items-center justify-center rounded-md bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary/20 active:scale-95"
                        title={t('ai_tooltip') || "Ask AI Assistant"}
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {t('ai')}
                    </button>
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-b bg-background animate-in slide-in-from-top-1 duration-200">
                    <nav className="flex flex-col space-y-4 p-4">
                        {routes.map((route) => (
                            <LocalizedLink
                                key={route.href}
                                href={route.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === route.href ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {route.label}
                            </LocalizedLink>
                        ))}
                        <div className="flex gap-4 pt-2 border-t mt-2">
                            <button onClick={() => { switchLocale('en'); setIsOpen(false); }} className={cn("text-sm transition-colors", locale === 'en' ? "font-bold text-primary" : "text-muted-foreground")}>EN</button>
                            <button onClick={() => { switchLocale('es'); setIsOpen(false); }} className={cn("text-sm transition-colors", locale === 'es' ? "font-bold text-primary" : "text-muted-foreground")}>ES</button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
