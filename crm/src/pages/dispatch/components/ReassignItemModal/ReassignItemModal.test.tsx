import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReassignItemModal } from "./ReassignItemModal";
import { dispatchService } from "../../../../services/dispatch.service";
import "../../../../i18n";

vi.mock("../../../../services/dispatch.service", () => ({
  dispatchService: {
    getAvailableReplacements: vi.fn(),
    reassignItem: vi.fn(),
  },
}));

describe("ReassignItemModal Component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ReassignItemModal
          isOpen={true}
          onClose={vi.fn()}
          bookingItemId={101}
          bookingCode="BOK-001"
          currentBarcode="AO-DAI-01"
          productName="Áo dài cưới"
          variantInfo="Size M / Đỏ"
          {...props}
        />
      </QueryClientProvider>
    );
  };

  it("renders modal details and current item info", async () => {
    vi.mocked(dispatchService.getAvailableReplacements).mockResolvedValue([
      {
        itemId: 102,
        barcode: "AO-DAI-02",
        productName: "Áo dài cưới",
        variantInfo: "Size M / Đỏ",
        itemStatus: "AVAILABLE",
        rentalCount: 3,
        isCurrent: false,
        isAvailable: true,
      },
    ]);

    renderComponent();

    expect(screen.getByText("Điều phối đổi món đồ")).toBeInTheDocument();
    expect(screen.getByText("AO-DAI-01")).toBeInTheDocument();
    expect(screen.getByText("Áo dài cưới")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/AO-DAI-02/)).toBeInTheDocument();
    });
  });

  it("submits reassign item successfully", async () => {
    const handleClose = vi.fn();
    vi.mocked(dispatchService.getAvailableReplacements).mockResolvedValue([
      {
        itemId: 102,
        barcode: "AO-DAI-02",
        productName: "Áo dài cưới",
        variantInfo: "Size M / Đỏ",
        itemStatus: "AVAILABLE",
        rentalCount: 3,
        isCurrent: false,
        isAvailable: true,
      },
    ]);

    vi.mocked(dispatchService.reassignItem).mockResolvedValue({
      bookingItemId: 101,
      bookingCode: "BOK-001",
      oldBarcode: "AO-DAI-01",
      newBarcode: "AO-DAI-02",
      changedBy: "staff1",
      updatedAt: "2026-10-27T10:00:00",
      message: "Điều phối thành công",
    });

    renderComponent({ onClose: handleClose });

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    // Select replacement item
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "102" } });

    // Enter reason
    const reasonInput = screen.getByRole("textbox");
    fireEvent.change(reasonInput, { target: { value: "Khách đổi sang áo cùng size" } });

    // Submit
    const submitBtn = screen.getByText("Xác nhận");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(dispatchService.reassignItem).toHaveBeenCalledWith({
        bookingItemId: 101,
        newItemId: 102,
        reason: "Khách đổi sang áo cùng size",
      });
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
