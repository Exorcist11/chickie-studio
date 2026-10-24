import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Skeleton } from "./Skeleton";

describe("Chickie Base Skeleton Component", () => {
  it("renders default text shape with role status and sr-only text", () => {
    render(<Skeleton data-testid="default-skeleton" />);
    const skeleton = screen.getByRole("status");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.className).toContain("h-4");
    expect(skeleton.className).toContain("rounded-md");
    expect(screen.getByText("Đang tải dữ liệu...")).toHaveClass("sr-only");
  });

  it("supports preset shapes", () => {
    const { rerender } = render(
      <Skeleton data-testid="shape-test" shape="circular" />
    );
    expect(screen.getByTestId("shape-test").className).toContain("rounded-full");

    rerender(<Skeleton data-testid="shape-test" shape="rectangular" />);
    expect(screen.getByTestId("shape-test").className).toContain("rounded-md");

    rerender(<Skeleton data-testid="shape-test" shape="card" />);
    expect(screen.getByTestId("shape-test").className).toContain("h-48");
    expect(screen.getByTestId("shape-test").className).toContain("rounded-2xl");
  });

  it("supports custom label and className", () => {
    render(
      <Skeleton
        data-testid="custom-skeleton"
        label="Đang nạp ảnh sản phẩm..."
        className="w-20 h-20"
      />
    );
    expect(screen.getByTestId("custom-skeleton").className).toContain("w-20");
    expect(screen.getByText("Đang nạp ảnh sản phẩm...")).toBeInTheDocument();
  });

  it("respects aria-hidden=true without role status", () => {
    render(
      <Skeleton data-testid="hidden-skeleton" aria-hidden="true" />
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText("Đang tải dữ liệu...")).not.toBeInTheDocument();
    expect(screen.getByTestId("hidden-skeleton")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("forwards ref to div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(
      <div>
        <Skeleton shape="circular" className="w-12 h-12" label="Avatar" />
        <Skeleton shape="text" className="w-48 mt-2" label="Họ tên" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
