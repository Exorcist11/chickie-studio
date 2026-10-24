import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmModal } from "./ConfirmModal";
import "../../../i18n";

describe("ConfirmModal component (CRM)", () => {
  it("renders when open is true and calls onConfirm on click", () => {
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ConfirmModal
        open={true}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa không?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    expect(screen.getByText("Xác nhận xóa")).toBeInTheDocument();
    expect(
      screen.getByText("Bạn có chắc chắn muốn xóa không?")
    ).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "Xác nhận" });
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    const cancelBtn = screen.getByRole("button", { name: "Hủy" });
    fireEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("handles escape key to close modal", () => {
    const handleCancel = vi.fn();
    render(
      <ConfirmModal
        open={true}
        content="Nội dung"
        onConfirm={() => {}}
        onCancel={handleCancel}
      />
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("renders confirm button with primary burgundy variant by default", () => {
    render(
      <ConfirmModal
        open={true}
        content="Xác nhận"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    const confirmBtn = screen.getByRole("button", { name: "Xác nhận" });
    expect(confirmBtn).toHaveClass("bg-burgundy");
  });

  it("supports custom confirmVariant such as destructive", () => {
    render(
      <ConfirmModal
        open={true}
        content="Xác nhận"
        confirmVariant="destructive"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    const confirmBtn = screen.getByRole("button", { name: "Xác nhận" });
    expect(confirmBtn).toHaveClass("bg-destructive");
  });

  it("renders nothing when open is false", () => {
    const { container } = render(
      <ConfirmModal
        open={false}
        content="Nội dung"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});

