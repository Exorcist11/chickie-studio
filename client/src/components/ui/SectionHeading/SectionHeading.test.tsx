import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { SectionHeading } from "./SectionHeading";

describe("SectionHeading component", () => {
  it("renders title, description and optional action", () => {
    render(
      <SectionHeading
        title="Sản phẩm nổi bật"
        description="Những thiết kế thời trang hot nhất hiện nay"
        action={<button>Xem thêm</button>}
      />
    );
    expect(screen.getByRole("heading", { name: "Sản phẩm nổi bật" })).toBeInTheDocument();
    expect(screen.getByText("Những thiết kế thời trang hot nhất hiện nay")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xem thêm" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SectionHeading title="Dịch vụ nổi bật" description="Các dịch vụ hàng đầu" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
