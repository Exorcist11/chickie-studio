import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SizeGuideModal } from "./SizeGuideModal";

describe("SizeGuideModal", () => {
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <SizeGuideModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders correctly for COSTUME pillar and displays size guide table", () => {
    render(<SizeGuideModal isOpen={true} onClose={vi.fn()} pillar="COSTUME" />);

    expect(
      screen.getByRole("heading", { name: "Hướng Dẫn Chọn Size Váy & Áo Dài" })
    ).toBeInTheDocument();
    expect(screen.getByText("XS")).toBeInTheDocument();
    expect(screen.getByText("S (Phổ biến)")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("L")).toBeInTheDocument();
  });

  it("selects a size and triggers callbacks when clicking a size button", async () => {
    const user = userEvent.setup();
    const handleSelectSize = vi.fn();
    const handleClose = vi.fn();

    render(
      <SizeGuideModal
        isOpen={true}
        onClose={handleClose}
        pillar="COSTUME"
        onSelectSize={handleSelectSize}
      />
    );

    const selectSBtn = screen.getByRole("button", { name: "Chọn S" });
    await user.click(selectSBtn);

    expect(handleSelectSize).toHaveBeenCalledWith("S");
    expect(handleClose).toHaveBeenCalled();
  });

  it("selects size M and L correctly", async () => {
    const user = userEvent.setup();
    const handleSelectSize = vi.fn();
    const handleClose = vi.fn();

    const { rerender } = render(
      <SizeGuideModal
        isOpen={true}
        onClose={handleClose}
        pillar="COSTUME"
        onSelectSize={handleSelectSize}
      />
    );

    const selectMBtn = screen.getByRole("button", { name: "Chọn M" });
    await user.click(selectMBtn);
    expect(handleSelectSize).toHaveBeenCalledWith("M");

    rerender(
      <SizeGuideModal
        isOpen={true}
        onClose={handleClose}
        pillar="COSTUME"
        onSelectSize={handleSelectSize}
      />
    );

    const selectLBtn = screen.getByRole("button", { name: "Chọn L" });
    await user.click(selectLBtn);
    expect(handleSelectSize).toHaveBeenCalledWith("L");

    const continueBtn = screen.getByRole("button", { name: "Đã hiểu & Tiếp tục đặt" });
    await user.click(continueBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it("renders camera accessory guide when pillar is CAMERA", () => {
    render(<SizeGuideModal isOpen={true} onClose={vi.fn()} pillar="CAMERA" />);

    expect(
      screen.getByRole("heading", { name: "Thông Số Thiết Bị & Cấu Hình Combo" })
    ).toBeInTheDocument();
    expect(screen.getByText("Bộ Kit Tiêu Chuẩn Đi Kèm")).toBeInTheDocument();
  });

  it("renders photography guide when pillar is PHOTOGRAPHY", () => {
    render(<SizeGuideModal isOpen={true} onClose={vi.fn()} pillar="PHOTOGRAPHY" />);

    expect(
      screen.getByRole("heading", { name: "Quy Chuẩn Gói Dịch Vụ Chụp Ảnh" })
    ).toBeInTheDocument();
    expect(screen.getByText("Đặc Quyền Gói Chụp Ảnh Tại Chickie Studio")).toBeInTheDocument();
  });

  it("calls onClose when close icon button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<SizeGuideModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByRole("button", { name: "Đóng modal" });
    await user.click(closeBtn);

    expect(handleClose).toHaveBeenCalled();
  });

  it("passes accessibility checks", async () => {
    const { container } = render(
      <SizeGuideModal isOpen={true} onClose={vi.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
