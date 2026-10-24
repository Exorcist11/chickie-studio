import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { EmptyState } from "./EmptyState";

describe("EmptyState component", () => {
  it("renders title, description and action", () => {
    render(
      <EmptyState
        title="Không tìm thấy trang phục"
        description="Thử đổi bộ lọc hoặc tìm từ khóa khác"
        action={<button>Xóa bộ lọc</button>}
      />
    );
    expect(screen.getByRole("heading", { name: "Không tìm thấy trang phục" })).toBeInTheDocument();
    expect(screen.getByText("Thử đổi bộ lọc hoặc tìm từ khóa khác")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xóa bộ lọc" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <EmptyState title="Trống" description="Không có kết quả nào" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
