import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { staffService } from "../../../../services/staff.service";
import { StaffUser } from "../../../../types/staff";
import "../../../../i18n";

vi.mock("../../../../services/staff.service", () => ({
  staffService: {
    resetPassword: vi.fn(),
  },
}));

describe("ResetPasswordModal Component", () => {
  const mockStaff: StaffUser = {
    id: 10,
    username: "maianh",
    fullName: "Nguyễn Mai Anh",
    email: "maianh@chickiestudio.vn",
    phone: "0987654321",
    role: "ROLE_STAFF",
    status: "ACTIVE",
  };

  const defaultProps = {
    open: true,
    staff: mockStaff,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when open is false", () => {
    render(<ResetPasswordModal {...defaultProps} open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders staff info and new password input", () => {
    render(<ResetPasswordModal {...defaultProps} />);

    expect(screen.getByRole("heading", { name: "Đặt Lại Mật Khẩu" })).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Mai Anh (@maianh)")).toBeInTheDocument();
    expect(screen.getByText("Tạo mật khẩu ngẫu nhiên")).toBeInTheDocument();
  });

  it("submits reset password successfully", async () => {
    const user = userEvent.setup();
    vi.mocked(staffService.resetPassword).mockResolvedValue(undefined);

    render(<ResetPasswordModal {...defaultProps} />);

    const generateBtn = screen.getByText("Tạo mật khẩu ngẫu nhiên");
    await user.click(generateBtn);

    const submitBtn = screen.getByRole("button", { name: "Đặt Lại Mật Khẩu" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(staffService.resetPassword).toHaveBeenCalledWith(
        10,
        expect.objectContaining({
          newPassword: expect.any(String),
        })
      );
      expect(defaultProps.onSuccess).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});
