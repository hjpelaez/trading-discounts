"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Rocket } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname, useRouter, Link as LocalizedLink } from "@/i18n/routing";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <>
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
                        <div className="hidden md:flex items-center gap-2 text-sm font-medium border-r pr-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => switchLocale('en')}
                                            className={cn("hover:text-primary transition-colors", locale === 'en' ? "text-primary font-bold" : "text-muted-foreground")}
                                        >
                                            EN
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>English</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <span className="text-muted-foreground">/</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => switchLocale('es')}
                                            className={cn("hover:text-primary transition-colors", locale === 'es' ? "text-primary font-bold" : "text-muted-foreground")}
                                        >
                                            ES
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Español</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <ModeToggle />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => {
                                            if (typeof window !== 'undefined') {
                                                window.dispatchEvent(new CustomEvent("open-ai-chat"));
                                            }
                                        }}
                                        className="hidden md:flex h-9 items-center justify-center rounded-md bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary/20 active:scale-95"
                                    >
                                        {t('ai')}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('ai_tooltip') || "Ask AI Assistant"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 z-40 bg-background/80 backdrop-blur-md md:hidden transition-all duration-300 ease-in-out",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
                onClick={() => setIsOpen(false)}
            >
                <nav className={cn(
                    "flex flex-col space-y-2 p-6 pt-24 h-full bg-background/90 border-r border-border/50 w-[80%] max-w-[300px] shadow-2xl transition-transform duration-300 ease-in-out transform",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {routes.map((route) => (
                        <LocalizedLink
                            key={route.href}
                            href={route.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center px-4 py-3 text-lg font-medium rounded-xl transition-all hover:bg-primary/10 hover:text-primary active:scale-95 min-h-[44px]",
                                pathname === route.href ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                            )}
                        >
                            {route.label}
                        </LocalizedLink>
                    ))}

                    <div className="mt-auto pb-8 space-y-6 border-t pt-6">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-sm font-medium text-muted-foreground">{t('language') || "Language"}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { switchLocale('en'); setIsOpen(false); }}
                                    className={cn(
                                        "h-10 w-10 flex items-center justify-center rounded-lg border transition-all active:scale-95",
                                        locale === 'en' ? "bg-primary text-primary-foreground border-primary font-black shadow-lg shadow-sky-500/20" : "bg-card text-muted-foreground border-border"
                                    )}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => { switchLocale('es'); setIsOpen(false); }}
                                    className={cn(
                                        "h-10 w-10 flex items-center justify-center rounded-lg border transition-all active:scale-95",
                                        locale === 'es' ? "bg-primary text-primary-foreground border-primary font-black shadow-lg shadow-sky-500/20" : "bg-card text-muted-foreground border-border"
                                    )}
                                >
                                    ES
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    window.dispatchEvent(new CustomEvent("open-ai-chat"));
                                    setIsOpen(false);
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-base font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-90 active:scale-95 min-h-[48px]"
                        >
                            {t('ai')}
                        </button>
                    </div>
                </nav>
            </div>
        </>
    );
}
