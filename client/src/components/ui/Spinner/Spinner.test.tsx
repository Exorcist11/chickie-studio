import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Spinner } from "./Spinner";

describe("Spinner component", () => {
  it("renders with role status and accessible label", () => {
    render(<Spinner label="Đang nạp dữ liệu..." />);
    const spinner = screen.getByRole("status", { name: "Đang nạp dữ liệu..." });
    expect(spinner).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Spinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
