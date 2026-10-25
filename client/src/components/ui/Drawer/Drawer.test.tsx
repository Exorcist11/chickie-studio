import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Drawer } from "./Drawer";

describe("Drawer component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <Drawer isOpen={false} onClose={vi.fn()}>
        <p>Drawer content</p>
      </Drawer>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true with title, description, content and footer", () => {
    render(
      <Drawer
        isOpen={true}
        onClose={vi.fn()}
        title="Tiêu đề ngăn kéo"
        description="Mô tả chi tiết"
        footer={<button>Lưu thay đổi</button>}
      >
        <p>Nội dung bên trong</p>
      </Drawer>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Tiêu đề ngăn kéo")).toBeInTheDocument();
    expect(screen.getByText("Mô tả chi tiết")).toBeInTheDocument();
    expect(screen.getByText("Nội dung bên trong")).toBeInTheDocument();
    expect(screen.getByText("Lưu thay đổi")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const handleClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={handleClose} title="Drawer Title">
        <p>Content</p>
      </Drawer>
    );

    const closeBtn = screen.getByRole("button", { name: "Đóng ngăn kéo" });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={handleClose} closeOnBackdrop={true}>
        <p>Content</p>
      </Drawer>
    );

    const backdrop = screen.getByTestId("drawer-backdrop");
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when closeOnBackdrop is false and backdrop is clicked", () => {
    const handleClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={handleClose} closeOnBackdrop={false}>
        <p>Content</p>
      </Drawer>
    );

    const backdrop = screen.getByTestId("drawer-backdrop");
    fireEvent.click(backdrop);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Escape key is pressed", () => {
    const handleClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </Drawer>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("supports different placements and sizes", () => {
    const { rerender } = render(
      <Drawer isOpen={true} onClose={vi.fn()} placement="left" size="lg">
        <p>Left Drawer</p>
      </Drawer>
    );
    expect(screen.getByRole("dialog")).toHaveClass("left-0");

    rerender(
      <Drawer isOpen={true} onClose={vi.fn()} placement="bottom" size="sm">
        <p>Bottom Drawer</p>
      </Drawer>
    );
    expect(screen.getByRole("dialog")).toHaveClass("bottom-0");

    rerender(
      <Drawer isOpen={true} onClose={vi.fn()} placement="top" size="full">
        <p>Top Drawer</p>
      </Drawer>
    );
    expect(screen.getByRole("dialog")).toHaveClass("top-0");
  });

  it("traps focus between focusable elements on Tab and Shift+Tab", async () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()} title="Focus Trap Drawer">
        <input data-testid="input-first" />
        <button data-testid="button-second">Submit</button>
      </Drawer>
    );

    const closeBtn = screen.getByRole("button", { name: "Đóng ngăn kéo" });
    const input = screen.getByTestId("input-first");
    const button = screen.getByTestId("button-second");

    // Close button is the first element, button is last element
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);

    // Shift+Tab from first element wraps to last element
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(button);

    // Tab from last element wraps to first element
    fireEvent.keyDown(document, { key: "Tab", shiftKey: false });
    expect(document.activeElement).toBe(closeBtn);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Drawer isOpen={true} onClose={vi.fn()} title="Hộp thoại khả dụng">
        <button>Thao tác</button>
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
