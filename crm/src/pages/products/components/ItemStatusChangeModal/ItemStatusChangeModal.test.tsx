import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "../../../../i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemStatusChangeModal } from "./ItemStatusChangeModal";
import { ProductItem } from "../../../../types/productItem";
import { productItemService } from "../../../../services/productItem.service";

vi.mock("../../../../services/productItem.service", () => ({
  productItemService: {
    updateItemStatus: vi.fn(),
  },
}));

const mockRentedItem: ProductItem = {
  id: 1,
  variantId: 10,
  variantSize: "S",
  variantColor: "Đỏ",
  variantSku: "CK-DR-001-S-RED",
  productId: 100,
  productName: "Váy Dạ Hội Ruby",
  productCode: "CK-DR-001",
  itemCode: "CK-DR-001-S-RED-01",
  status: "RENTED",
  rentalCount: 5,
  note: "Khách đang thuê",
  createdAt: "2026-10-25T00:00:00Z",
  updatedAt: "2026-10-25T00:00:00Z",
};

describe("ItemStatusChangeModal", () => {
  let queryClient: QueryClient;
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const renderComponent = (item: ProductItem | null = mockRentedItem) =>
    render(
      <QueryClientProvider client={queryClient}>
        <ItemStatusChangeModal
          open={true}
          onClose={onCloseMock}
          item={item}
          productId={100}
        />
      </QueryClientProvider>
    );

  it("renders item info and auto displays rental_count increment notice when transitioning RENTED -> LAUNDRY", () => {
    renderComponent();

    expect(screen.getByText("Cập nhật trạng thái vòng đời")).toBeInTheDocument();
    expect(screen.getByText("CK-DR-001-S-RED-01")).toBeInTheDocument();
    expect(screen.getByText(/Món đồ hoàn tất 1 lượt thuê: Hệ thống sẽ tự động tăng số lần thuê/i)).toBeInTheDocument();
  });

  it("submits status transition and closes modal", async () => {
    vi.mocked(productItemService.updateItemStatus).mockResolvedValueOnce({
      ...mockRentedItem,
      status: "LAUNDRY",
      rentalCount: 6,
    });

    const { container } = renderComponent();

    const noteInput = container.querySelector("textarea")!;
    fireEvent.change(noteInput, { target: { value: "Khách trả đồ thơm tho" } });

    const confirmBtn = screen.getByRole("button", { name: "Xác nhận" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(productItemService.updateItemStatus).toHaveBeenCalledWith(1, {
        status: "LAUNDRY",
        note: "Khách trả đồ thơm tho",
      });
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
