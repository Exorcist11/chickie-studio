import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryModal } from "./CategoryModal";
import { categoryService } from "../../../../services/category.service";
import { Category } from "../../../../types/category";
import "../../../../i18n";

vi.mock("../../../../services/category.service", () => ({
  categoryService: {
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
  },
}));

describe("CategoryModal Component", () => {
  const mockCategory: Category = {
    id: 10,
    name: "Máy Ảnh Mirrorless",
    slug: "may-anh-mirrorless",
    type: "CAMERA",
    description: "Các dòng Sony A7IV, Canon R6",
    iconUrl: "Camera",
    displayOrder: 2,
    isActive: true,
    createdAt: "2026-10-24T10:00:00",
    updatedAt: "2026-10-24T10:00:00",
  };

  const defaultProps = {
    open: true,
    category: null,
    displayOrderDefault: 5,
    onClose: vi.fn(),
    onSuccess: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when open is false", () => {
    render(<CategoryModal {...defaultProps} open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders Add Category modal with initial values and suggested icons", () => {
    render(<CategoryModal {...defaultProps} />);

    expect(screen.getByRole("heading", { name: "Thêm danh mục" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ví dụ: Váy Thiết Kế")).toHaveValue("");
    expect(screen.getByPlaceholderText("vay-thiet-ke")).toHaveValue("");

    // Quick icons exist
    expect(screen.getByLabelText("icon-Camera")).toBeInTheDocument();
    expect(screen.getByLabelText("icon-Shirt")).toBeInTheDocument();
  });

  it("selects icon when clicking an icon button in the grid", async () => {
    const user = userEvent.setup();
    render(<CategoryModal {...defaultProps} />);

    const cameraIconBtn = screen.getByLabelText("icon-Camera");
    await user.click(cameraIconBtn);

    const iconInput = screen.getByPlaceholderText("Sparkles, Flower2, Camera...");
    expect(iconInput).toHaveValue("Camera");
  });

  it("selects business pillar card when clicked", async () => {
    const user = userEvent.setup();
    render(<CategoryModal {...defaultProps} />);

    const cameraCard = screen.getByText("Thuê máy ảnh");
    await user.click(cameraCard);

    const radioCard = screen.getByRole("radio", { name: /Thuê máy ảnh/i });
    expect(radioCard).toHaveAttribute("aria-checked", "true");
  });

  it("submits create category successfully", async () => {
    const user = userEvent.setup();
    vi.mocked(categoryService.createCategory).mockResolvedValue(mockCategory);

    render(<CategoryModal {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText("Ví dụ: Váy Thiết Kế");
    await user.type(nameInput, "Váy Công Chúa");

    // Click Save
    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(categoryService.createCategory).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Váy Công Chúa",
          slug: "vay-cong-chua",
          type: "COSTUME",
          isActive: true,
        })
      );
      expect(defaultProps.onSuccess).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it("pre-fills form in Edit mode and updates category", async () => {
    const user = userEvent.setup();
    vi.mocked(categoryService.updateCategory).mockResolvedValue({
      ...mockCategory,
      name: "Máy Ảnh Cao Cấp",
    });

    render(<CategoryModal {...defaultProps} category={mockCategory} />);

    expect(screen.getByRole("heading", { name: "Chỉnh sửa danh mục" })).toBeInTheDocument();
    const nameInput = screen.getByPlaceholderText("Ví dụ: Váy Thiết Kế");
    expect(nameInput).toHaveValue("Máy Ảnh Mirrorless");

    await user.clear(nameInput);
    await user.type(nameInput, "Máy Ảnh Cao Cấp");

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(categoryService.updateCategory).toHaveBeenCalledWith(
        10,
        expect.objectContaining({
          name: "Máy Ảnh Cao Cấp",
          slug: "may-anh-mirrorless",
        })
      );
      expect(defaultProps.onSuccess).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it("displays server error message when create throws an exception", async () => {
    const user = userEvent.setup();
    vi.mocked(categoryService.createCategory).mockRejectedValue({
      response: {
        status: 400,
        data: { message: "Dữ liệu không hợp lệ" },
      },
    });

    render(<CategoryModal {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText("Ví dụ: Váy Thiết Kế");
    await user.type(nameInput, "Váy Lỗi");

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText("Dữ liệu không hợp lệ")).toBeInTheDocument();
    });
  });
});
