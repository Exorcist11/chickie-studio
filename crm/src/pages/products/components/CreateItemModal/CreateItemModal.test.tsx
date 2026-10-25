import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "../../../../i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateItemModal } from "./CreateItemModal";
import { ProductDetailResponse } from "../../../../types/product";
import { productItemService } from "../../../../services/productItem.service";

vi.mock("../../../../services/productItem.service", () => ({
  productItemService: {
    suggestItemCode: vi.fn(),
    createItem: vi.fn(),
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
  ],
  images: [],
  createdAt: "2026-10-25T00:00:00Z",
  updatedAt: "2026-10-25T00:00:00Z",
};

describe("CreateItemModal", () => {
  let queryClient: QueryClient;
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <CreateItemModal open={true} onClose={onCloseMock} product={sampleProduct} />
      </QueryClientProvider>
    );

  it("renders modal title, fields, and auto-suggests barcode when clicking suggest", async () => {
    vi.mocked(productItemService.suggestItemCode).mockResolvedValueOnce("CK-DR-001-S-RED-02");

    renderComponent();

    expect(screen.getByText("Thêm món đồ vật lý vào kho")).toBeInTheDocument();

    const suggestBtn = screen.getByRole("button", { name: /Gợi ý/i });
    fireEvent.click(suggestBtn);

    await waitFor(() => {
      expect(productItemService.suggestItemCode).toHaveBeenCalledWith(10);
      expect(screen.getByDisplayValue("CK-DR-001-S-RED-02")).toBeInTheDocument();
    });
  });

  it("submits form and calls createItem with correct inputs", async () => {
    vi.mocked(productItemService.createItem).mockResolvedValueOnce({
      id: 5,
      variantId: 10,
      variantSize: "S",
      variantColor: "Đỏ",
      variantSku: "CK-DR-001-S-RED",
      productId: 100,
      productName: "Váy Dạ Hội Ruby",
      productCode: "CK-DR-001",
      itemCode: "CK-DR-001-S-RED-02",
      status: "AVAILABLE",
      rentalCount: 0,
      note: "Hàng mới may xong",
      createdAt: "2026-10-25T00:00:00Z",
      updatedAt: "2026-10-25T00:00:00Z",
    });

    const { container } = renderComponent();

    const noteInput = container.querySelector("textarea")!;
    fireEvent.change(noteInput, { target: { value: "Hàng mới may xong" } });

    const submitBtn = screen.getByRole("button", { name: /Thêm đồ vào kho/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(productItemService.createItem).toHaveBeenCalledWith(10, {
        itemCode: undefined,
        note: "Hàng mới may xong",
        status: "AVAILABLE",
      });
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
