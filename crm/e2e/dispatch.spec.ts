import { test, expect } from "@playwright/test";

test.describe("CRM Dispatch & Calendar Management (BOK-006)", () => {
  test("chuyển hướng về login khi chưa xác thực", async ({ page }) => {
    await page.route("**/api/public/auth/refresh", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Unauthorized" }),
      });
    });

    await page.goto("/calendar");
    await expect(page).toHaveURL(/\/login/);
  });

  test("hiển thị lịch đơn thuê và chuyển đổi sang timeline kho đồ với đầy đủ tương tác", async ({
    page,
  }) => {
    // Mock Auth
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

    // Mock Calendar API
    await page.route("**/api/admin/dispatch/calendar*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            startDate: "2026-10-01",
            endDate: "2026-10-31",
            totalBookings: 1,
            bookings: [
              {
                id: 101,
                bookingCode: "BOK-E2E-001",
                customerName: "Nguyễn Thu Hà",
                customerPhone: "0987654321",
                customerEmail: "ha.nguyen@example.com",
                status: "CONFIRMED",
                rentalStartDate: "2026-10-15",
                rentalEndDate: "2026-10-17",
                totalRentalPrice: 600000,
                totalDepositPrice: 1200000,
                totalAmount: 1800000,
                itemCount: 1,
                items: [
                  {
                    bookingItemId: 501,
                    barcode: "AO-DAI-E2E",
                    productName: "Áo dài truyền thống gấm hoa",
                    variantInfo: "Size M / Đỏ",
                    rentalPrice: 600000,
                  },
                ],
              },
            ],
          },
        }),
      });
    });

    // Mock Timeline API
    await page.route("**/api/admin/dispatch/timeline*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            startDate: "2026-10-01",
            endDate: "2026-10-31",
            resources: [
              {
                itemId: 901,
                barcode: "AO-DAI-E2E",
                productName: "Áo dài truyền thống gấm hoa",
                variantInfo: "Size M / Đỏ",
                categoryType: "COSTUME",
                itemStatus: "RENTED",
                events: [
                  {
                    bookingId: 101,
                    bookingItemId: 501,
                    bookingCode: "BOK-E2E-001",
                    customerName: "Nguyễn Thu Hà",
                    customerPhone: "0987654321",
                    startDate: "2026-10-15",
                    endDate: "2026-10-17",
                    bufferEndDate: "2026-10-18",
                    bufferDays: 1,
                    status: "CONFIRMED",
                    rentalPrice: 600000,
                    depositPrice: 1200000,
                  },
                ],
              },
            ],
          },
        }),
      });
    });

    // Mock Available Replacements
    await page.route("**/api/admin/dispatch/items/*/available-replacements", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [
            {
              itemId: 902,
              barcode: "AO-DAI-E2E-02",
              productName: "Áo dài truyền thống gấm hoa",
              variantInfo: "Size M / Đỏ",
              itemStatus: "AVAILABLE",
              rentalCount: 2,
              isCurrent: false,
              isAvailable: true,
            },
          ],
        }),
      });
    });

    // Inject auth token
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

    await page.goto("/calendar");

    // Page header title
    await expect(page.getByRole("heading", { level: 1, name: /Lịch Thuê & Điều Phối Kho Đồ/i })).toBeVisible();

    // View Switcher buttons
    const calendarBtn = page.getByRole("button", { name: "Lịch Đơn Thuê" });
    const timelineBtn = page.getByRole("button", { name: "Timeline Kho Đồ" });
    await expect(calendarBtn).toBeVisible();
    await expect(timelineBtn).toBeVisible();

    // Check booking chip on calendar
    const bookingChip = page.getByRole("button", { name: /BOK-E2E-001/i }).first();
    await expect(bookingChip).toBeVisible();

    // Click booking chip to open detail modal
    await bookingChip.click();

    // Verify detail modal
    const modal = page.getByRole("dialog");
    await expect(modal.getByRole("heading", { name: /Chi tiết đơn: BOK-E2E-001/i })).toBeVisible();
    await expect(modal.getByText("Nguyễn Thu Hà")).toBeVisible();
    await expect(modal.getByText("AO-DAI-E2E")).toBeVisible();

    // Close detail modal
    const closeBtn = modal.getByRole("button", { name: "Đóng" });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // Switch to Timeline view
    await timelineBtn.click();

    // Check resource row
    const table = page.getByRole("table");
    await expect(table.getByText("AO-DAI-E2E")).toBeVisible();
    await expect(table.getByText("Áo dài truyền thống gấm hoa")).toBeVisible();

    // Check laundry buffer period
    await expect(table.getByText("Giặt sấy (1d)")).toBeVisible();
  });
});
