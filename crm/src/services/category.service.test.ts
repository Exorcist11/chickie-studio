import { describe, it, expect, vi, beforeEach } from "vitest";
import { categoryService } from "./category.service";
import { apiClient } from "./apiClient";
import { Category } from "../types/category";

describe("categoryService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockCategory: Category = {
    id: 1,
    name: "Váy Thiết Kế",
    slug: "vay-thiet-ke",
    type: "COSTUME",
    description: "Váy cao cấp chụp ảnh",
    iconUrl: "Sparkles",
    displayOrder: 1,
    isActive: true,
    createdAt: "2026-10-24T10:00:00",
    updatedAt: "2026-10-24T10:00:00",
  };

  it("getAllCategories_shouldCallApiAndReturnList", async () => {
    const mockResponse = {
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00",
      data: [mockCategory],
    };

    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue(mockResponse);

    const result = await categoryService.getAllCategories();

    expect(getSpy).toHaveBeenCalledWith("/api/admin/categories");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("vay-thiet-ke");
  });

  it("getCategoryById_shouldCallApiAndReturnCategory", async () => {
    const mockResponse = {
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00",
      data: mockCategory,
    };

    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue(mockResponse);

    const result = await categoryService.getCategoryById(1);

    expect(getSpy).toHaveBeenCalledWith("/api/admin/categories/1");
    expect(result.id).toBe(1);
  });

  it("createCategory_shouldCallPostAndReturnCreatedCategory", async () => {
    const mockResponse = {
      code: 201,
      message: "Tạo danh mục thành công",
      timestamp: "2026-10-24T10:00:00",
      data: mockCategory,
    };

    const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue(mockResponse);

    const input = {
      name: "Váy Thiết Kế",
      slug: "vay-thiet-ke",
      description: "Váy cao cấp chụp ảnh",
      iconUrl: "Sparkles",
      displayOrder: 1,
      isActive: true,
    };

    const result = await categoryService.createCategory(input);

    expect(postSpy).toHaveBeenCalledWith("/api/admin/categories", input);
    expect(result.slug).toBe("vay-thiet-ke");
  });

  it("updateCategory_shouldCallPutAndReturnUpdatedCategory", async () => {
    const mockResponse = {
      code: 200,
      message: "Cập nhật danh mục thành công",
      timestamp: "2026-10-24T10:00:00",
      data: { ...mockCategory, name: "Váy Thiết Kế Mới" },
    };

    const putSpy = vi.spyOn(apiClient, "put").mockResolvedValue(mockResponse);

    const input = {
      name: "Váy Thiết Kế Mới",
      slug: "vay-thiet-ke",
    };

    const result = await categoryService.updateCategory(1, input);

    expect(putSpy).toHaveBeenCalledWith("/api/admin/categories/1", input);
    expect(result.name).toBe("Váy Thiết Kế Mới");
  });

  it("deleteCategory_shouldCallDeleteApi", async () => {
    const mockResponse = {
      code: 200,
      message: "Xóa danh mục thành công",
      timestamp: "2026-10-24T10:00:00",
      data: null,
    };

    const deleteSpy = vi.spyOn(apiClient, "delete").mockResolvedValue(mockResponse);

    await categoryService.deleteCategory(1);

    expect(deleteSpy).toHaveBeenCalledWith("/api/admin/categories/1");
  });
});
