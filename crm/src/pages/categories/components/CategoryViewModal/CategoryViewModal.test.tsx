import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryViewModal } from "./CategoryViewModal";
import { Category } from "../../../../types/category";
import "../../../../i18n";

describe("CategoryViewModal Component", () => {
  const mockCategory: Category = {
    id: 1,
    name: "Áo Dài Cách Tân VIP",
    slug: "ao-dai-cach-tan-vip",
    type: "COSTUME",
    description: "Bộ sưu tập áo dài lụa tơ tằm thêu tay cao cấp",
    iconUrl: "Sparkles",
    displayOrder: 1,
    isActive: true,
    createdAt: "2026-10-24T14:30:00",
    updatedAt: "2026-10-24T14:30:00",
  };

  const defaultProps = {
    open: true,
    category: mockCategory,
    onClose: vi.fn(),
    onEdit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        configurable: true,
      });
    }
  });

  it("does not render when open is false or category is null", () => {
    const { rerender } = render(<CategoryViewModal {...defaultProps} open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<CategoryViewModal {...defaultProps} category={null} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders category hero identity, pillar badge, and details properly", () => {
    render(<CategoryViewModal {...defaultProps} />);

    expect(screen.getByRole("heading", { name: "Chi tiết danh mục" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Áo Dài Cách Tân VIP" })).toBeInTheDocument();

    // Check badges
    expect(screen.getAllByText("Thuê trang phục").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Đang hoạt động")).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();

    // Check slug and description
    expect(screen.getByText("/ao-dai-cach-tan-vip")).toBeInTheDocument();
    expect(screen.getByText("Bộ sưu tập áo dài lụa tơ tằm thêu tay cao cấp")).toBeInTheDocument();
  });

  it("handles copy slug action with visual feedback", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);

    render(<CategoryViewModal {...defaultProps} />);

    const slugBtn = screen.getByTitle("Sao chép slug");
    await user.click(slugBtn);

    expect(writeTextSpy).toHaveBeenCalledWith("ao-dai-cach-tan-vip");
    await waitFor(() => {
      expect(screen.getByText("Đã sao chép slug!")).toBeInTheDocument();
    });
  });

  it("triggers onEdit and onClose when clicking edit button", async () => {
    const user = userEvent.setup();
    render(<CategoryViewModal {...defaultProps} />);

    const editBtn = screen.getByRole("button", { name: /Chỉnh sửa danh mục/i });
    await user.click(editBtn);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockCategory);
  });

  it("renders camera pillar specifics and fallback for missing description", () => {
    const cameraCategory: Category = {
      ...mockCategory,
      type: "CAMERA",
      description: "",
      iconUrl: "Camera",
      isActive: false,
    };

    render(<CategoryViewModal {...defaultProps} category={cameraCategory} />);

    expect(screen.getAllByText("Thuê máy ảnh").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Tạm ẩn")).toBeInTheDocument();
    expect(screen.getByText("Chưa có mô tả chi tiết cho danh mục này.")).toBeInTheDocument();
  });
});
