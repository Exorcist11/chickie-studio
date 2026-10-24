import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  formatImageUrl,
  getPublicProducts,
  getPublicProductDetail,
  DEFAULT_FEATURED_PRODUCTS,
} from "./product";

describe("Product API client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("formatImageUrl", () => {
    it("should return fallback when url is null or undefined", () => {
      const url = formatImageUrl(undefined);
      expect(url).toContain("images.unsplash.com");
    });

    it("should return absolute url as is", () => {
      const url = "https://example.com/dress.jpg";
      expect(formatImageUrl(url)).toBe(url);
    });

    it("should prepend API_BASE_URL for relative paths", () => {
      const relative = "/uploads/images/dress.jpg";
      const formatted = formatImageUrl(relative);
      expect(formatted).toContain("/uploads/images/dress.jpg");
    });

    it("should prepend slash if relative path lacks it", () => {
      const relative = "uploads/images/dress.jpg";
      const formatted = formatImageUrl(relative);
      expect(formatted).toContain("/uploads/images/dress.jpg");
    });
  });

  describe("getPublicProducts", () => {
    it("should return parsed products when fetch succeeds", async () => {
      const mockContent = [
        {
          id: 99,
          name: "Váy Dạ Hội Sparkle",
          slug: "vay-da-hoi-sparkle",
          rentalPrice: 300000,
          depositPrice: 800000,
          status: "ACTIVE" as const,
          productCode: "SPK-01",
        },
      ];

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 200,
          data: {
            content: mockContent,
            totalElements: 1,
            totalPages: 1,
            size: 20,
            number: 0,
          },
        }),
      } as Response);

      const result = await getPublicProducts({ categoryId: 1 });
      expect(result.content).toHaveLength(1);
      expect(result.content[0].name).toBe("Váy Dạ Hội Sparkle");
    });

    it("should return filtered fallback when fetch fails or errors", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network Error"));

      const result = await getPublicProducts({ categoryId: 1 });
      expect(result.content.length).toBeGreaterThan(0);
      result.content.forEach((item) => {
        expect(item.categoryId).toBe(1);
      });
    });

    it("should filter by search query on fallback", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
      } as Response);

      const result = await getPublicProducts({ search: "áo dài" });
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content[0].name.toLowerCase()).toContain("áo dài");
    });
  });

  describe("getPublicProductDetail", () => {
    it("should return data when fetch succeeds", async () => {
      const mockDetail = {
        id: 10,
        name: "Test Detail",
        slug: "test-detail",
        rentalPrice: 150000,
        depositPrice: 500000,
        status: "ACTIVE" as const,
        productCode: "TD-01",
        variants: [],
        images: [],
      };

      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 200,
          data: mockDetail,
        }),
      } as Response);

      const res = await getPublicProductDetail("test-detail");
      expect(res).toEqual(mockDetail);
    });

    it("should fallback to known default details when fetch fails", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Down"));

      const res = await getPublicProductDetail("dam-maxi-voan-xoe-tieu-thu");
      expect(res).not.toBeNull();
      expect(res?.slug).toBe("dam-maxi-voan-xoe-tieu-thu");
      expect(res?.variants.length).toBeGreaterThan(0);
    });

    it("should fallback by list item if detail not in dictionary", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Down"));

      const existingSlug = DEFAULT_FEATURED_PRODUCTS[2].slug;
      const res = await getPublicProductDetail(existingSlug);
      expect(res).not.toBeNull();
      expect(res?.slug).toBe(existingSlug);
    });

    it("should return null when product is not found anywhere", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Down"));

      const res = await getPublicProductDetail("slug-khong-ton-tai-12345");
      expect(res).toBeNull();
    });
  });
});
