import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal component (CRM)", () => {
  it("renders modal when open is true", () => {
    const handleClose = vi.fn();

    render(
      <Modal
        open={true}
        onClose={handleClose}
        title="Tiêu đề Modal"
        subtitle="Mô tả phụ"
        footer={<button>Lưu</button>}
      >
        <p>Nội dung modal bên trong</p>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Tiêu đề Modal")).toBeInTheDocument();
    expect(screen.getByText("Mô tả phụ")).toBeInTheDocument();
    expect(screen.getByText("Nội dung modal bên trong")).toBeInTheDocument();
    expect(screen.getByText("Lưu")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    const handleClose = vi.fn();

    render(
      <Modal open={false} onClose={handleClose} title="Ẩn Modal">
        <p>Nội dung ẩn</p>
      </Modal>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal open={true} onClose={handleClose} title="Đóng bằng nút">
        <p>Test</p>
      </Modal>
    );

    const closeBtn = screen.getByRole("button", { name: "close-modal" });
    await user.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking outside overlay", () => {
    const handleClose = vi.fn();

    render(
      <Modal open={true} onClose={handleClose} title="Overlay click">
        <p>Content</p>
      </Modal>
    );

    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const handleClose = vi.fn();

    render(
      <Modal open={true} onClose={handleClose} title="Escape key">
        <p>Content</p>
      </Modal>
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders with drawer variant correctly", () => {
    const handleClose = vi.fn();

    render(
      <Modal open={true} onClose={handleClose} variant="drawer" title="Drawer Modal">
        <p>Drawer Content</p>
      </Modal>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("crm-modal--drawer");
  });
});
