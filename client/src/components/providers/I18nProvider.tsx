"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";
import viMessages from "@/i18n/messages/vi.json";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider
      locale="vi"
      messages={viMessages}
      timeZone="Asia/Ho_Chi_Minh"
    >
      {children}
    </NextIntlClientProvider>
  );
}
