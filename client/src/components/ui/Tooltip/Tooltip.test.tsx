import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { Tooltip } from "./Tooltip";

describe("Tooltip component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows on mouseEnter after delay and hides on mouseLeave", () => {
    render(
      <Tooltip content="Gợi ý chi tiết" delayMs={100}>
        <button>Di chuột</button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Di chuột" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    fireEvent.mouseEnter(button);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("Gợi ý chi tiết");
    expect(button).toHaveAttribute("aria-describedby", tooltip.id);

    fireEvent.mouseLeave(button);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows on focus and hides on blur", () => {
    render(
      <Tooltip content="Trợ giúp tiêu điểm" delayMs={50}>
        <button>Tiêu điểm</button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Tiêu điểm" });
    fireEvent.focus(button);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.blur(button);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("hides on Escape key", () => {
    render(
      <Tooltip content="Tooltip Escape" delayMs={0}>
        <button>Nút Escape</button>
      </Tooltip>
    );

    const button = screen.getByRole("button", { name: "Nút Escape" });
    fireEvent.mouseEnter(button);
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("supports custom placement classes and preserves child handlers", () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    const { rerender } = render(
      <Tooltip content="Left tooltip" placement="left" delayMs={0}>
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          Trái
        </button>
      </Tooltip>
    );

    const btn = screen.getByRole("button", { name: "Trái" });
    fireEvent.mouseEnter(btn);
    expect(handleMouseEnter).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByRole("tooltip")).toHaveClass("right-full");

    fireEvent.mouseLeave(btn);
    expect(handleMouseLeave).toHaveBeenCalled();

    fireEvent.focus(btn);
    expect(handleFocus).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(0);
    });

    fireEvent.blur(btn);
    expect(handleBlur).toHaveBeenCalled();

    rerender(
      <Tooltip content="Right tooltip" placement="right" delayMs={0}>
        <button>Phải</button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Phải" }));
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByRole("tooltip")).toHaveClass("left-full");
  });

  it("has no accessibility violations", async () => {
    vi.useRealTimers();
    const { container } = render(
      <Tooltip content="Gợi ý trợ năng" delayMs={0}>
        <button>Trợ năng</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Trợ năng" }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
