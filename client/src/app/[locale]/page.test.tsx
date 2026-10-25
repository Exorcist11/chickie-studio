import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "./page";

vi.mock("@/lib/api/home", () => ({
  getHomeFeaturedData: vi.fn().mockResolvedValue({
    heroBanners: [
      {
        id: 1,
        title: "More than just a dress",
        subtitle: "Váy cưới thiết kế & Maxi chụp ngoại cảnh",
        imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
        altText: "Slide váy cưới",
        ctaText: "Khám phá bộ sưu tập",
        ctaLink: "/products",
      },
    ],
    categories: [],
    topProducts: [],
    services: [
      {
        key: "costume",
        title: "Thuê trang phục",
        description: "Đa dạng phong cách",
        imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
        link: "/products?type=costume",
      },
    ],
    rentalSteps: [
      {
        stepNumber: 1,
        title: "Chọn mẫu & size",
        description: "Khám phá bộ sưu tập",
        icon: "sparkles",
      },
    ],
    testimonials: [
      {
        id: 1,
        customerName: "Nguyễn Thị Mai",
        role: "Khách hàng thân thiết",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        content: "Dịch vụ tại Chickie Studio thật sự tuyệt vời!",
        rating: 5,
      },
    ],
  }),
}));

vi.mock("@/lib/api/product", () => ({
  getPublicProducts: vi.fn().mockResolvedValue({
    content: [],
    totalElements: 0,
  }),
  formatImageUrl: (url: string) => url,
}));

describe("HomePage Component", () => {
  it("renders HomePage with all key sections properly", async () => {
    const Component = await HomePage();
    render(Component);

    // 1. Hero
    expect(screen.getByText("More than")).toBeInTheDocument();
    expect(screen.getByText("just a dress")).toBeInTheDocument();

    // 2. Services
    expect(screen.getByText("Dịch vụ nổi bật")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Thuê trang phục" })).toBeInTheDocument();

    // 3. Process Steps (CNT-001 feature)
    expect(screen.getByText("Quy Trình Thuê Đồ Đơn Giản")).toBeInTheDocument();
    expect(screen.getByText("Chọn mẫu & size")).toBeInTheDocument();

    // 4. Testimonials
    expect(screen.getByText("Cảm Nhận Từ Khách Hàng")).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Thị Mai")).toBeInTheDocument();

    // 5. Floating contact buttons
    const hotlineLink = screen.getByRole("link", {
      name: /Gọi hotline tư vấn trực tiếp/i,
    });
    expect(hotlineLink).toBeInTheDocument();
    const zaloLink = screen.getByRole("link", {
      name: /Nhắn tin tư vấn trực tiếp qua Zalo/i,
    });
    expect(zaloLink).toBeInTheDocument();
  });
});
