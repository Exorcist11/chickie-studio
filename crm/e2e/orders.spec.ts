import { test, expect } from "@playwright/test";

test.describe("CRM Orders & Bookings Management (BOK-004)", () => {
  test("chuyển hướng về login khi chưa xác thực", async ({ page }) => {
    await page.goto("/orders");
    await expect(page).toHaveURL(/\/login/);
  });

  test("hiển thị trang quản lý đơn thuê với dữ liệu và tương tác modal", async ({ page }) => {
    // Mock API Auth Refresh & Profile
    await page.route("**/api/public/auth/refresh", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { accessToken: "fake-jwt-token", expiresIn: 3600 },
        }),
      });
    });

    await page.route("**/api/admin/profile", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            username: "admin",
            user: {
              id: 1,
              username: "admin",
              fullName: "Admin Chic",
              role: "ROLE_ADMIN",
              status: "ACTIVE",
            },
          },
        }),
      });
    });

    // Mock API Bookings
    await page.route("**/api/admin/bookings*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            content: [
              {
                id: 1,
                bookingCode: "ORD-20261025-001",
                customerName: "Nguyễn Văn A",
                customerPhone: "0912345678",
                customerEmail: "nguyenvana@gmail.com",
                deliveryMethod: "SHIP_TO_ADDRESS",
                deliveryAddress: "123 Cầu Giấy, Hà Nội",
                rentalStartDate: "2026-10-25",
                rentalEndDate: "2026-10-28",
                durationDays: 3,
                status: "PENDING",
                totalRentalPrice: 500000,
                totalDepositPrice: 2000000,
                totalAmount: 2500000,
                createdAt: "2026-10-25T08:00:00Z",
                items: [
                  {
                    id: 1,
                    productName: "Váy cưới công chúa hoàng gia",
                    productItemCode: "BAR-001",
                    variantSize: "M",
                    variantColor: "Trắng",
                    rentalPrice: 500000,
                    depositPrice: 2000000,
                    rentalStartDate: "2026-10-25",
                    rentalEndDate: "2026-10-28",
                  },
                ],
                statusHistories: [
                  {
                    id: 1,
                    fromStatus: null,
                    toStatus: "PENDING",
                    changedBy: "Khách hàng",
                    note: "Khách đặt cọc giữ đồ",
                    createdAt: "2026-10-25T08:00:00Z",
                  },
                ],
              },
            ],
            page: 0,
            size: 10,
            totalElements: 1,
            totalPages: 1,
            last: true,
          },
        }),
      });
    });

    // Inject mock token for authenticated session
    await page.addInitScript(() => {
      localStorage.setItem("chickie_crm_token", "fake-test-jwt-token");
      localStorage.setItem(
        "chickie_crm_user",
        JSON.stringify({
          id: 1,
          username: "admin",
          fullName: "Admin Chic",
          role: "ROLE_ADMIN",
        })
      );
    });

    await page.goto("/orders");

    // Page header title
    await expect(page.getByRole("heading", { level: 1, name: /Quản Lý Đơn Thuê/i })).toBeVisible();

    // KPI Stat cards
    await expect(page.getByText("Tổng đơn thuê")).toBeVisible();
    await expect(page.getByText("Chờ xác nhận").first()).toBeVisible();

    // Filter tab pills
    await expect(page.getByRole("button", { name: "Tất cả" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Chờ duyệt" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cần giao hôm nay" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cần trả hôm nay" })).toBeVisible();

    // Order table content: ngày định dạng DD/MM/YYYY không chứa rightarrow
    await expect(page.getByText("ORD-20261025-001")).toBeVisible();
    await expect(page.getByText("Nguyễn Văn A")).toBeVisible();
    await expect(page.getByText("25/10/2026").first()).toBeVisible();
    await expect(page.getByText("28/10/2026")).toBeVisible();

    // Datepicker filter group
    await expect(page.getByLabel("Từ ngày nhận đồ")).toBeVisible();
    await expect(page.getByLabel("Đến ngày trả đồ")).toBeVisible();

    // Open detail modal by clicking booking code button
    await page.getByRole("button", { name: "ORD-20261025-001", exact: true }).click();

    // Check detail modal contents
    await expect(page.getByRole("heading", { name: "Thông tin khách hàng" })).toBeVisible();
    await expect(page.getByText("BAR-001")).toBeVisible();
    await expect(page.getByText("Váy cưới công chúa hoàng gia")).toBeVisible();

    // Phân biệt rõ nút Hủy đơn thuê (bên trái) và nút Đóng (bên phải)
    await expect(page.getByRole("button", { name: "Hủy đơn thuê" })).toBeVisible();
    const closeBtn = page.getByRole("button", { name: "Đóng" });
    await expect(closeBtn).toBeVisible();

    // Close detail modal via button "Đóng"
    await closeBtn.click();
    await expect(page.getByRole("heading", { name: "Thông tin khách hàng" })).not.toBeVisible();

    // Click quick action "Duyệt đơn" button to open status transition modal
    await page.getByRole("button", { name: "Duyệt đơn" }).first().click();
    await expect(page.getByRole("heading", { name: /Cập Nhật Trạng Thái Đơn/i })).toBeVisible();
  });
});

