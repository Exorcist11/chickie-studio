import { describe, it, expect, vi, beforeEach } from "vitest";
import { productItemService } from "./productItem.service";
import { apiClient } from "./apiClient";
import { ProductItem } from "../types/productItem";

vi.mock("./apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockEnvelope = <T>(data: T) => ({
  code: 200,
  message: "OK",
  data,
  timestamp: "2026-10-25T00:00:00Z",
});

describe("productItemService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItem: ProductItem = {
    id: 1,
    variantId: 10,
    variantSize: "S",
    variantColor: "Đỏ",
    variantSku: "CK-DR-001-S-RED",
    productId: 100,
    productName: "Váy Dạ Hội",
    productCode: "CK-DR-001",
    itemCode: "CK-DR-001-S-RED-01",
    status: "AVAILABLE",
    rentalCount: 2,
    note: "Sẵn sàng",
    createdAt: "2026-10-25T00:00:00Z",
    updatedAt: "2026-10-25T00:00:00Z",
  };

  it("getItemsByProduct sends GET request and returns items list", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockEnvelope([mockItem]));

    const result = await productItemService.getItemsByProduct(100);

    expect(apiClient.get).toHaveBeenCalledWith("/api/admin/products/100/items");
    expect(result).toEqual([mockItem]);
  });

  it("getItemsByVariant sends GET request and returns items list", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockEnvelope([mockItem]));

    const result = await productItemService.getItemsByVariant(10);

    expect(apiClient.get).toHaveBeenCalledWith("/api/admin/product-variants/10/items");
    expect(result).toEqual([mockItem]);
  });

  it("getItemById sends GET request and returns single item", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockEnvelope(mockItem));

    const result = await productItemService.getItemById(1);

    expect(apiClient.get).toHaveBeenCalledWith("/api/admin/product-items/1");
    expect(result).toEqual(mockItem);
  });

  it("suggestItemCode sends GET request and returns suggested barcode string", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(mockEnvelope({ suggestedCode: "CK-DR-001-S-RED-02" }));

    const result = await productItemService.suggestItemCode(10);

    expect(apiClient.get).toHaveBeenCalledWith("/api/admin/product-variants/10/suggest-code");
    expect(result).toBe("CK-DR-001-S-RED-02");
  });

  it("createItem sends POST request with data and returns created item", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce(mockEnvelope(mockItem));

    const result = await productItemService.createItem(10, {
      itemCode: "CK-DR-001-S-RED-01",
      status: "AVAILABLE",
      note: "Hàng mới",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/api/admin/product-variants/10/items", {
      itemCode: "CK-DR-001-S-RED-01",
      status: "AVAILABLE",
      note: "Hàng mới",
    });
    expect(result).toEqual(mockItem);
  });

  it("updateItemStatus sends PATCH request with new status and returns updated item", async () => {
    const updated = { ...mockItem, status: "RENTED" as const };
    vi.mocked(apiClient.patch).mockResolvedValueOnce(mockEnvelope(updated));

    const result = await productItemService.updateItemStatus(1, {
      status: "RENTED",
      note: "Khách nhận đồ",
    });

    expect(apiClient.patch).toHaveBeenCalledWith("/api/admin/product-items/1/status", {
      status: "RENTED",
      note: "Khách nhận đồ",
    });
    expect(result.status).toBe("RENTED");
  });

  it("deleteItem sends DELETE request to product-items endpoint", async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce(mockEnvelope(undefined as unknown as void));

    await productItemService.deleteItem(1);

    expect(apiClient.delete).toHaveBeenCalledWith("/api/admin/product-items/1");
  });
});
