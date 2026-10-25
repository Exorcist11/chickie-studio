import { test, expect } from "@playwright/test";

test.describe("Client Order Tracking E2E Tests (BOK-005)", () => {
  test("điều hướng từ Header đến trang /tra-cuu-don và hiển thị form tra cứu cùng FAQ", async ({
    page,
  }) => {
    await page.goto("/");

    // Click vào link "Tra cứu đơn" trên Header
    const trackingLink = page.getByRole("link", { name: "Tra cứu đơn" }).first();
    await expect(trackingLink).toBeVisible();
    await trackingLink.click();

    // Kiểm tra URL và tiêu đề
    await expect(page).toHaveURL(/.*\/tra-cuu-don/);

    await expect(
      page.getByRole("heading", { level: 1, name: "Tra Cứu Đơn Thuê Đồ" })
    ).toBeVisible();

    // Kiểm tra form nhập liệu
    await expect(page.getByTestId("input-booking-code")).toBeVisible();
    await expect(page.getByTestId("input-phone")).toBeVisible();
    await expect(page.getByTestId("btn-submit-tracking")).toBeVisible();

    // Kiểm tra các câu hỏi thường gặp FAQ
    await expect(page.getByText("Câu hỏi thường gặp khi tra cứu")).toBeVisible();
    await expect(
      page.getByText("Nếu tôi quên mã đơn thì phải làm sao?")
    ).toBeVisible();
  });

  test("tra cứu đơn thuê thành công và hiển thị tiến trình stepper cùng mã VietQR", async ({
    page,
  }) => {
    page.on("console", (msg) => console.log("PAGE LOG:", msg.type(), msg.text()));
    page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
    page.on("request", (req) => console.log("REQUEST:", req.method(), req.url()));
    page.on("response", (res) => console.log("RESPONSE:", res.status(), res.url()));

    // Intercept POST /api/public/bookings/tracking
    await page.route(/\/api\/public\/bookings\/tracking/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          code: 200,
          message: "Tra cứu đơn thuê thành công",
          data: {
            id: 1001,
            bookingCode: "BK20261025-ABCD",
            customerName: "Nguyễn Hải Yến",
            customerPhone: "0987654321",
            deliveryMethod: "PICKUP_STORE",
            rentalStartDate: "2026-11-01",
            rentalEndDate: "2026-11-03",
            durationDays: 3,
            status: "CONFIRMED",
            totalRentalPrice: 600000,
            totalDepositPrice: 1000000,
            totalAmount: 1600000,
            createdAt: "2026-10-25T08:00:00Z",
            items: [
              {
                id: 10,
                productName: "Váy Lụa Trắng Cổ Yếm",
                variantSize: "S",
                rentalPrice: 600000,
                depositPrice: 1000000,
              },
            ],
          },
        }),
      });
    });

    await page.goto("/tra-cuu-don");

    // Điền mã đơn và số điện thoại
    await page.getByTestId("input-booking-code").fill("BK20261025-ABCD");
    await page.getByTestId("input-phone").fill("0987654321");

    // Nhấn tra cứu
    await page.getByTestId("btn-submit-tracking").click();

    // Chờ kết quả hiển thị
    await expect(page.getByTestId("tracking-result-section")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId("tracking-timeline")).toBeVisible();
    await expect(page.getByTestId("tracking-order-card")).toBeVisible();

    // Kiểm tra nội dung mã đơn và VietQR chuyển khoản
    await expect(page.getByText("BK20261025-ABCD").first()).toBeVisible();
    await expect(page.getByText("Nguyễn Hải Yến")).toBeVisible();
    await expect(page.getByText("Chưa thanh toán cọc")).toBeVisible();
    await expect(page.getByText("MB Bank (Quân Đội)")).toBeVisible();
    await expect(page.getByText("0987654321").first()).toBeVisible();
  });

  test("tự động tra cứu khi có query params ?code=...&phone=... trên URL", async ({
    page,
  }) => {
    await page.route(/\/api\/public\/bookings\/tracking/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          code: 200,
          data: {
            id: 1002,
            bookingCode: "BK20261025-AUTO",
            customerName: "Trần Minh Châu",
            customerPhone: "0912345678",
            deliveryMethod: "PICKUP_STORE",
            rentalStartDate: "2026-11-05",
            rentalEndDate: "2026-11-06",
            durationDays: 2,
            status: "DEPOSITED",
            totalRentalPrice: 400000,
            totalDepositPrice: 500000,
            totalAmount: 900000,
            createdAt: "2026-10-25T09:00:00Z",
            items: [
              {
                id: 11,
                productName: "Máy ảnh Canon EOS R50",
                rentalPrice: 400000,
                depositPrice: 500000,
              },
            ],
          },
        }),
      });
    });

    await page.goto("/tra-cuu-don?code=BK20261025-AUTO&phone=0912345678");

    // Chờ form đồng bộ query params và tự động kích hoạt hiển thị kết quả
    await expect(page.getByTestId("tracking-result-section")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("BK20261025-AUTO").first()).toBeVisible();
    await expect(page.getByText("Đã thanh toán cọc thành công")).toBeVisible();
  });

  test("hiển thị cảnh báo lỗi khi tra cứu sai thông tin (404 Not Found)", async ({
    page,
  }) => {
    await page.route(/\/api\/public\/bookings\/tracking/, async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({
          code: 404,
          message:
            "Không tìm thấy đơn đặt thuê phù hợp. Vui lòng kiểm tra lại mã đơn và số điện thoại",
        }),
      });
    });

    await page.goto("/tra-cuu-don");

    await page.getByTestId("input-booking-code").fill("BK-UNKNOWN");
    await page.getByTestId("input-phone").fill("0999999999");
    await page.getByTestId("btn-submit-tracking").click();

    await expect(page.getByTestId("tracking-error-alert")).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByText("Không tìm thấy đơn đặt thuê phù hợp")
    ).toBeVisible();
  });
});
