import { describe, it, expect, vi, beforeEach } from "vitest";
import { getHomeFeaturedData, DEFAULT_HOME_FEATURED } from "./home";

describe("client home api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns home featured data from public API when response is ok", async () => {
    const mockData = {
      heroBanners: [{ id: 1, title: "Test Banner" }],
      categories: [{ id: 1, name: "Váy Dạ Hội" }],
      topProducts: [],
      services: [],
      rentalSteps: [],
      testimonials: [],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ code: 200, data: mockData }),
    } as Response);

    const result = await getHomeFeaturedData();

    expect(result).toEqual(mockData);
  });

  it("returns DEFAULT_HOME_FEATURED when fetch fails or errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network Error"));

    const result = await getHomeFeaturedData();

    expect(result).toEqual(DEFAULT_HOME_FEATURED);
  });

  it("returns DEFAULT_HOME_FEATURED when response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const result = await getHomeFeaturedData();

    expect(result).toEqual(DEFAULT_HOME_FEATURED);
  });
});
