import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ComparisonBar } from "@/components/comparison-bar";
import { AIAssistant } from "@/components/ai-assistant";
import { ScrollToTop } from "@/components/scroll-to-top";
import { PreFooter } from "@/components/pre-footer";
import { getSettings } from "@/lib/db";
import { CookieConsent } from "@/components/cookie-consent";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const settings = await getSettings();

  return (
    <ClerkProvider>
      <html lang={locale} className="dark" suppressHydrationWarning>
        <body
          className={cn(inter.className, "min-h-screen bg-background font-sans antialiased flex flex-col")}
          suppressHydrationWarning
        >
          <NextIntlClientProvider messages={messages}>
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
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
