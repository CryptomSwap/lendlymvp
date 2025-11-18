import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { AppBackground } from "@/components/app-background";
import { BodyGradient } from "@/components/body-gradient";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Toaster } from "@/components/ui/sonner";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Set direction based on locale: Hebrew is RTL, English is LTR
  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider messages={messages}>
        <BodyGradient />
        {/* Full-height background wrapper with gradient */}
        <div className="min-h-screen w-full bg-gradient-to-b from-[#F4FFFD] via-white to-white">
          {/* App Shell Container - Centered phone-like container on larger screens */}
          <div className="w-full max-w-[480px] min-h-screen bg-transparent flex flex-col relative mx-auto" dir={dir}>
            <AppBackground />
            <Header />
            <main className="flex-1 pb-24 overflow-y-auto overflow-x-hidden relative w-full bg-transparent">{children}</main>
            <BottomNav />
          </div>
        </div>
        <Toaster />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}

