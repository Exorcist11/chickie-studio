import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { LookbookSpotlight } from "./LookbookSpotlight";

describe("LookbookSpotlight component", () => {
  it("renders spotlight title and call to action", () => {
    render(<LookbookSpotlight />);

    expect(screen.getByRole("heading", { name: "Bộ sưu tập mới" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Xem ngay/i })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<LookbookSpotlight />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
