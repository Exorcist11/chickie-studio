import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductsPage } from "./ProductsPage";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import {
  PageResult,
  ProductDetailResponse,
  ProductListResponse,
} from "../../types/product";
import { Category } from "../../types/category";
import "../../i18n";

vi.mock("../../services/product.service", () => ({
  productService: {
    getProducts: vi.fn(),
    getProductById: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

vi.mock("../../services/category.service", () => ({
  categoryService: {
    getAllCategories: vi.fn(),
  },
}));

vi.mock("../../services/upload.service", () => ({
  uploadService: {
    uploadImage: vi.fn().mockResolvedValue("/uploads/images/dress.jpg"),
    uploadImages: vi.fn().mockResolvedValue(["/uploads/images/dress.jpg"]),
  },
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("ProductsPage", () => {
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
    {
      id: 3,
      name: "Gói Chụp Ngoại Cảnh",
      slug: "chup-anh-ngoai-canh",
      type: "PHOTOGRAPHY",
      displayOrder: 3,
      isActive: true,
      createdAt: "2026-10-24T10:00:00Z",
      updatedAt: "2026-10-24T10:00:00Z",
    },
  ];

  const mockProductList: ProductListResponse = {
    id: 1,
    categoryId: 1,
    categoryName: "Váy Dạ Hội",
    productCode: "PRD-LUA-01",
    name: "Váy Lụa Trắng Cổ Yếm",
    slug: "vay-lua-trang-co-yem",
    rentalPrice: 350000,
    depositPrice: 500000,
    status: "ACTIVE",
    variantCount: 1,
    thumbnailUrl: "https://example.com/thumb.jpg",
    createdAt: "2026-10-24T10:00:00Z",
  };

  const mockPageResult: PageResult<ProductListResponse> = {
    content: [mockProductList],
    totalElements: 1,
    totalPages: 1,
    size: 20,
    number: 0,
    first: true,
    last: true,
    empty: false,
  };

  const mockProductDetail: ProductDetailResponse = {
    id: 1,
    categoryId: 1,
    categoryName: "Váy Dạ Hội",
    productCode: "PRD-LUA-01",
    name: "Váy Lụa Trắng Cổ Yếm",
    slug: "vay-lua-trang-co-yem",
    description: "Váy lụa mềm mại",
    material: "Lụa tơ tằm",
    occasion: "Dự tiệc",
    rentalPrice: 350000,
    depositPrice: 500000,
    status: "ACTIVE",
    variants: [{ id: 10, size: "S", color: "Trắng", sku: "PRD-LUA-01-S-TRAN" }],
    images: [{ id: 100, imageUrl: "https://example.com/thumb.jpg", isThumbnail: true }],
    createdAt: "2026-10-24T10:00:00Z",
    updatedAt: "2026-10-24T10:00:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(categoryService.getAllCategories).mockResolvedValue(mockCategories);
    vi.mocked(productService.getProducts).mockResolvedValue(mockPageResult);
    vi.mocked(productService.getProductById).mockResolvedValue(mockProductDetail);
    vi.mocked(productService.createProduct).mockResolvedValue(mockProductDetail);
    vi.mocked(productService.updateProduct).mockResolvedValue(mockProductDetail);
    vi.mocked(productService.deleteProduct).mockResolvedValue();
  });

  it("renders page header and product row in table", async () => {
    renderWithProviders(<ProductsPage />);

    expect(screen.getByRole("heading", { name: "Quản Lý Sản Phẩm" })).toBeInTheDocument();
    expect(screen.getByText("Thêm sản phẩm")).toBeInTheDocument();

    await waitFor(() => {
      const table = screen.getByRole("table");
      expect(within(table).getByText("Váy Lụa Trắng Cổ Yếm")).toBeInTheDocument();
      expect(within(table).getByText("PRD-LUA-01")).toBeInTheDocument();
      expect(within(table).getByText("Váy Dạ Hội")).toHaveClass("whitespace-nowrap");
      expect(within(table).getByText("1 biến thể")).toHaveClass("whitespace-nowrap");
      expect(within(table).getByText("Đang hoạt động")).toHaveClass("whitespace-nowrap");
    });
  });

  it("opens add modal and creates new product successfully", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsPage />);

    await user.click(screen.getByText("Thêm sản phẩm"));

    // Modal opens
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Ví dụ: Váy Lụa Trắng Cổ Yếm")).toBeInTheDocument();
    });

    // Enter name
    await user.type(
      screen.getByPlaceholderText("Ví dụ: Váy Lụa Trắng Cổ Yếm"),
      "Váy Thiết Kế Đỏ"
    );

    // Type pricing directly (all-in-one view)
    await user.type(screen.getByPlaceholderText("350000"), "400000");
    await user.type(screen.getByPlaceholderText("500000"), "600000");

    // Upload image from machine
    const file = new File(["dummy content"], "dress.jpg", { type: "image/jpeg" });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      await user.upload(fileInput, file);
    }

    // Submit form
    await user.click(screen.getByText("Lưu thay đổi"));

    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalled();
    });
  });

  it("opens view modal when click on view action", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsPage />);

    await waitFor(
      () => {
        expect(screen.getByText("Váy Lụa Trắng Cổ Yếm")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const viewButtons = screen.getAllByLabelText("Xem chi tiết");
    await user.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Chi tiết sản phẩm")).toBeInTheDocument();
    });

    const variantsTab = screen.getByRole("tab", { name: /Biến thể/i });
    await user.click(variantsTab);

    await waitFor(() => {
      expect(screen.getByText("PRD-LUA-01-S-TRAN")).toBeInTheDocument();
    });
  });

  it("opens edit modal, updates product", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsPage />);

    await waitFor(
      () => {
        expect(screen.getByText("Váy Lụa Trắng Cổ Yếm")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const editButtons = screen.getAllByLabelText("Chỉnh sửa");
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Chỉnh sửa sản phẩm")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Lưu thay đổi"));

    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalled();
    });
  });

  it("opens confirm delete modal and deletes product", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsPage />);

    await waitFor(
      () => {
        expect(screen.getByText("Váy Lụa Trắng Cổ Yếm")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const deleteButtons = screen.getAllByLabelText("Xóa");
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Xác nhận xóa sản phẩm")).toBeInTheDocument();
    });

    // Query delete button specifically inside dialog
    const dialog = screen.getByRole("dialog");
    const modalDeleteBtn = within(dialog).getByRole("button", { name: "Xóa" });
    await user.click(modalDeleteBtn);

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(1);
    });
  });

  it("adapts form interface dynamically when switching category across business pillars", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsPage />);

    await user.click(screen.getByText("Thêm sản phẩm"));

    // 1. Initial pillar is COSTUME (Thuê trang phục)
    await waitFor(() => {
      expect(screen.getByText("LOOKBOOK TRANG PHỤC")).toBeInTheDocument();
      expect(screen.getByText(/Biến thể trang phục/i)).toBeInTheDocument();
      expect(screen.getByText("+ Thêm nhanh Size:")).toBeInTheDocument();
      expect(screen.getByText("Chất liệu vải")).toBeInTheDocument();
    });

    // 2. Select category 2: "Máy Ảnh Du Lịch" (CAMERA)
    const categorySelect = screen.getByLabelText(/Danh mục/i);
    await user.selectOptions(categorySelect, "2");

    await waitFor(() => {
      expect(screen.getByText("THIẾT BỊ MÁY ẢNH")).toBeInTheDocument();
      expect(screen.getByText(/Phiên bản thiết bị/i)).toBeInTheDocument();
      expect(screen.getByText("+ Thêm nhanh Bộ Kit:")).toBeInTheDocument();
      expect(screen.getByText("Phụ kiện kèm theo & Tình trạng máy")).toBeInTheDocument();
      expect(screen.getByText("Mục đích sử dụng & Tính năng nổi bật")).toBeInTheDocument();
      expect(screen.getByText("Giá thuê thiết bị / ngày")).toBeInTheDocument();
      expect(screen.getByText("Tiền cọc thiết bị / máy ảnh")).toBeInTheDocument();
    });

    // 3. Select category 3: "Gói Chụp Ngoại Cảnh" (PHOTOGRAPHY)
    await user.selectOptions(categorySelect, "3");

    await waitFor(() => {
      expect(screen.getByText("GÓI DỊCH VỤ CHỤP")).toBeInTheDocument();
      expect(screen.getByText(/Phân loại gói chụp/i)).toBeInTheDocument();
      expect(screen.getByText("+ Thêm nhanh Quy mô:")).toBeInTheDocument();
      expect(screen.getByText("Quyền lợi gói chụp (File ảnh & Hậu kỳ)")).toBeInTheDocument();
      expect(screen.getByText("Thời lượng chụp & Địa điểm / Makeup")).toBeInTheDocument();
      expect(screen.getByText("Giá trọn gói dịch vụ chụp")).toBeInTheDocument();
      expect(screen.getByText("Tiền cọc giữ lịch chụp")).toBeInTheDocument();
    });
  });
});
