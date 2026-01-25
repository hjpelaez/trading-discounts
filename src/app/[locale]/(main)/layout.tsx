
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ComparisonBar } from "@/components/comparison-bar";
import { AIAssistant } from "@/components/ai-assistant";
import { ScrollToTop } from "@/components/scroll-to-top";
import { PreFooter } from "@/components/pre-footer";
import { getSettings } from "@/lib/db";
import { CookieConsent } from "@/components/cookie-consent";

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
            </main>
            <PreFooter />
            <Footer settings={settings} />
            <ComparisonBar />
            <AIAssistant />
            <CookieConsent />
            <ScrollToTop />
        </>
    );
}
