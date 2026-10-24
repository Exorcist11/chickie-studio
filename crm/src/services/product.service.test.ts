import { describe, it, expect, vi, beforeEach } from "vitest";
import { productService } from "./product.service";
import { apiClient } from "./apiClient";
import {
  CreateProductInput,
  PageResult,
  ProductDetailResponse,
  ProductListResponse,
  UpdateProductInput,
} from "../types/product";

vi.mock("./apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("productService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProductList: ProductListResponse = {
    id: 1,
    categoryId: 2,
    categoryName: "Váy Dạ Hội",
    productCode: "PRD-LUA-01",
    name: "Váy Lụa Trắng Cổ Yếm",
    slug: "vay-lua-trang-co-yem",
    rentalPrice: 350000,
    depositPrice: 500000,
    status: "ACTIVE",
    variantCount: 2,
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
    categoryId: 2,
    categoryName: "Váy Dạ Hội",
    productCode: "PRD-LUA-01",
    name: "Váy Lụa Trắng Cổ Yếm",
    slug: "vay-lua-trang-co-yem",
    rentalPrice: 350000,
    depositPrice: 500000,
    status: "ACTIVE",
    variants: [{ id: 10, size: "S", color: "Trắng", sku: "PRD-LUA-01-S-TRAN" }],
    images: [{ id: 100, imageUrl: "https://example.com/1.jpg", isThumbnail: true }],
    createdAt: "2026-10-24T10:00:00Z",
    updatedAt: "2026-10-24T10:00:00Z",
  };

  it("getProducts returns paged list from api", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockPageResult,
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00Z",
    });

    const result = await productService.getProducts({ search: "Váy" });
    expect(apiClient.get).toHaveBeenCalledWith("/api/admin/products?search=V%C3%A1y");
    expect(result).toEqual(mockPageResult);
  });

  it("getProductById returns product details", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockProductDetail,
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00Z",
    });

    const result = await productService.getProductById(1);
    expect(apiClient.get).toHaveBeenCalledWith("/api/admin/products/1");
    expect(result).toEqual(mockProductDetail);
  });

  it("createProduct calls POST and returns created product", async () => {
    const input: CreateProductInput = {
      categoryId: 2,
      name: "Váy Lụa Trắng",
      rentalPrice: 350000,
      depositPrice: 500000,
      variants: [{ size: "S", color: "Trắng" }],
      images: [{ imageUrl: "https://example.com/1.jpg" }],
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: mockProductDetail,
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00Z",
    });

    const result = await productService.createProduct(input);
    expect(apiClient.post).toHaveBeenCalledWith("/api/admin/products", input);
    expect(result).toEqual(mockProductDetail);
  });

  it("updateProduct calls PUT and returns updated product", async () => {
    const input: UpdateProductInput = {
      categoryId: 2,
      name: "Váy Lụa Trắng Cập Nhật",
      rentalPrice: 400000,
      depositPrice: 600000,
      status: "ACTIVE",
      variants: [{ size: "M", color: "Trắng" }],
      images: [{ imageUrl: "https://example.com/2.jpg" }],
    };

    vi.mocked(apiClient.put).mockResolvedValueOnce({
      data: mockProductDetail,
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00Z",
    });

    const result = await productService.updateProduct(1, input);
    expect(apiClient.put).toHaveBeenCalledWith("/api/admin/products/1", input);
    expect(result).toEqual(mockProductDetail);
  });

  it("deleteProduct calls DELETE endpoint", async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce({
      data: undefined,
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00Z",
    });

    await productService.deleteProduct(1);
    expect(apiClient.delete).toHaveBeenCalledWith("/api/admin/products/1");
  });
});
