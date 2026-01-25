import { getPageBySlug } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/animations";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const pageData = await getPageBySlug("contact");
    const t = await getTranslations("Contact");

    // Choose correct translation based on current locale
    const pageTitle = pageData
        ? (locale === 'es' ? pageData.title.es : pageData.title.en)
        : t("title");

    const pageSubtitle = pageData
        ? (locale === 'es' ? pageData.content.es : pageData.content.en)
        : t("subtitle");

    return (
        <div className="min-h-screen pb-24">
            <header className="relative py-24 md:py-40 overflow-hidden bg-primary/5">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <FadeIn>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                            {pageTitle}
                        </h1>
                        <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                            {pageSubtitle}
                        </p>
                    </FadeIn>
                </div>
            </header>

            <ContactForm privacyNote={t("privacyNote")} />
        </div>
    );
}
