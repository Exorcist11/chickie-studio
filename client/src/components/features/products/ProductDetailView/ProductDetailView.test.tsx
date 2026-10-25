import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductDetailView } from "./ProductDetailView";
import type { ProductDetail, ProductListItem } from "@/types/product";

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
  usePathname: () => "/thue-may-anh/canon-eos-r6",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

// Mock NavigationProgressBar
vi.mock("@/components/common/NavigationProgressBar", () => ({
  useNavigationProgress: () => ({ start: vi.fn(), done: vi.fn() }),
}));

const mockProduct: ProductDetail = {
  id: 1,
  productCode: "MA001",
  name: "Máy Ảnh Canon EOS R6 Mark II",
  slug: "canon-eos-r6",
  type: "CAMERA",
  categoryId: 4,
  categoryName: "Máy ảnh du lịch",
  rentalPrice: 650000,
  depositPrice: 3000000,
  status: "ACTIVE",
  material: "Full-frame 24.2MP, 40fps",
  occasion: "Du lịch, Sự kiện, Kỷ yếu",
  description: "Dòng máy ảnh mirrorless đa dụng cao cấp chuyên trị chụp đêm và sự kiện.",
  variants: [
    { id: 101, size: "Tiêu chuẩn", color: "Đen", sku: "R6-STD" },
  ],
  images: [
    { id: 1, imageUrl: "/images/canon-r6.jpg", isThumbnail: true, displayOrder: 1 },
  ],
};

const mockRelated: ProductListItem[] = [
  {
    id: 2,
    productCode: "MA002",
    name: "Sony Alpha A7 IV",
    slug: "sony-a74",
    type: "CAMERA",
    rentalPrice: 700000,
    depositPrice: 3500000,
    status: "ACTIVE",
    thumbnailUrl: "/images/sony-a74.jpg",
  },
];

describe("ProductDetailView", () => {
  it("renders product name, code and formatted price correctly", () => {
    render(<ProductDetailView product={mockProduct} relatedProducts={mockRelated} />);

    expect(screen.getByRole("heading", { name: "Máy Ảnh Canon EOS R6 Mark II" })).toBeInTheDocument();
    expect(screen.getByText(/MÃ: MA001/)).toBeInTheDocument();
    expect(screen.getAllByText(/650\.000/).length).toBeGreaterThanOrEqual(1);
  });

  it("links breadcrumb to dedicated pillar path (/thue-may-anh)", () => {
    render(
      <ProductDetailView
        product={mockProduct}
        pillarBasePath="/thue-may-anh"
      />
    );

    const breadcrumbLinks = screen.getAllByRole("link");
    const pillarLink = breadcrumbLinks.find(
      (link) => link.getAttribute("href") === "/thue-may-anh"
    );
    expect(pillarLink).toBeDefined();
  });

  it("renders camera-specific booking and guarantee specifications", () => {
    render(<ProductDetailView product={mockProduct} />);

    expect(screen.getByText("Thông số & Tình trạng:")).toBeInTheDocument();
    expect(screen.getByText("Full-frame 24.2MP, 40fps")).toBeInTheDocument();
    expect(screen.getByText("Mục đích sử dụng:")).toBeInTheDocument();
    expect(screen.getByText("Du lịch, Sự kiện, Kỷ yếu")).toBeInTheDocument();
  });

  it("renders costume specifications when type is COSTUME", () => {
    const costumeProduct: ProductDetail = {
      ...mockProduct,
      type: "COSTUME",
      name: "Váy Dạ Hội Kim Tuyến Hoàng Gia",
      slug: "vay-da-hoi",
      material: "Voan lụa cao cấp đính pha lê",
      occasion: "Dạ tiệc, Prom, Chụp studio",
    };

    render(
      <ProductDetailView
        product={costumeProduct}
        pillarBasePath="/thue-trang-phuc"
      />
    );

    expect(screen.getByText("Chất liệu cao cấp:")).toBeInTheDocument();
    expect(screen.getByText("Voan lụa cao cấp đính pha lê")).toBeInTheDocument();
    expect(screen.getByText("Dịp phù hợp:")).toBeInTheDocument();
  });

  it("renders photography specifications when type is PHOTOGRAPHY", () => {
    const photoProduct: ProductDetail = {
      ...mockProduct,
      type: "PHOTOGRAPHY",
      name: "Gói Chụp Ảnh Kỷ Yếu Ngoại Cảnh",
      slug: "chup-ky-yeu",
      material: "Chụp 2-3 tiếng, tặng 20 ảnh retouch",
      occasion: "Hà Nội, ngoại thành",
    };

    render(
      <ProductDetailView
        product={photoProduct}
        pillarBasePath="/dich-vu-chup"
      />
    );

    expect(screen.getByText("Quyền lợi gói chụp:")).toBeInTheDocument();
    expect(screen.getByText("Chụp 2-3 tiếng, tặng 20 ảnh retouch")).toBeInTheDocument();
  });

  it("renders related products with links nested under pillarBasePath", () => {
    render(
      <ProductDetailView
        product={mockProduct}
        relatedProducts={mockRelated}
        pillarBasePath="/thue-may-anh"
      />
    );

    expect(screen.getByText("Sony Alpha A7 IV")).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    const relatedLink = links.find(
      (link) => link.getAttribute("href") === "/thue-may-anh/sony-a74"
    );
    expect(relatedLink).toBeDefined();
  });
});
