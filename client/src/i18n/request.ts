import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, Locale } from "./navigation";
import viMessages from "./messages/vi.json";
import enMessages from "./messages/en.json";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: locale === "en" ? enMessages : viMessages,
  };
});
