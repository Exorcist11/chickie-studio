"use client";

import React from "react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import viMessages from "@/i18n/messages/vi.json";
import enMessages from "@/i18n/messages/en.json";

export interface I18nProviderProps {
  children: React.ReactNode;
  locale?: string;
  messages?: AbstractIntlMessages;
}

export function I18nProvider({
  children,
  locale = "vi",
  messages,
}: I18nProviderProps) {
  const resolvedMessages =
    messages || (locale === "en" ? enMessages : viMessages);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={resolvedMessages}
      timeZone="Asia/Ho_Chi_Minh"
    >
      {children}
    </NextIntlClientProvider>
  );
}

