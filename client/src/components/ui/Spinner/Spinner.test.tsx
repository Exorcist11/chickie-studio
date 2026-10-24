import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Spinner } from "./Spinner";

describe("Chickie Base Spinner Component", () => {
  it("renders with role status and accessible default label", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText("Đang tải...")).toHaveClass("sr-only");
  });

  it("renders with custom screen-reader label", () => {
    render(<Spinner label="Đang tải danh sách trang phục..." />);
    expect(
      screen.getByText("Đang tải danh sách trang phục...")
    ).toBeInTheDocument();
  });

  it("applies different size classes", () => {
    const { container, rerender } = render(<Spinner size="xs" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("h-3 w-3");

    rerender(<Spinner size="sm" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("h-4 w-4");

    rerender(<Spinner size="md" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("h-6 w-6");

    rerender(<Spinner size="lg" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("h-8 w-8");

    rerender(<Spinner size="xl" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("h-12 w-12");
  });

  it("applies color variant classes", () => {
    const { container, rerender } = render(<Spinner variant="primary" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("text-primary");

    rerender(<Spinner variant="secondary" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("text-muted-foreground");

    rerender(<Spinner variant="current" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("text-current");

    rerender(<Spinner variant="white" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("text-white");
  });

  it("forwards ref to the outer status container", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(
      <div>
        <Spinner label="Đang tải bảng báo giá..." />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
