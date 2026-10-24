import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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
      description: "Váy thiết kế chụp ảnh",
      iconUrl: "Sparkles",
      displayOrder: 1,
      isActive: true,
      createdAt: "2026-10-24T10:00:00",
      updatedAt: "2026-10-24T10:00:00",
    },
    {
      id: 2,
      name: "Áo Dài",
      slug: "ao-dai",
      description: "Áo dài truyền thống",
      iconUrl: "Flower2",
      displayOrder: 2,
      isActive: false,
      createdAt: "2026-10-24T10:00:00",
      updatedAt: "2026-10-24T10:00:00",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(categoryService.getAllCategories).mockResolvedValue(mockCategories);
  });

  it("renders page header, table, and categories list", async () => {
    render(<CategoriesPage />);

    expect(screen.getByRole("heading", { name: "Quản Lý Danh Mục" })).toBeInTheDocument();
    expect(screen.getByText("Thêm danh mục")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Váy Thiết Kế")).toBeInTheDocument();
      expect(screen.getByText("Áo Dài")).toBeInTheDocument();
    });

    expect(screen.getByText("/vay-thiet-ke")).toBeInTheDocument();
    expect(screen.getAllByText("Đang hoạt động").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Tạm ẩn").length).toBeGreaterThanOrEqual(1);
  });

  it("opens add modal and creates new category successfully with auto slug", async () => {
    const user = userEvent.setup();
    const newCategory: Category = {
      id: 3,
      name: "Đầm Dạ Hội",
      slug: "dam-da-hoi",
      displayOrder: 3,
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
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText("Ví dụ: Váy Thiết Kế");
    const slugInput = screen.getByPlaceholderText("vay-thiet-ke");

    await user.type(nameInput, "Đầm Dạ Hội");

    // Check slug auto-generation
    expect(slugInput).toHaveValue("dam-da-hoi");

    // Submit form
    await user.click(screen.getByRole("button", { name: "Lưu thay đổi" }));

    await waitFor(() => {
      expect(categoryService.createCategory).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Đầm Dạ Hội",
          slug: "dam-da-hoi",
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
