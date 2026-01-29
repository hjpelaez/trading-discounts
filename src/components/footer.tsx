"use client";

import { Link as LocalizedLink } from "@/i18n/routing";
import { Rocket, Facebook, Instagram, Send, ShieldAlert, FileText, Mail, Info } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Settings } from "@/lib/db";

export function Footer({ settings }: { settings: Settings }) {
    const t = useTranslations('Footer');
    const locale = useLocale();
    const pathname = usePathname();

    // Hide on Admin
    if (pathname?.includes("/admin")) return null;

    return (
        <footer className="bg-muted/30 border-t relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12">
                    <div className="space-y-6">
                        <LocalizedLink href="/" className="flex items-center space-x-2 font-black text-2xl tracking-tighter">
                            <Rocket className="h-8 w-8 text-primary" />
                            <span>Trading<span className="text-primary">Discounts</span></span>
                        </LocalizedLink>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                            {t('description')}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-foreground/50">{t('markets')}</h3>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><LocalizedLink href="/crypto" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">Crypto</LocalizedLink></li>
                            <li><LocalizedLink href="/forex" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">Forex</LocalizedLink></li>
                            <li><LocalizedLink href="/futures" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">Futures</LocalizedLink></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-foreground/50">{t('education')}</h3>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><LocalizedLink href="/blog" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">{t('blog')}</LocalizedLink></li>
                            <li><LocalizedLink href="/courses" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">{t('courses')}</LocalizedLink></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-foreground/50">{t('company')}</h3>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><LocalizedLink href="/about-us" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><Info className="h-3.5 w-3.5" /> {locale === 'es' ? 'Sobre Nosotros' : 'About Us'}</LocalizedLink></li>
                            <li><LocalizedLink href="/contact" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {locale === 'es' ? 'Contacto' : 'Contact'}</LocalizedLink></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-foreground/50">{t('terms')}</h3>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><LocalizedLink href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> {locale === 'es' ? 'Privacidad' : 'Privacy'}</LocalizedLink></li>
                            <li><LocalizedLink href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> {locale === 'es' ? 'Términos' : 'Terms'}</LocalizedLink></li>
                            <li><LocalizedLink href="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ShieldAlert className="h-3.5 w-3.5" /> {locale === 'es' ? 'Aviso Legal' : 'Disclaimer'}</LocalizedLink></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-border/50 flex flex-col items-center gap-8">
                    <div className="flex flex-col items-center gap-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{t('socials')}</h4>
                        <div className="flex space-x-6">
                            <a href={settings.socials.instagram} target="_blank" className="p-4 rounded-2xl bg-background border border-border/50 hover:border-primary transition-all hover:scale-110 shadow-xl shadow-black/5 group">
                                <Instagram className="h-5 w-5 group-hover:text-primary transition-colors" />
                            </a>
                            <a href={settings.socials.telegram} target="_blank" className="p-4 rounded-2xl bg-background border border-border/50 hover:border-primary transition-all hover:scale-110 shadow-xl shadow-black/5 group">
                                <Send className="h-5 w-5 text-sky-400 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href={settings.socials.facebook} target="_blank" className="p-4 rounded-2xl bg-background border border-border/50 hover:border-primary transition-all hover:scale-110 shadow-xl shadow-black/5 group">
                                <Facebook className="h-5 w-5 group-hover:text-primary transition-colors" />
                            </a>
                        </div>
                    </div>

                    <div className="w-full space-y-4">
                        <p className="text-[10px] md:text-sm text-muted-foreground/60 text-center leading-relaxed font-medium">
                            {t('advice')}
                        </p>
                        <p className="text-[10px] text-muted-foreground/40 text-center font-black uppercase tracking-widest">
                            © {new Date().getFullYear()} Trading Discounts. {t('rights')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
