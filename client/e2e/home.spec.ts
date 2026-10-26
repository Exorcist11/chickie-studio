import { test, expect } from "@playwright/test";

test.describe("Client Home Page UI Test", () => {
  test("hiển thị đúng tiêu đề, Hero section và các danh mục sản phẩm", async ({ page }) => {
    await page.goto("/");

    // Kiểm tra Hero Section
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Chickie Studio • More than just a dress")).toBeVisible();

    // Kiểm tra Danh mục sản phẩm
    await expect(page.getByRole("heading", { name: "Danh Mục Sản Phẩm" })).toBeVisible();

    // Kiểm tra Footer
    await expect(page.locator("footer")).toBeVisible();
  });

  test("điều hướng đến trang danh sách sản phẩm khi bấm nút Khám phá bộ sưu tập", async ({ page }) => {
    await page.goto("/");
    const exploreBtn = page.getByRole("link", { name: /Khám phá bộ sưu tập/i });
    await expect(exploreBtn).toBeVisible();
    await exploreBtn.click();
    await expect(page).toHaveURL(/\/products/);
  });

  test("hiển thị quy trình 4 bước thuê đồ và các nút liên hệ nổi Zalo / Hotline", async ({ page }) => {
    await page.goto("/");

    // Kiểm tra quy trình 4 bước thuê đồ
    await expect(page.getByRole("heading", { name: "Quy Trình Thuê Đồ Đơn Giản" })).toBeVisible();
    await expect(page.getByText("Chọn mẫu & size")).toBeVisible();
    await expect(page.getByText("Đặt cọc giữ đồ")).toBeVisible();
    await expect(page.getByText("Nhận đồ xinh")).toBeVisible();
    await expect(page.getByText("Trả đồ & hoàn cọc")).toBeVisible();

    // Kiểm tra floating contact buttons
    const hotlineBtn = page.getByRole("link", { name: /Gọi hotline tư vấn trực tiếp/i });
    await expect(hotlineBtn).toBeVisible();

    const zaloBtn = page.getByRole("link", { name: /Nhắn tin tư vấn trực tiếp qua Zalo/i });
    await expect(zaloBtn).toBeVisible();
  });

  test("áp dụng đúng bộ font tiếng Việt (Lora cho Serif và Be Vietnam Pro cho Sans)", async ({ page }) => {
    await page.goto("/");

    const fontStyles = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const body = document.body;
      return {
        h1Font: h1 ? window.getComputedStyle(h1).fontFamily : "",
        bodyFont: window.getComputedStyle(body).fontFamily,
      };
    });

    // Tiêu đề h1 sử dụng font Serif Lora
    expect(fontStyles.h1Font.toLowerCase()).toContain("lora");

    // Thân trang body sử dụng Be Vietnam Pro
    expect(fontStyles.bodyFont.toLowerCase()).toContain("be vietnam pro");
  });

  test("hiển thị thanh tiến trình loading và điều hướng mượt mà khi click menu", async ({ page }) => {
    await page.goto("/");

    // Thanh progress bar tồn tại trong DOM
    const progressBar = page.getByRole("progressbar");
    await expect(progressBar).toBeAttached();

    // Click vào menu Thuê máy ảnh
    const cameraMenuLink = page
      .getByRole("navigation", { name: "Menu chính" })
      .getByRole("link", { name: /Thuê máy ảnh/i });
    await expect(cameraMenuLink).toBeVisible();

    // Click chuyển menu
    await cameraMenuLink.click();

    // URL chuyển sang trang products với type=camera hoặc semantic route thue-may-anh
    await expect(page).toHaveURL(/(products\?type=camera|thue-may-anh)/);
  });
});
