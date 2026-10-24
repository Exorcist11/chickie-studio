import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "./PageHeader";

describe("PageHeader component (CRM)", () => {
  it("renders title, subtitle, breadcrumbs and actions", () => {
    render(
      <PageHeader
        title="Quản lý trang phục"
        subtitle="Danh sách toàn bộ trang phục trong studio"
        breadcrumbs={[
          { title: "Trang chủ", href: "/" },
          { title: "Sản phẩm" },
        ]}
        actions={<button>Thêm mới</button>}
      />
    );

    expect(screen.getByText("Quản lý trang phục")).toBeInTheDocument();
    expect(
      screen.getByText("Danh sách toàn bộ trang phục trong studio")
    ).toBeInTheDocument();
    expect(screen.getByText("Trang chủ")).toBeInTheDocument();
    expect(screen.getByText("Sản phẩm")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thêm mới" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });
});
