import { describe, it, expect, vi } from "vitest";

// Mock next/navigation
const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
vi.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
}));

// Mock next-intl/server getRequestConfig
vi.mock("next-intl/server", () => ({
  getRequestConfig: (fn: (params: { locale: string }) => Promise<{ messages: Record<string, unknown> }>) => fn,
}));

import requestConfig from "./request";

type RequestConfigFn = (params: { locale: string }) => Promise<{ messages: Record<string, unknown> }>;

describe("i18n request config", () => {
  it("loads messages for supported locale 'vi'", async () => {
    const config = await (requestConfig as unknown as RequestConfigFn)({ locale: "vi" });
    expect(config).toBeDefined();
    expect(config.messages).toBeDefined();
    expect(config.messages.common).toBeDefined();
  });

  it("loads messages for supported locale 'en'", async () => {
    const config = await (requestConfig as unknown as RequestConfigFn)({ locale: "en" });
    expect(config).toBeDefined();
    expect(config.messages).toBeDefined();
    expect(config.messages.common).toBeDefined();
  });

  it("calls notFound for unsupported locale", async () => {
    await expect(
      (requestConfig as unknown as RequestConfigFn)({ locale: "fr" })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });
});
