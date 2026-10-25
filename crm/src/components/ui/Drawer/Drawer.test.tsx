import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Drawer } from "./Drawer";

describe("Drawer component (CRM)", () => {
  it("does not render when open is false", () => {
    render(
      <Drawer open={false} onClose={vi.fn()}>
        <p>Drawer content</p>
      </Drawer>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when open is true with title, subtitle, content and footer", () => {
    render(
      <Drawer
        open={true}
        onClose={vi.fn()}
        title="Chi tiết đơn hàng"
        subtitle="Mã đơn ORD-12345"
        footer={<button>Cập nhật trạng thái</button>}
      >
        <p>Danh sách trang phục thuê</p>
      </Drawer>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Chi tiết đơn hàng")).toBeInTheDocument();
    expect(screen.getByText("Mã đơn ORD-12345")).toBeInTheDocument();
    expect(screen.getByText("Danh sách trang phục thuê")).toBeInTheDocument();
    expect(screen.getByText("Cập nhật trạng thái")).toBeInTheDocument();
  });

  it("calls onClose when clicking close button", () => {
    const handleClose = vi.fn();
    render(
      <Drawer open={true} onClose={handleClose} title="Drawer Title">
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
      <Drawer open={true} onClose={handleClose} closeOnBackdrop={true}>
        <p>Content</p>
      </Drawer>
    );

    const backdrop = screen.getByTestId("crm-drawer-backdrop");
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on Escape key", () => {
    const handleClose = vi.fn();
    render(
      <Drawer open={true} onClose={handleClose}>
        <p>Content</p>
      </Drawer>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Drawer open={true} onClose={vi.fn()} title="Tiêu đề khả năng truy cập">
        <button>Lưu</button>
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
