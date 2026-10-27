import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StaffsPage } from "./StaffsPage";
import { staffService } from "../../services/staff.service";
import { StaffUser } from "../../types/staff";
import "../../i18n";

vi.mock("../../services/staff.service", () => ({
  staffService: {
    getStaffs: vi.fn(),
    updateStaffStatus: vi.fn(),
  },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      username: "admin",
      fullName: "Admin Tổng",
      role: "ROLE_ADMIN",
      status: "ACTIVE",
    },
  }),
}));

describe("StaffsPage Component", () => {
  let queryClient: QueryClient;

  const mockStaffs: StaffUser[] = [
    {
      id: 1,
      username: "admin",
      fullName: "Quản Trị Viên Gốc",
      email: "admin@chickie.vn",
      phone: "0900000000",
      role: "ROLE_ADMIN",
      status: "ACTIVE",
      createdAt: "2026-10-24T10:00:00",
    },
    {
      id: 2,
      username: "maianh",
      fullName: "Nguyễn Mai Anh",
      email: "maianh@chickie.vn",
      phone: "0987654321",
      role: "ROLE_STAFF",
      status: "ACTIVE",
      createdAt: "2026-10-25T10:00:00",
    },
    {
      id: 3,
      username: "hoangnam",
      fullName: "Trần Hoàng Nam",
      email: "nam@chickie.vn",
      phone: "0912345678",
      role: "ROLE_STAFF",
      status: "LOCKED",
      createdAt: "2026-10-26T10:00:00",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    vi.mocked(staffService.getStaffs).mockResolvedValue({
      content: mockStaffs,
      totalElements: 3,
      totalPages: 1,
      size: 10,
      number: 0,
      first: true,
      last: true,
      empty: false,
    });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <StaffsPage />
      </QueryClientProvider>
    );

  it("renders page header and stat cards properly", async () => {
    renderComponent();

    expect(screen.getByRole("heading", { name: "Quản Lý Nhân Viên" })).toBeInTheDocument();
    expect(screen.getByText("Tổng nhân viên")).toBeInTheDocument();
    expect(screen.getByText("Đang hoạt động")).toBeInTheDocument();
    expect(screen.getByText("Đã khóa tài khoản")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Quản Trị Viên Gốc")).toBeInTheDocument();
      expect(screen.getByText("Nguyễn Mai Anh")).toBeInTheDocument();
      expect(screen.getByText("Trần Hoàng Nam")).toBeInTheDocument();
    });
  });

  it("opens Create Staff modal when clicking add button", async () => {
    const user = userEvent.setup();
    renderComponent();

    const addBtn = screen.getByRole("button", { name: "Thêm nhân viên" });
    await user.click(addBtn);

    expect(screen.getByText("Thêm Tài Khoản Nhân Viên Mới")).toBeInTheDocument();
  });

  it("opens Edit modal when clicking edit button", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Mai Anh")).toBeInTheDocument();
    });

    const editBtn = screen.getByLabelText("edit-maianh");
    await user.click(editBtn);

    expect(screen.getByText("Cập Nhật Thông Tin Nhân Viên")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Nguyễn Mai Anh")).toBeInTheDocument();
  });

  it("opens Reset Password modal when clicking reset key button", async () => {
    const user = userEvent.setup();
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Mai Anh")).toBeInTheDocument();
    });

    const resetBtn = screen.getByLabelText("reset-pwd-maianh");
    await user.click(resetBtn);

    expect(screen.getByText("Nguyễn Mai Anh (@maianh)")).toBeInTheDocument();
  });

  it("disables status toggle switch for root admin account", async () => {
    renderComponent();

    await waitFor(() => {
      const rootAdminSwitch = screen.getByLabelText("status-toggle-admin");
      expect(rootAdminSwitch).toBeDisabled();
    });
  });

  it("opens confirm modal when locking an active staff", async () => {
    const user = userEvent.setup();
    vi.mocked(staffService.updateStaffStatus).mockResolvedValue({
      id: 2,
      username: "maianh",
      email: "maianh@chickie.vn",
      fullName: "Nguyễn Mai Anh",
      role: "ROLE_STAFF",
      status: "LOCKED",
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Nguyễn Mai Anh")).toBeInTheDocument();
    });

    const maianhSwitch = screen.getByLabelText("status-toggle-maianh");
    await user.click(maianhSwitch);

    expect(screen.getByText("Xác nhận khóa tài khoản")).toBeInTheDocument();
    expect(
      screen.getByText(/Bạn có chắc chắn muốn khóa tài khoản Nguyễn Mai Anh\?/)
    ).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: "Xác nhận" });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(staffService.updateStaffStatus).toHaveBeenCalledWith(2, {
        status: "LOCKED",
      });
    });
  });

  it("resets search and filters when clicking reset button", async () => {
    const user = userEvent.setup();
    renderComponent();

    const searchInput = screen.getByPlaceholderText("Tìm theo họ tên, username, email, SĐT...");
    await user.type(searchInput, "maianh");

    const resetBtn = await screen.findByRole("button", { name: "Đặt lại" });
    expect(resetBtn).toBeInTheDocument();

    await user.click(resetBtn);
    expect(searchInput).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Đặt lại" })).not.toBeInTheDocument();
  });
});

