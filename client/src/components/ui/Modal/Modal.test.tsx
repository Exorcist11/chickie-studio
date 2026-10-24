import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Modal, ConfirmModal } from "./Modal";

describe("Modal & ConfirmModal components", () => {
  it("renders when isOpen is true and hides when false", () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Tiêu đề Modal">
        Nội dung Modal
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Tiêu đề Modal" })).toBeInTheDocument();
    expect(screen.getByText("Nội dung Modal")).toBeInTheDocument();

    rerender(
      <Modal isOpen={false} onClose={vi.fn()} title="Tiêu đề Modal">
        Nội dung Modal
      </Modal>
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("calls onClose when clicking close button", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose} title="Hộp thoại">
        Nội dung
      </Modal>
    );

    const closeBtn = screen.getByRole("button", { name: "Đóng hộp thoại" });
    await user.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on Escape key press", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Hộp thoại">
        Nội dung
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders ConfirmModal and triggers onConfirm and onClose", async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <ConfirmModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Xác nhận hủy đơn"
        content="Bạn có chắc chắn muốn hủy đơn thuê này không?"
        confirmText="Đồng ý hủy"
        cancelText="Giữ lại đơn"
      />
    );

    expect(screen.getByText("Bạn có chắc chắn muốn hủy đơn thuê này không?")).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: "Giữ lại đơn" });
    await user.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const confirmBtn = screen.getByRole("button", { name: "Đồng ý hủy" });
    await user.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Tiêu đề kiểm tra">
        <p>Nội dung kiểm tra a11y</p>
      </Modal>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
