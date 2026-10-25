import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DataTable } from "./DataTable";

interface MockRow {
  id: string;
  name: string;
  role: string;
}

const mockColumns = [
  { key: "name", title: "Họ và tên", dataIndex: "name" },
  { key: "role", title: "Vai trò", dataIndex: "role" },
];

const mockData: MockRow[] = [
  { id: "1", name: "Nguyễn Văn A", role: "Khách VIP" },
  { id: "2", name: "Trần Thị B", role: "Thành viên" },
];

describe("DataTable Component (Client)", () => {
  it("renders table with columns and data", () => {
    render(<DataTable columns={mockColumns} data={mockData} caption="Bảng khách hàng" />);

    expect(screen.getByText("Họ và tên")).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByText("Trần Thị B")).toBeInTheDocument();
  });

  it("displays loading state when loading is true", () => {
    render(<DataTable columns={mockColumns} data={mockData} loading />);
    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  it("displays empty state when data is empty", () => {
    render(<DataTable columns={mockColumns} data={[]} emptyText="Chưa có dữ liệu người dùng" />);
    expect(screen.getByText("Chưa có dữ liệu người dùng")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <DataTable columns={mockColumns} data={mockData} caption="Danh sách kiểm thử" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
