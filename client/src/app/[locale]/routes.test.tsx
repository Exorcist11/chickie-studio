import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import CameraRentalPage, { metadata as cameraMeta } from "./thue-may-anh/page";
import CameraDetailPage, { generateMetadata as cameraDetailMeta } from "./thue-may-anh/[slug]/page";

import CostumeRentalPage, { metadata as costumeMeta } from "./thue-trang-phuc/page";
import CostumeDetailPage, { generateMetadata as costumeDetailMeta } from "./thue-trang-phuc/[slug]/page";

import PhotographyServicesPage, { metadata as photoMeta } from "./dich-vu-chup/page";
import PhotographyDetailPage, { generateMetadata as photoDetailMeta } from "./dich-vu-chup/[slug]/page";

import LookbookPage, { metadata as lookbookMeta } from "./lookbook/page";
import LookbookDetailPage, { generateMetadata as lookbookDetailMeta } from "./lookbook/[slug]/page";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "vi",
}));

// Mock @/i18n/navigation
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => "/thue-may-anh",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

// Mock NavigationProgressBar
vi.mock("@/components/common/NavigationProgressBar", () => ({
  useNavigationProgress: () => ({ start: vi.fn(), done: vi.fn() }),
}));

// Mock APIs
vi.mock("@/lib/api/category", () => ({
  getPublicCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "Váy dạ hội", slug: "vay-da-hoi", productCount: 10 },
    { id: 4, name: "Máy ảnh du lịch", slug: "may-anh-du-lich", productCount: 5 },
  ]),
}));

vi.mock("@/lib/api/product", () => ({
  getPublicProducts: vi.fn().mockResolvedValue({
    content: [
      {
        id: 10,
        name: "Canon EOS R6 Mark II",
        slug: "canon-eos-r6",
        productCode: "MA010",
        type: "CAMERA",
        rentalPrice: 650000,
        depositPrice: 3000000,
        thumbnailUrl: "/canon.jpg",
      },
      {
        id: 20,
        name: "Váy Dạ Hội Công Chúa",
        slug: "vay-da-hoi-cong-chua",
        productCode: "TP020",
        type: "COSTUME",
        rentalPrice: 400000,
        depositPrice: 1500000,
        thumbnailUrl: "/vay.jpg",
      },
    ],
    totalElements: 2,
  }),
  getPublicProductDetail: vi.fn().mockImplementation((slug: string) => {
    if (slug === "not-found") return Promise.resolve(null);
    return Promise.resolve({
      id: 10,
      name: "Canon EOS R6 Mark II",
      slug: "canon-eos-r6",
      productCode: "MA010",
      type: "CAMERA",
      categoryId: 4,
      categoryName: "Máy ảnh du lịch",
      rentalPrice: 650000,
      depositPrice: 3000000,
      status: "ACTIVE",
      material: "Fullframe 24.2MP",
      occasion: "Du lịch, Sự kiện",
      description: "Máy ảnh cao cấp",
      variants: [{ id: 1, size: "Tiêu chuẩn", color: "Đen", sku: "R6-STD" }],
      images: [{ id: 1, imageUrl: "/canon.jpg", isThumbnail: true, displayOrder: 1 }],
    });
  }),
  getPublicProductAvailability: vi.fn().mockResolvedValue([]),
  formatImageUrl: (url: string) => url,
}));

describe("Dedicated Business Pillar Routes", () => {
  describe("/thue-may-anh", () => {
    it("renders camera rental catalog page with banner", async () => {
      expect(cameraMeta.title).toBeDefined();
      const Page = await CameraRentalPage({});
      render(Page);
      expect(
        screen.getByRole("heading", { name: "Thuê Máy Ảnh & Phụ Kiện Du Lịch Chuyên Nghiệp" })
      ).toBeInTheDocument();
      expect(screen.getByText("Chickie Studio Camera Rental")).toBeInTheDocument();
    });

    it("renders camera detail page with metadata", async () => {
      const meta = await cameraDetailMeta({ params: { slug: "canon-eos-r6" } });
      expect(meta.title).toContain("Canon EOS R6 Mark II");

      const notFoundMeta = await cameraDetailMeta({ params: { slug: "not-found" } });
      expect(notFoundMeta.title).toContain("Không Tồn Tại");

      const Page = await CameraDetailPage({ params: { slug: "canon-eos-r6" } });
      render(Page);
      expect(screen.getByRole("heading", { name: "Canon EOS R6 Mark II" })).toBeInTheDocument();
    });
  });

  describe("/thue-trang-phuc", () => {
    it("renders costume rental catalog page with banner", async () => {
      expect(costumeMeta.title).toBeDefined();
      const Page = await CostumeRentalPage({});
      render(Page);
      expect(
        screen.getByRole("heading", { name: "Thuê Trang Phục Thiết Kế Cao Cấp" })
      ).toBeInTheDocument();
      expect(screen.getByText("Chickie Studio Wardrobe")).toBeInTheDocument();
    });

    it("renders costume detail page with metadata", async () => {
      const meta = await costumeDetailMeta({ params: { slug: "canon-eos-r6" } });
      expect(meta.title).toContain("Canon EOS R6 Mark II");

      const Page = await CostumeDetailPage({ params: { slug: "canon-eos-r6" } });
      render(Page);
      expect(screen.getByRole("heading", { name: "Canon EOS R6 Mark II" })).toBeInTheDocument();
    });
  });

  describe("/dich-vu-chup", () => {
    it("renders photography services catalog page with banner", async () => {
      expect(photoMeta.title).toBeDefined();
      const Page = await PhotographyServicesPage({});
      render(Page);
      expect(
        screen.getByRole("heading", { name: "Dịch Vụ Chụp Ảnh Ngoại Cảnh & Studio" })
      ).toBeInTheDocument();
      expect(screen.getByText("Chickie Studio Photography")).toBeInTheDocument();
    });

    it("renders photography detail page with metadata", async () => {
      const meta = await photoDetailMeta({ params: { slug: "canon-eos-r6" } });
      expect(meta.title).toContain("Canon EOS R6 Mark II");

      const Page = await PhotographyDetailPage({ params: { slug: "canon-eos-r6" } });
      render(Page);
      expect(screen.getByRole("heading", { name: "Canon EOS R6 Mark II" })).toBeInTheDocument();
    });
  });

  describe("/lookbook", () => {
    it("renders lookbook page with banner", async () => {
      expect(lookbookMeta.title).toBeDefined();
      const Page = await LookbookPage({});
      render(Page);
      expect(
        screen.getByRole("heading", { name: "Lookbook & Bộ Sưu Tập Nghệ Thuật" })
      ).toBeInTheDocument();
      expect(screen.getByText("Chickie Studio Lookbook")).toBeInTheDocument();
    });

    it("renders lookbook detail page with metadata", async () => {
      const meta = await lookbookDetailMeta({ params: { slug: "canon-eos-r6" } });
      expect(meta.title).toContain("Canon EOS R6 Mark II");

      const Page = await LookbookDetailPage({ params: { slug: "canon-eos-r6" } });
      render(Page);
      expect(screen.getByRole("heading", { name: "Canon EOS R6 Mark II" })).toBeInTheDocument();
    });
  });
});
