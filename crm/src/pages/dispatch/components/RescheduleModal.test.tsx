import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RescheduleModal } from "./RescheduleModal";
import { dispatchService } from "../../../services/dispatch.service";
import "../../../i18n";

vi.mock("../../../services/dispatch.service", () => ({
  dispatchService: {
    rescheduleBooking: vi.fn(),
  },
}));

describe("RescheduleModal Component", () => {
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
        <RescheduleModal
          isOpen={true}
          onClose={vi.fn()}
          bookingId={10}
          bookingCode="BOK-010"
          customerName="Lê Văn D"
          currentStartDate="2026-10-15"
          currentEndDate="2026-10-17"
          {...props}
        />
      </QueryClientProvider>
    );
  };

  it("renders modal details and initial schedule", () => {
    renderComponent();

    expect(screen.getByText("Dời ngày thuê")).toBeInTheDocument();
    expect(screen.getByText("BOK-010")).toBeInTheDocument();
    expect(screen.getByText("Lê Văn D")).toBeInTheDocument();
    expect(screen.getByText("2026-10-15 → 2026-10-17")).toBeInTheDocument();
  });

  it("submits reschedule booking successfully", async () => {
    const handleClose = vi.fn();
    vi.mocked(dispatchService.rescheduleBooking).mockResolvedValue({
      bookingId: 10,
      bookingCode: "BOK-010",
      newStartDate: "2026-10-20",
      newEndDate: "2026-10-22",
      durationDays: 3,
      totalRentalPrice: 600000,
      changedBy: "staff1",
      updatedAt: "2026-10-27T10:00:00",
      message: "Dời lịch thành công",
    });

    renderComponent({ onClose: handleClose });

    // Change start date
    const startInput = screen.getByLabelText(/Ngày nhận đồ mới/);
    fireEvent.change(startInput, { target: { value: "2026-10-20" } });

    // Change end date
    const endInput = screen.getByLabelText(/Ngày trả đồ mới/);
    fireEvent.change(endInput, { target: { value: "2026-10-22" } });

    // Change reason
    const reasonInput = screen.getByLabelText(/Lý do/);
    fireEvent.change(reasonInput, { target: { value: "Khách bận việc gia đình xin dời 5 ngày" } });

    // Click confirm
    const confirmBtn = screen.getByText("Xác nhận");
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(dispatchService.rescheduleBooking).toHaveBeenCalledWith({
        bookingId: 10,
        newStartDate: "2026-10-20",
        newEndDate: "2026-10-22",
        reason: "Khách bận việc gia đình xin dời 5 ngày",
      });
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
