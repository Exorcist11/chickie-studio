import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { NavigationProgressBar } from "@/components/common";
import { Toaster } from "@/components/ui/Notify";
import { fontLora, fontBeVietnamPro } from "@/lib/fonts";
import { locales, Locale } from "@/i18n/navigation";
import "@/styles/main.scss";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEn = locale === "en";
  return {
    title: isEn
      ? "Chickie Studio | Designer Dress & Photoshoot Combo Rentals"
      : "Chickie Studio | Dịch Vụ Cho Thuê Váy & Combo Chụp Ảnh",
    description: isEn
      ? "Chickie Studio - Premium designer dress rentals, traditional Ao Dai, and professional camera combos in Hanoi."
      : "Chickie Studio - Cho thuê váy thiết kế cao cấp, áo dài truyền thống & combo máy ảnh chuyên nghiệp.",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        vi: "/vi",
        en: "/en",
      },
    },
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  unstable_setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${fontLora.variable} ${fontBeVietnamPro.variable} antialiased`}
    >
      <body className="min-h-screen bg-warm-white text-ink font-sans selection:bg-burgundy selection:text-white">
        <I18nProvider locale={locale}>
          <Suspense fallback={null}>
            <NavigationProgressBar />
          </Suspense>
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
