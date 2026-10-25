import { describe, it, expect } from "vitest";
import {
  resolveProductPillar,
  getPillarBasePath,
  PILLAR_CONFIGS,
} from "./product-pillar.config";

describe("product-pillar.config", () => {
  it("resolves pillar from explicit type correctly", () => {
    expect(resolveProductPillar("COSTUME")).toBe("COSTUME");
    expect(resolveProductPillar("CAMERA")).toBe("CAMERA");
    expect(resolveProductPillar("PHOTOGRAPHY")).toBe("PHOTOGRAPHY");
    expect(resolveProductPillar("camera")).toBe("CAMERA");
    expect(resolveProductPillar("photography")).toBe("PHOTOGRAPHY");
  });

  it("resolves pillar from categoryName heuristic when type is missing", () => {
    expect(resolveProductPillar(undefined, "Máy Ảnh Du Lịch & Phụ Kiện")).toBe("CAMERA");
    expect(resolveProductPillar(undefined, "Ống Kính & Lens")).toBe("CAMERA");
    expect(resolveProductPillar(undefined, "Gói Chụp Ngoại Cảnh & Kỷ Yếu")).toBe("PHOTOGRAPHY");
    expect(resolveProductPillar(undefined, "Gói Chụp Studio Lookbook")).toBe("PHOTOGRAPHY");
    expect(resolveProductPillar(undefined, "Váy Thiết Kế")).toBe("COSTUME");
    expect(resolveProductPillar(undefined, "Áo Dài Truyền Thống")).toBe("COSTUME");
    expect(resolveProductPillar(undefined, undefined)).toBe("COSTUME");
  });

  it("contains complete configurations for all 3 business pillars", () => {
    const pillars = ["COSTUME", "CAMERA", "PHOTOGRAPHY"] as const;

    pillars.forEach((pillar) => {
      const config = PILLAR_CONFIGS[pillar];
      expect(config).toBeDefined();
      expect(config.pillar).toBe(pillar);
      expect(config.guarantees).toHaveLength(3);
      expect(config.specs.materialLabel).toBeTruthy();
      expect(config.specs.occasionLabel).toBeTruthy();
      expect(config.booking.submitBtnText).toBeTruthy();
      expect(config.relatedHeading.title).toBeTruthy();
      expect(config.depositBadge("500.000")).toContain("500.000");
    });
  });

  it("returns correct base path for each business pillar", () => {
    expect(getPillarBasePath("CAMERA")).toBe("/thue-may-anh");
    expect(getPillarBasePath("PHOTOGRAPHY")).toBe("/dich-vu-chup");
    expect(getPillarBasePath("COSTUME")).toBe("/thue-trang-phuc");
    expect(getPillarBasePath("UNKNOWN" as any)).toBe("/thue-trang-phuc");
  });
});

