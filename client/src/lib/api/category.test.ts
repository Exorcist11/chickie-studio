import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPublicCategories, DEFAULT_CATEGORIES } from "./category";

describe("client category api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns categories from public API when response is ok", async () => {
    const mockCategories = [
      {
        id: 1,
        name: "Váy Thiết Kế",
        slug: "vay-thiet-ke",
        displayOrder: 1,
        isActive: true,
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ code: 200, data: mockCategories }),
    } as Response);

    const result = await getPublicCategories();

    expect(result).toEqual(mockCategories);
  });

  it("returns DEFAULT_CATEGORIES when fetch fails or errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network Error"));

    const result = await getPublicCategories();

    expect(result).toEqual(DEFAULT_CATEGORIES);
  });

  it("returns DEFAULT_CATEGORIES when response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const result = await getPublicCategories();

    expect(result).toEqual(DEFAULT_CATEGORIES);
  });
});
