import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "../../../../i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductItemsTab } from "./ProductItemsTab";
import { ProductDetailResponse } from "../../../../types/product";
import { productItemService } from "../../../../services/productItem.service";
import { ProductItem } from "../../../../types/productItem";

vi.mock("../../../../services/productItem.service", () => ({
  productItemService: {
    getItemsByProduct: vi.fn(),
    getItemsByVariant: vi.fn(),
    getItemById: vi.fn(),
    suggestItemCode: vi.fn(),
    createItem: vi.fn(),
    updateItemStatus: vi.fn(),
    deleteItem: vi.fn(),
  },
}));

const sampleProduct: ProductDetailResponse = {
  id: 100,
  categoryId: 1,
  categoryName: "Váy Thiết Kế",
  productCode: "CK-DR-001",
  name: "Váy Dạ Hội Ruby",
  slug: "vay-da-hoi-ruby",
  rentalPrice: 500000,
  depositPrice: 1000000,
  status: "ACTIVE",
  variants: [
    { id: 10, size: "S", color: "Đỏ", sku: "CK-DR-001-S-RED" },
    { id: 11, size: "M", color: "Đỏ", sku: "CK-DR-001-M-RED" },
  ],
  images: [],
  createdAt: "2026-10-25T00:00:00Z",
  updatedAt: "2026-10-25T00:00:00Z",
};

const mockItems: ProductItem[] = [
  {
    id: 1,
    variantId: 10,
    variantSize: "S",
    variantColor: "Đỏ",
    variantSku: "CK-DR-001-S-RED",
    productId: 100,
    productName: "Váy Dạ Hội Ruby",
    productCode: "CK-DR-001",
    itemCode: "CK-DR-001-S-RED-01",
    status: "AVAILABLE",
    rentalCount: 4,
    note: "Sẵn sàng cho thuê",
    createdAt: "2026-10-25T00:00:00Z",
    updatedAt: "2026-10-25T00:00:00Z",
  },
  {
    id: 2,
    variantId: 10,
    variantSize: "S",
    variantColor: "Đỏ",
    variantSku: "CK-DR-001-S-RED",
    productId: 100,
    productName: "Váy Dạ Hội Ruby",
    productCode: "CK-DR-001",
    itemCode: "CK-DR-001-S-RED-02",
    status: "RENTED",
    rentalCount: 16,
    note: "Khách đang mặc đi tiệc",
    createdAt: "2026-10-25T00:00:00Z",
    updatedAt: "2026-10-25T00:00:00Z",
  },
];

describe("ProductItemsTab", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ProductItemsTab product={sampleProduct} />
      </QueryClientProvider>
    );

  it("renders statistics cards and table with item rows", async () => {
    vi.mocked(productItemService.getItemsByProduct).mockResolvedValueOnce(mockItems);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("CK-DR-001-S-RED-01")).toBeInTheDocument();
      expect(screen.getByText("CK-DR-001-S-RED-02")).toBeInTheDocument();
    });

    // Check stats (multi-matches due to stat card and table badge)
    expect(screen.getByText(/Tổng đồ/i)).toBeInTheDocument();
    expect(screen.getAllByText("Sẵn sàng").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Đang thuê").length).toBeGreaterThanOrEqual(1);
    // Item 2 has rentalCount = 16 >= 15, should render warning tag
    expect(screen.getAllByText("Bảo dưỡng").length).toBeGreaterThanOrEqual(1);
  });

  it("allows searching items by barcode", async () => {
    vi.mocked(productItemService.getItemsByProduct).mockResolvedValueOnce(mockItems);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("CK-DR-001-S-RED-01")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Tìm kiếm...");
    fireEvent.change(searchInput, { target: { value: "RED-02" } });

    expect(screen.queryByText("CK-DR-001-S-RED-01")).not.toBeInTheDocument();
    expect(screen.getByText("CK-DR-001-S-RED-02")).toBeInTheDocument();
  });

  it("opens create modal when clicking add button", async () => {
    vi.mocked(productItemService.getItemsByProduct).mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Chưa có món đồ vật lý nào trong kho cho sản phẩm này.")).toBeInTheDocument();
    });

    const addBtns = screen.getAllByRole("button", { name: /Thêm đồ/i });
    fireEvent.click(addBtns[0]);

    await waitFor(() => {
      expect(screen.getByText("Thêm món đồ vật lý vào kho")).toBeInTheDocument();
    });
  });

  it("opens change status modal when clicking status button", async () => {
    vi.mocked(productItemService.getItemsByProduct).mockResolvedValueOnce(mockItems);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("CK-DR-001-S-RED-01")).toBeInTheDocument();
    });

    const statusBtns = screen.getAllByRole("button", { name: /Chuyển trạng thái/i });
    fireEvent.click(statusBtns[0]);

    await waitFor(() => {
      expect(screen.getByText("Cập nhật trạng thái vòng đời")).toBeInTheDocument();
    });
  });

  it("copies barcode to clipboard when clicking copy icon", async () => {
    vi.mocked(productItemService.getItemsByProduct).mockResolvedValueOnce(mockItems);
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextSpy },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("CK-DR-001-S-RED-01")).toBeInTheDocument();
    });

    const copyBtn = screen.getByRole("button", { name: /Copy barcode CK-DR-001-S-RED-01/i });
    fireEvent.click(copyBtn);

    expect(writeTextSpy).toHaveBeenCalledWith("CK-DR-001-S-RED-01");
  });
});
