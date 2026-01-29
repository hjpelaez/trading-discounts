
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { PreFooter } from "@/components/pre-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { ComparisonBar } from "@/components/comparison-bar";
import { AIAssistant } from "@/components/ai-assistant";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ScrollToTopOnPathChange } from "@/components/scroll-on-top";
import { DecorativeSeparator } from "@/components/decorative-separator";
import { getSettings } from "@/lib/db";

import { PageTransition } from "@/components/page-transition";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getSettings();

    return (
        <>
            <Navbar />
            <main className="flex-1">
                {children}

                {/* Newsletter Section */}
                <section className="container mx-auto px-4 md:px-6 mb-16">
                    <Newsletter />
                </section>

                {/* PreFooter Section */}
                <PreFooter />
            </main>
            <Footer settings={settings} />
            <ComparisonBar />
            <AIAssistant />
            <CookieConsent />
            <ScrollToTop />
            <ScrollToTopOnPathChange />
        </>
    );
}
