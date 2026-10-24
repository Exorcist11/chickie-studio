import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoriesPage } from "./CategoriesPage";
import { categoryService } from "../../services/category.service";
import { Category } from "../../types/category";
import "../../i18n";

vi.mock("../../services/category.service", () => ({
  categoryService: {
    getAllCategories: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  },
}));

describe("CategoriesPage", () => {
  const mockCategories: Category[] = [
    {
      id: 1,
      name: "Váy Thiết Kế",
      slug: "vay-thiet-ke",
      type: "COSTUME",
      description: "Váy thiết kế chụp ảnh",
      iconUrl: "Sparkles",
      displayOrder: 1,
      isActive: true,
      createdAt: "2026-10-24T10:00:00",
      updatedAt: "2026-10-24T10:00:00",
    },
    {
      id: 2,
      name: "Máy Ảnh Du Lịch",
      slug: "may-anh-du-lich",
      type: "CAMERA",
      description: "Máy ảnh Sony, Canon",
      iconUrl: "Camera",
      displayOrder: 2,
      isActive: true,
      createdAt: "2026-10-24T10:00:00",
      updatedAt: "2026-10-24T10:00:00",
    },
    {
      id: 3,
      name: "Gói Chụp Ngoại Cảnh",
      slug: "chup-anh-ngoai-canh",
      type: "PHOTOGRAPHY",
      description: "Chụp ảnh kỷ yếu, ngoại cảnh",
      iconUrl: "Sparkles",
      displayOrder: 3,
      isActive: false,
      createdAt: "2026-10-24T10:00:00",
      updatedAt: "2026-10-24T10:00:00",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(categoryService.getAllCategories).mockResolvedValue(mockCategories);
  });

  it("renders page header, table, pillar tabs, and categories list", async () => {
    render(<CategoriesPage />);

    expect(screen.getByRole("heading", { name: "Quản Lý Danh Mục" })).toBeInTheDocument();
    expect(screen.getByText("Thêm danh mục")).toBeInTheDocument();

    // Check 3 business pillar tabs
    expect(screen.getByRole("tab", { name: /Tất cả mảng/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Thuê trang phục/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Thuê máy ảnh/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Dịch vụ chụp ảnh/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Váy Thiết Kế")).toBeInTheDocument();
      expect(screen.getByText("Máy Ảnh Du Lịch")).toBeInTheDocument();
      expect(screen.getByText("Gói Chụp Ngoại Cảnh")).toBeInTheDocument();
    });

    expect(screen.getByText("/vay-thiet-ke")).toBeInTheDocument();
    expect(screen.getByText("/may-anh-du-lich")).toBeInTheDocument();
  });

  it("filters categories when switching pillar tabs", async () => {
    const user = userEvent.setup();
    render(<CategoriesPage />);

    await waitFor(() => {
      expect(screen.getByText("Váy Thiết Kế")).toBeInTheDocument();
      expect(screen.getByText("Máy Ảnh Du Lịch")).toBeInTheDocument();
    });

    // Switch to 'Thuê máy ảnh' tab
    const cameraTab = screen.getByRole("tab", { name: /Thuê máy ảnh/i });
    await user.click(cameraTab);

    // Only camera categories remain visible
    expect(screen.getByText("Máy Ảnh Du Lịch")).toBeInTheDocument();
    expect(screen.queryByText("Váy Thiết Kế")).not.toBeInTheDocument();
    expect(screen.queryByText("Gói Chụp Ngoại Cảnh")).not.toBeInTheDocument();
  });

  it("opens add modal and creates new category with selected business pillar", async () => {
    const user = userEvent.setup();
    const newCategory: Category = {
      id: 4,
      name: "Sony Alpha Series",
      slug: "sony-alpha-series",
      type: "CAMERA",
      displayOrder: 4,
      isActive: true,
      createdAt: "2026-10-24T10:00:00",
      updatedAt: "2026-10-24T10:00:00",
    };
    vi.mocked(categoryService.createCategory).mockResolvedValue(newCategory);

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(screen.getByText("Váy Thiết Kế")).toBeInTheDocument();
    });

    // Click add button
    await user.click(screen.getByRole("button", { name: /Thêm danh mục/i }));

    // Modal opens
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Select pillar type
    const typeSelect = within(dialog).getByLabelText(/Mảng kinh doanh/i);
    await user.selectOptions(typeSelect, "CAMERA");

    const nameInput = screen.getByPlaceholderText("Ví dụ: Váy Thiết Kế");
    const slugInput = screen.getByPlaceholderText("vay-thiet-ke");

    await user.type(nameInput, "Sony Alpha Series");

    // Check slug auto-generation
    expect(slugInput).toHaveValue("sony-alpha-series");

    // Submit form
    await user.click(screen.getByRole("button", { name: "Lưu thay đổi" }));

    await waitFor(() => {
      expect(categoryService.createCategory).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "CAMERA",
          name: "Sony Alpha Series",
          slug: "sony-alpha-series",
          isActive: true,
        })
      );
    });
  });

  it("displays conflict error when slug already exists", async () => {
    const user = userEvent.setup();
    const errorResponse = {
      response: {
        status: 409,
        data: { message: "Đường dẫn URL (slug) đã tồn tại" },
      },
    };
    vi.mocked(categoryService.createCategory).mockRejectedValue(errorResponse);

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(screen.getByText("Váy Thiết Kế")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Thêm danh mục/i }));

    const nameInput = screen.getByPlaceholderText("Ví dụ: Váy Thiết Kế");
    await user.type(nameInput, "Váy Thiết Kế");

    await user.click(screen.getByRole("button", { name: "Lưu thay đổi" }));

    await waitFor(() => {
      expect(screen.getByText("Tên danh mục hoặc đường dẫn URL đã tồn tại")).toBeInTheDocument();
    });
  });

  it("opens edit modal, modifies category and saves", async () => {
    const user = userEvent.setup();
    vi.mocked(categoryService.updateCategory).mockResolvedValue({
      ...mockCategories[0],
      name: "Váy Thiết Kế VIP",
    });

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(screen.getByText("Váy Thiết Kế")).toBeInTheDocument();
    });

    // Click edit on first item
    await user.click(screen.getByLabelText("edit-vay-thiet-ke"));

    expect(screen.getByText("Chỉnh sửa danh mục")).toBeInTheDocument();
    const nameInput = screen.getByPlaceholderText("Ví dụ: Váy Thiết Kế");
    expect(nameInput).toHaveValue("Váy Thiết Kế");

    await user.clear(nameInput);
    await user.type(nameInput, "Váy Thiết Kế VIP");

    await user.click(screen.getByRole("button", { name: "Lưu thay đổi" }));

    await waitFor(() => {
      expect(categoryService.updateCategory).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          name: "Váy Thiết Kế VIP",
          slug: "vay-thiet-ke",
        })
      );
    });
  });

  it("opens delete confirm modal and deletes category on confirm", async () => {
    const user = userEvent.setup();
    vi.mocked(categoryService.deleteCategory).mockResolvedValue();

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(screen.getByText("Váy Thiết Kế")).toBeInTheDocument();
    });

    // Click delete on first item
    await user.click(screen.getByLabelText("delete-vay-thiet-ke"));

    expect(screen.getByText("Xác nhận xóa danh mục")).toBeInTheDocument();

    // Confirm deletion
    await user.click(screen.getByRole("button", { name: "Xác nhận" }));

    await waitFor(() => {
      expect(categoryService.deleteCategory).toHaveBeenCalledWith(1);
    });
  });

  it("opens view detail modal when clicking view button", async () => {
    const user = userEvent.setup();

    render(<CategoriesPage />);

    await waitFor(() => {
      expect(screen.getByText("Váy Thiết Kế")).toBeInTheDocument();
    });

    // Click view on first item
    await user.click(screen.getByLabelText("view-vay-thiet-ke"));

    expect(screen.getByRole("heading", { name: "Chi tiết danh mục" })).toBeInTheDocument();
    expect(screen.getAllByText("Váy thiết kế chụp ảnh").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("#1")).toBeInTheDocument();

    // Close modal
    await user.click(screen.getByLabelText("close-view-modal"));
    expect(screen.queryByRole("heading", { name: "Chi tiết danh mục" })).not.toBeInTheDocument();
  });
});
