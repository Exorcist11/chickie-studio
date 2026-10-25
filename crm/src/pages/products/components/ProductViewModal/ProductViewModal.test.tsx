import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductViewModal } from "./ProductViewModal";
import { ProductDetailResponse } from "../../../../types/product";
import { Category } from "../../../../types/category";
import "../../../../i18n";

describe("ProductViewModal", () => {
  const mockCategories: Category[] = [
    {
      id: 1,
      name: "Váy Dạ Hội",
      slug: "vay-da-hoi",
      type: "COSTUME",
      displayOrder: 1,
      isActive: true,
      createdAt: "2026-10-24T10:00:00Z",
      updatedAt: "2026-10-24T10:00:00Z",
    },
    {
      id: 2,
      name: "Máy Ảnh Du Lịch",
      slug: "may-anh-du-lich",
      type: "CAMERA",
      displayOrder: 2,
      isActive: true,
      createdAt: "2026-10-24T10:00:00Z",
      updatedAt: "2026-10-24T10:00:00Z",
    },
  ];

  const mockProduct: ProductDetailResponse = {
    id: 1,
    categoryId: 1,
    categoryName: "Váy Dạ Hội",
    productCode: "PRD-LUA-01",
    name: "Váy Lụa Trắng Cổ Yếm",
    slug: "vay-lua-trang-co-yem",
    description: "Váy lụa mềm mại thêu hoa cao cấp",
    material: "Lụa tơ tằm",
    occasion: "Dự tiệc, Kỷ yếu",
    rentalPrice: 350000,
    depositPrice: 500000,
    status: "ACTIVE",
    variants: [
      { id: 10, size: "S", color: "Trắng", sku: "PRD-LUA-01-S-TRAN" },
      { id: 11, size: "M", color: "Đỏ", sku: "PRD-LUA-01-M-DO" },
    ],
    images: [
      { id: 100, imageUrl: "https://example.com/thumb.jpg", isThumbnail: true },
      { id: 101, imageUrl: "https://example.com/pic2.jpg", isThumbnail: false },
    ],
    createdAt: "2026-10-24T10:00:00Z",
    updatedAt: "2026-10-24T10:00:00Z",
  };

  let writeTextSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        configurable: true,
      });
    }
    writeTextSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
  });

  it("returns null when product is null or isOpen is false", () => {
    const { container: c1 } = render(
      <ProductViewModal isOpen={false} onClose={vi.fn()} product={mockProduct} />
    );
    expect(c1).toBeEmptyDOMElement();

    const { container: c2 } = render(
      <ProductViewModal isOpen={true} onClose={vi.fn()} product={null} />
    );
    expect(c2).toBeEmptyDOMElement();
  });

  it("renders product basic info, code, pillar badge, and pricing", () => {
    render(
      <ProductViewModal
        isOpen={true}
        onClose={vi.fn()}
        product={mockProduct}
        categories={mockCategories}
      />
    );

    expect(screen.getByText("Chi tiết sản phẩm")).toBeInTheDocument();
    expect(screen.getAllByText("Váy Lụa Trắng Cổ Yếm").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("PRD-LUA-01")).toBeInTheDocument();
    expect(screen.getByText("LOOKBOOK TRANG PHỤC")).toBeInTheDocument();
    expect(screen.getByText("Lụa tơ tằm")).toBeInTheDocument();
    expect(screen.getByText("Dự tiệc, Kỷ yếu")).toBeInTheDocument();
    expect(screen.getByText("Váy lụa mềm mại thêu hoa cao cấp")).toBeInTheDocument();
  });

  it("switches to variants tab and displays statistics and variant rows", async () => {
    const user = userEvent.setup();
    render(
      <ProductViewModal
        isOpen={true}
        onClose={vi.fn()}
        product={mockProduct}
        categories={mockCategories}
      />
    );

    const variantsTabBtn = screen.getByRole("tab", { name: /Biến thể & Kho đồ/i });
    await user.click(variantsTabBtn);

    expect(screen.getByText("PRD-LUA-01-S-TRAN")).toBeInTheDocument();
    expect(screen.getByText("PRD-LUA-01-M-DO")).toBeInTheDocument();
    expect(screen.getAllByText("Sẵn sàng cho thuê").length).toBe(2);
  });

  it("switches to gallery tab and shows all lookbook photos", async () => {
    const user = userEvent.setup();
    render(
      <ProductViewModal
        isOpen={true}
        onClose={vi.fn()}
        product={mockProduct}
        categories={mockCategories}
      />
    );

    const galleryTabBtn = screen.getByRole("tab", { name: /Bộ ảnh Lookbook/i });
    await user.click(galleryTabBtn);

    expect(screen.getByText("Ảnh #1")).toBeInTheDocument();
    expect(screen.getByText("Ảnh #2")).toBeInTheDocument();
  });

  it("allows navigating through images via next and prev buttons", async () => {
    const user = userEvent.setup();
    render(
      <ProductViewModal
        isOpen={true}
        onClose={vi.fn()}
        product={mockProduct}
        categories={mockCategories}
      />
    );

    expect(screen.getByText("1 / 2")).toBeInTheDocument();

    const nextBtn = screen.getByLabelText("Ảnh kế tiếp");
    await user.click(nextBtn);

    expect(screen.getByText("2 / 2")).toBeInTheDocument();

    const prevBtn = screen.getByLabelText("Ảnh trước");
    await user.click(prevBtn);

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("calls onEdit when edit action is clicked", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();

    render(
      <ProductViewModal
        isOpen={true}
        onClose={vi.fn()}
        product={mockProduct}
        categories={mockCategories}
        onEdit={handleEdit}
      />
    );

    const editBtns = screen.getAllByRole("button", { name: /Chỉnh sửa sản phẩm/i });
    expect(editBtns).toHaveLength(1);
    await user.click(editBtns[0]);

    expect(handleEdit).toHaveBeenCalledWith(mockProduct);
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <ProductViewModal
        isOpen={true}
        onClose={handleClose}
        product={mockProduct}
        categories={mockCategories}
      />
    );

    const closeBtn = screen.getByRole("button", { name: "Đóng" });
    await user.click(closeBtn);

    expect(handleClose).toHaveBeenCalled();
  });

  it("handles copy to clipboard for product code and direct link", async () => {
    const user = userEvent.setup();
    render(
      <ProductViewModal
        isOpen={true}
        onClose={vi.fn()}
        product={mockProduct}
        categories={mockCategories}
      />
    );

    const copyCodeBtn = screen.getByLabelText("Sao chép mã");
    await user.click(copyCodeBtn);

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalledWith("PRD-LUA-01");
    });

    const copyLinkBtn = screen.getByRole("button", { name: /Sao chép link/i });
    await user.click(copyLinkBtn);

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalledWith(window.location.href);
    });
  });
});
