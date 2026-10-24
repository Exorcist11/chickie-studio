import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "./FilterBar";
import "../../../i18n";

describe("FilterBar component (CRM)", () => {
  it("renders search input, select and triggers onFilterChange", async () => {
    const user = userEvent.setup();
    const handleFilter = vi.fn();

    render(
      <FilterBar
        searchPlaceholder="Tìm theo tên/mã đơn"
        selectOptions={[
          { label: "Chờ xác nhận", value: "PENDING" },
          { label: "Đã cọc", value: "DEPOSITED" },
        ]}
        onFilterChange={handleFilter}
        extraActions={<button>Xuất file</button>}
      />
    );

    expect(screen.getByText("Xuất file")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Tìm theo tên/mã đơn");
    await user.type(searchInput, "BK001");

    expect(handleFilter).toHaveBeenCalledWith(
      expect.objectContaining({ search: "BK001" })
    );

    const select = screen.getByRole("combobox", { name: "Trạng thái" });
    fireEvent.change(select, { target: { value: "PENDING" } });
    expect(handleFilter).toHaveBeenCalledWith(
      expect.objectContaining({ selectValue: "PENDING" })
    );

    // Test date range
    const startInput = screen.getByLabelText("Từ ngày");
    fireEvent.change(startInput, { target: { value: "2026-10-01" } });
    expect(handleFilter).toHaveBeenCalledWith(
      expect.objectContaining({ startDate: "2026-10-01" })
    );

    const endInput = screen.getByLabelText("Đến ngày");
    fireEvent.change(endInput, { target: { value: "2026-10-15" } });
    expect(handleFilter).toHaveBeenCalledWith(
      expect.objectContaining({ endDate: "2026-10-15" })
    );
  });

  it("handles reset button", async () => {
    const user = userEvent.setup();
    const handleFilter = vi.fn();
    const handleReset = vi.fn();

    render(<FilterBar onFilterChange={handleFilter} onReset={handleReset} />);

    const resetBtn = screen.getByRole("button", { name: /đặt lại/i });
    await user.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
    expect(handleFilter).toHaveBeenCalledWith({});
  });
});

