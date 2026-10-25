import "@testing-library/jest-dom";
import * as matchers from "vitest-axe/matchers";
import { expect, vi } from "vitest";
import React from "react";
import viMessages from "./src/i18n/messages/vi.json";

expect.extend(matchers);

// Mock window.matchMedia if not available
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  if (typeof HTMLCanvasElement !== "undefined") {
    HTMLCanvasElement.prototype.getContext = () => null;
  }
}

// Global Next.js App Router navigation mock
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
}));

// Global i18n navigation mock
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  Link: ({ children, href, prefetch: _prefetch, ...props }: any) =>
    React.createElement("a", { href: typeof href === "string" ? href : "/", ...props }, children),
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "always",
}));

// Fallback next-intl support when component is rendered without Provider in unit tests
vi.mock("next-intl", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useTranslations: (namespace?: string) => {
      try {
        return actual.useTranslations(namespace);
      } catch {
        const getNested = (obj: any, path: string) => {
          return path.split(".").reduce((acc, part) => acc && acc[part], obj);
        };
        const nsMessages = namespace ? getNested(viMessages, namespace) || {} : viMessages;
        return (key: string, params?: Record<string, any>) => {
          let text = (typeof nsMessages === "object" ? nsMessages[key] : key) || key;
          if (typeof text === "string" && params) {
            Object.entries(params).forEach(([k, v]) => {
              text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
            });
          }
          return text;
        };
      }
    },
    useLocale: () => {
      try {
        return actual.useLocale();
      } catch {
        return "vi";
      }
    },
  };
});
