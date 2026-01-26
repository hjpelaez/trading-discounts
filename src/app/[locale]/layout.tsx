import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { LazyMotionProvider } from "@/components/providers/lazy-motion-provider";
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

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body
        className={cn(inter.className, "min-h-screen bg-background font-sans antialiased flex flex-col")}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <LazyMotionProvider>
            {children}
          </LazyMotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
