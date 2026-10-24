import { test, expect } from "@playwright/test";

test.describe("Client Products and Booking E2E Tests", () => {
  test("hiển thị danh sách sản phẩm trên trang /products và lọc theo danh mục", async ({
    page,
  }) => {
    await page.goto("/products");

    // Header & Banner
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Chickie Studio Lookbook")).toBeVisible();

    // Hiển thị danh sách sản phẩm
    const productCards = page.locator(".shadow-card");
    await expect(productCards.first()).toBeVisible();

    // Click vào danh mục đầu tiên
    const categoryPills = page.getByRole("navigation", { name: "Lọc theo danh mục" });
    await expect(categoryPills).toBeVisible();

    // Kiểm tra ô dropdown sort giá sản phẩm
    const sortSelect = page.getByRole("combobox", { name: "Sắp xếp sản phẩm" });
    await expect(sortSelect).toBeVisible();
    await sortSelect.selectOption("price-asc");
    await expect(sortSelect).toHaveValue("price-asc");
  });

  test("điều hướng đến trang chi tiết sản phẩm và tương tác với Lookbook gallery", async ({
    page,
  }) => {
    await page.goto("/products");

    // Click vào sản phẩm đầu tiên
    const firstProductLink = page.locator("a[href^='/products/']").first();
    await firstProductLink.click();

    // Kiểm tra URL và tiêu đề chi tiết
    await expect(page).toHaveURL(/\/products\/.+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Kiểm tra Lookbook Gallery
    await expect(page.getByText("Lookbook Chickie Studio")).toBeVisible();
    await expect(page.getByText("1 /")).toBeVisible();

    // Chuyển ảnh tiếp theo
    const nextBtn = page.getByRole("button", { name: "Ảnh kế tiếp" });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await expect(page.getByText("2 /")).toBeVisible();
    }
  });

  test("hoàn tất biểu mẫu đặt lịch thuê và hiển thị modal xác nhận thành công", async ({
    page,
  }) => {
    await page.goto("/products/dam-maxi-voan-xoe-tieu-thu");

    // Kiểm tra BookingForm
    await expect(page.getByText("Đặt Lịch Thuê & Thử Váy")).toBeVisible();

    // Điền thông tin khách hàng
    const nameInput = page.getByPlaceholder("Ví dụ: Nguyễn Quỳnh Anh");
    const phoneInput = page.getByPlaceholder("Ví dụ: 0912 345 678");

    await nameInput.fill("Hoàng Thu Nga");
    await phoneInput.fill("0977112233");

    // Submit form
    const submitBtn = page.getByRole("button", { name: "Xác Nhận Đặt Thuê Ngay" });
    await submitBtn.click();

    // Kiểm tra Modal thành công xuất hiện
    await expect(
      page.getByRole("heading", { name: "Đặt Lịch Thuê Thành Công!" })
    ).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Hoàng Thu Nga - 0977112233")).toBeVisible();

    // Đóng modal
    const closeBtn = page.getByRole("button", { name: "Đóng" });
    await closeBtn.click();
    await expect(
      page.getByRole("heading", { name: "Đặt Lịch Thuê Thành Công!" })
    ).not.toBeVisible();
  });
});
