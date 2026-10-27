import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditStaffModal } from "./EditStaffModal";
import { staffService } from "../../../../services/staff.service";
import { StaffUser } from "../../../../types/staff";
import "../../../../i18n";

vi.mock("../../../../services/staff.service", () => ({
  staffService: {
    updateStaff: vi.fn(),
  },
}));

describe("EditStaffModal Component", () => {
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
    render(<EditStaffModal {...defaultProps} open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("populates staff info and disables username input", () => {
    render(<EditStaffModal {...defaultProps} />);

    expect(screen.getByText("Cập Nhật Thông Tin Nhân Viên")).toBeInTheDocument();
    const usernameInput = screen.getByDisplayValue("maianh");
    expect(usernameInput).toBeDisabled();
    expect(screen.getByDisplayValue("Nguyễn Mai Anh")).toBeInTheDocument();
    expect(screen.getByDisplayValue("maianh@chickiestudio.vn")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0987654321")).toBeInTheDocument();
  });

  it("submits updated information successfully", async () => {
    const user = userEvent.setup();
    vi.mocked(staffService.updateStaff).mockResolvedValue({
      ...mockStaff,
      fullName: "Nguyễn Mai Anh Cập Nhật",
    });

    render(<EditStaffModal {...defaultProps} />);

    const nameInput = screen.getByDisplayValue("Nguyễn Mai Anh");
    await user.clear(nameInput);
    await user.type(nameInput, "Nguyễn Mai Anh Cập Nhật");

    const saveBtn = screen.getByRole("button", { name: "Lưu thay đổi" });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(staffService.updateStaff).toHaveBeenCalledWith(10, {
        fullName: "Nguyễn Mai Anh Cập Nhật",
        email: "maianh@chickiestudio.vn",
        phone: "0987654321",
        role: "ROLE_STAFF",
      });
      expect(defaultProps.onSuccess).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});
