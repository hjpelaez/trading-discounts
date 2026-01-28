import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { LazyMotionProvider } from "@/components/providers/lazy-motion-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google';
import { getSettings } from '@/lib/db';
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

  // Función de limpieza radical para evitar crashes por scripts pegados
  const sanitize = (val: string, pattern: RegExp, fallback: string) => {
    if (!val) return fallback;
    // Si contiene scripts o HTML, intentamos extraer el ID con el patrón
    if (val.includes('<') || val.length > 100) {
      const match = val.match(pattern);
      return match ? match[0] : fallback;
    }
    return val.trim();
  };

  const gaId = sanitize(settings.googleAnalyticsId, /G-[A-Z0-9]+/, process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX");
  const gscId = sanitize(settings.googleSearchConsoleId, /[a-zA-Z0-9_-]{43}/, ""); // GSC meta tags suelen tener 43 caracteres
  const recaptchaKey = sanitize(settings.recaptchaSiteKey, /[a-zA-Z0-9_-]{40}/, ""); // reCAPTCHA v3 keys suelen tener 40

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {gscId && <meta name="google-site-verification" content={gscId} />}
        {recaptchaKey && (
          <script src={`https://www.google.com/recaptcha/api.js?render=${recaptchaKey}`} async defer />
        )}
      </head>
      <body
        className={cn(inter.className, "min-h-screen bg-background font-sans antialiased flex flex-col")}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <LazyMotionProvider>
              {children}
            </LazyMotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId={gaId} />
    </html>
  );
}
