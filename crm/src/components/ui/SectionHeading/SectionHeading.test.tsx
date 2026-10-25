import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { SectionHeading } from "./SectionHeading";

describe("CRM SectionHeading Component", () => {
  it("renders title, description and action", () => {
    render(
      <SectionHeading
        title="Quản lý kho đồ"
        description="Toàn bộ mẫu đầm và trang phục"
        action={<button>Thêm đầm mới</button>}
      />
    );

    expect(screen.getByRole("heading", { level: 2, name: "Quản lý kho đồ" })).toBeInTheDocument();
    expect(screen.getByText("Toàn bộ mẫu đầm và trang phục")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thêm đầm mới" })).toBeInTheDocument();
  });

  it("supports different heading levels", () => {
    render(<SectionHeading title="Thống kê" level="h1" />);
    expect(screen.getByRole("heading", { level: 1, name: "Thống kê" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SectionHeading
        title="Danh sách khách hàng"
        description="Thông tin liên hệ và lịch sử thuê"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
