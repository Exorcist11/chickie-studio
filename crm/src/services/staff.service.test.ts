import { describe, it, expect, vi, beforeEach } from "vitest";
import { staffService } from "./staff.service";
import { apiClient } from "./apiClient";
import { StaffUser } from "../types/staff";

describe("staffService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockStaff: StaffUser = {
    id: 10,
    username: "maianh",
    email: "maianh@chickiestudio.vn",
    fullName: "Nguyễn Mai Anh",
    phone: "0987654321",
    role: "ROLE_STAFF",
    status: "ACTIVE",
    createdAt: "2026-10-25T10:00:00",
  };

  it("getStaffs_shouldCallGetWithCorrectParams", async () => {
    const mockPageResult = {
      content: [mockStaff],
      totalElements: 1,
      totalPages: 1,
      size: 10,
      number: 0,
      first: true,
      last: true,
      empty: false,
    };

    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue({
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-25T10:00:00",
      data: mockPageResult,
    });

    const result = await staffService.getStaffs({
      search: "maianh",
      role: "ROLE_STAFF",
      status: "ACTIVE",
      page: 0,
      size: 10,
      sort: "createdAt,desc",
    });

    expect(getSpy).toHaveBeenCalledWith(
      "/api/admin/users?search=maianh&role=ROLE_STAFF&status=ACTIVE&page=0&size=10&sort=createdAt%2Cdesc"
    );
    expect(result.content).toHaveLength(1);
    expect(result.content[0].username).toBe("maianh");
  });

  it("getStaffById_shouldCallGetWithId", async () => {
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue({
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-25T10:00:00",
      data: mockStaff,
    });

    const result = await staffService.getStaffById(10);
    expect(getSpy).toHaveBeenCalledWith("/api/admin/users/10");
    expect(result.id).toBe(10);
  });

  it("createStaff_shouldCallPostWithData", async () => {
    const input = {
      username: "maianh",
      fullName: "Nguyễn Mai Anh",
      email: "maianh@chickiestudio.vn",
      password: "Password@123",
      role: "ROLE_STAFF" as const,
    };

    const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue({
      code: 201,
      message: "Tạo tài khoản thành công",
      timestamp: "2026-10-25T10:00:00",
      data: mockStaff,
    });

    const result = await staffService.createStaff(input);
    expect(postSpy).toHaveBeenCalledWith("/api/admin/users", input);
    expect(result.id).toBe(10);
  });

  it("updateStaff_shouldCallPutWithData", async () => {
    const input = {
      fullName: "Nguyễn Mai Anh Đổi Tên",
      email: "maianh_new@chickiestudio.vn",
      role: "ROLE_ADMIN" as const,
    };

    const putSpy = vi.spyOn(apiClient, "put").mockResolvedValue({
      code: 200,
      message: "Cập nhật thành công",
      timestamp: "2026-10-25T10:00:00",
      data: { ...mockStaff, ...input },
    });

    const result = await staffService.updateStaff(10, input);
    expect(putSpy).toHaveBeenCalledWith("/api/admin/users/10", input);
    expect(result.fullName).toBe("Nguyễn Mai Anh Đổi Tên");
  });

  it("updateStaffStatus_shouldCallPatchWithStatus", async () => {
    const patchSpy = vi.spyOn(apiClient, "patch").mockResolvedValue({
      code: 200,
      message: "Khóa tài khoản thành công",
      timestamp: "2026-10-25T10:00:00",
      data: { ...mockStaff, status: "LOCKED" },
    });

    const result = await staffService.updateStaffStatus(10, { status: "LOCKED" });
    expect(patchSpy).toHaveBeenCalledWith("/api/admin/users/10/status", { status: "LOCKED" });
    expect(result.status).toBe("LOCKED");
  });

  it("resetPassword_shouldCallPostWithNewPassword", async () => {
    const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue({
      code: 200,
      message: "Đặt lại mật khẩu thành công",
      timestamp: "2026-10-25T10:00:00",
      data: null as any,
    });

    await staffService.resetPassword(10, { newPassword: "NewPassword@123" });
    expect(postSpy).toHaveBeenCalledWith("/api/admin/users/10/reset-password", {
      newPassword: "NewPassword@123",
    });
  });
});
