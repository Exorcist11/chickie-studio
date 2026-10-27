import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "./DataTable";

describe("DataTable component (CRM)", () => {
  const dummyColumns = [
    { title: "Mã đơn", dataIndex: "code", key: "code" },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
  ];

  const dummyData = [
    { id: "1", code: "BK001", customer: "Mai Anh" },
    { id: "2", code: "BK002", customer: "Hoàng Yến" },
  ];

  it("renders table with columns, data and handles row selection", () => {
    const handleSelect = vi.fn();
    render(
      <DataTable
        columns={dummyColumns}
        dataSource={dummyData}
        rowKey="id"
        onSelectionChange={handleSelect}
        pagination={{ total: 2, current: 1, pageSize: 10 }}
      />
    );

    expect(screen.getByText("Mã đơn")).toBeInTheDocument();
    expect(screen.getByText("Mai Anh")).toBeInTheDocument();
    expect(screen.getByText("Hoàng Yến")).toBeInTheDocument();

    // Select all
    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: "Chọn tất cả các dòng",
    });
    fireEvent.click(selectAllCheckbox);
    expect(handleSelect).toHaveBeenCalledWith(["1", "2"], dummyData);

    fireEvent.click(selectAllCheckbox);
    expect(handleSelect).toHaveBeenCalledWith([], []);

    // Select single row
    const rowCheckbox = screen.getByRole("checkbox", {
      name: "Chọn dòng 1",
    });
    fireEvent.click(rowCheckbox);
    expect(handleSelect).toHaveBeenCalledWith(["1"], [dummyData[0]]);
  });

  it("handles pagination next and previous clicks", () => {
    const handlePageChange = vi.fn();
    render(
      <DataTable
        columns={dummyColumns}
        dataSource={dummyData}
        rowKey="id"
        pagination={{ total: 20, current: 2, pageSize: 5, onChange: handlePageChange }}
      />
    );

    const prevBtn = screen.getByRole("button", { name: "Trang trước" });
    fireEvent.click(prevBtn);
    expect(handlePageChange).toHaveBeenCalledWith(1, 5);

    const nextBtn = screen.getByRole("button", { name: "Trang sau" });
    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(3, 5);
  });

  it("renders empty state when dataSource is empty", () => {
    render(<DataTable columns={dummyColumns} dataSource={[]} emptyText="Trống" />);
    expect(screen.getByText("Trống")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<DataTable columns={dummyColumns} loading={true} />);
    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  it("renders fixed column with sticky classes", () => {
    const fixedColumns = [
      { title: "Mã", dataIndex: "code", key: "code", width: 100, fixed: "left" as const },
      { title: "Khách hàng", dataIndex: "customer", key: "customer" },
      { title: "Thao tác", key: "actions", width: 80, fixed: "right" as const },
    ];
    render(<DataTable columns={fixedColumns} dataSource={dummyData} />);

    const leftHeader = screen.getByText("Mã").closest("th");
    expect(leftHeader).toHaveClass("sticky");
    expect(leftHeader).toHaveClass("left-0");

    const rightHeader = screen.getByText("Thao tác").closest("th");
    expect(rightHeader).toHaveClass("sticky");
    expect(rightHeader).toHaveClass("right-0");
  });
});
