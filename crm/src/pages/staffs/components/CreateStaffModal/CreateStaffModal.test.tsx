import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateStaffModal } from "./CreateStaffModal";
import { staffService } from "../../../../services/staff.service";
import "../../../../i18n";

vi.mock("../../../../services/staff.service", () => ({
  staffService: {
    createStaff: vi.fn(),
  },
}));

describe("CreateStaffModal Component", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when open is false", () => {
    render(<CreateStaffModal {...defaultProps} open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders modal with all form fields", () => {
    render(<CreateStaffModal {...defaultProps} />);

    expect(screen.getByText("Thêm Tài Khoản Nhân Viên Mới")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("vd: maianh")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("vd: Nguyễn Mai Anh")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("vd: maianh@chickiestudio.vn")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("vd: 0987654321")).toBeInTheDocument();
    expect(screen.getByText("Tạo mật khẩu ngẫu nhiên")).toBeInTheDocument();
  });

  it("generates random password when clicking generate button", async () => {
    const user = userEvent.setup();
    render(<CreateStaffModal {...defaultProps} />);

    const generateBtn = screen.getByText("Tạo mật khẩu ngẫu nhiên");
    await user.click(generateBtn);

    const passwordInput = screen.getByPlaceholderText("Tối thiểu 8 ký tự, 1 hoa, 1 thường, 1 số");
    expect((passwordInput as HTMLInputElement).value.length).toBeGreaterThanOrEqual(8);
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<CreateStaffModal {...defaultProps} />);

    const submitBtn = screen.getByRole("button", { name: "Thêm nhân viên" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Tên đăng nhập tối thiểu 3 ký tự")).toBeInTheDocument();
      expect(screen.getByText("Họ và tên không được để trống")).toBeInTheDocument();
      expect(screen.getByText("Email không được để trống")).toBeInTheDocument();
      expect(screen.getByText("Mật khẩu tối thiểu 8 ký tự")).toBeInTheDocument();
    });
    expect(staffService.createStaff).not.toHaveBeenCalled();
  });

  it("submits valid form data successfully", async () => {
    const user = userEvent.setup();
    vi.mocked(staffService.createStaff).mockResolvedValue({
      id: 11,
      username: "hoangnam",
      email: "nam@chickie.vn",
      fullName: "Trần Hoàng Nam",
      role: "ROLE_STAFF",
      status: "ACTIVE",
    });

    render(<CreateStaffModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("vd: maianh"), "hoangnam");
    await user.type(screen.getByPlaceholderText("vd: Nguyễn Mai Anh"), "Trần Hoàng Nam");
    await user.type(screen.getByPlaceholderText("vd: maianh@chickiestudio.vn"), "nam@chickie.vn");
    await user.type(screen.getByPlaceholderText("vd: 0987654321"), "0987654321");
    await user.type(screen.getByPlaceholderText("Tối thiểu 8 ký tự, 1 hoa, 1 thường, 1 số"), "Staff@2026");

    const submitBtn = screen.getByRole("button", { name: "Thêm nhân viên" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(staffService.createStaff).toHaveBeenCalledWith({
        username: "hoangnam",
        fullName: "Trần Hoàng Nam",
        email: "nam@chickie.vn",
        phone: "0987654321",
        password: "Staff@2026",
        role: "ROLE_STAFF",
      });
      expect(defaultProps.onSuccess).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});
