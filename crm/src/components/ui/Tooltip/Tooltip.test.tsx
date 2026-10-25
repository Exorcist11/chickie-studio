import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { Tooltip } from "./Tooltip";

describe("Tooltip component (CRM)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows on hover after delay and hides on leave", () => {
    render(
      <Tooltip content="Mô tả CRM" delayMs={100}>
        <button>Rê chuột</button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Rê chuột" });
    fireEvent.mouseEnter(button);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("Mô tả CRM");

    fireEvent.mouseLeave(button);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("hides on Escape key", () => {
    render(
      <Tooltip content="Tooltip Escape" delayMs={0}>
        <button>Nút Esc</button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Nút Esc" });
    fireEvent.mouseEnter(button);
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    vi.useRealTimers();
    const { container } = render(
      <Tooltip content="Gợi ý trợ năng CRM" delayMs={0}>
        <button>Trợ năng</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Trợ năng" }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
