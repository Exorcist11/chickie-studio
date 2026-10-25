import { test, expect } from "@playwright/test";

test.describe("Client Internationalization (i18n) E2E Tests (CNT-007)", () => {
  test("chuyển đổi ngôn ngữ từ VI sang EN qua LanguageSwitcher trên Header", async ({
    page,
  }) => {
    // 1. Truy cập trang chủ tiếng Việt
    await page.goto("/vi");
    await expect(page).toHaveURL(/\/vi$/);

    // Kiểm tra html lang="vi"
    const htmlLang = await page.locator("html").getAttribute("lang");
    expect(htmlLang).toBe("vi");

    // Kiểm tra menu tiếng Việt
    await expect(
      page.getByRole("link", { name: "Thuê trang phục" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Thuê máy ảnh" }).first()
    ).toBeVisible();

    // 2. Nhấn nút chuyển đổi sang English (EN) trên Header
    await page.waitForLoadState("networkidle");
    const enButton = page
      .getByRole("radio", { name: /Switch to English/i })
      .first();
    await expect(enButton).toBeVisible();
    await enButton.click();


    // 3. Kiểm tra URL đã chuyển sang /en
    await expect(page).toHaveURL(/\/en$/);

    // Kiểm tra html lang="en" cho SEO bot
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // Kiểm tra menu đã chuyển ngữ sang Tiếng Anh
    await expect(
      page.getByRole("link", { name: "Rent Costumes" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Rent Cameras" }).first()
    ).toBeVisible();
  });

  test("chuyển đổi ngôn ngữ từ EN về lại VI", async ({ page }) => {
    // 1. Truy cập thẳng trang tiếng Anh
    await page.goto("/en/chinh-sach-thue-do");
    await expect(page).toHaveURL(/\/en\/chinh-sach-thue-do/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // 2. Nhấn nút chuyển đổi về Tiếng Việt
    const viButton = page
      .getByRole("radio", { name: /Chuyển sang Tiếng Việt/i })
      .first();
    await expect(viButton).toBeVisible();
    await viButton.click();

    // 3. Kiểm tra URL quay về /vi/... và html lang="vi"
    await expect(page).toHaveURL(/\/vi\/chinh-sach-thue-do/);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  test("tự động điều hướng locale không hợp lệ /fr/products về /vi/products", async ({
    page,
  }) => {
    await page.goto("/fr/products");

    // Middleware tự động chuyển hướng về /vi/products
    await expect(page).toHaveURL(/\/vi\/products/);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  test("sử dụng LanguageSwitcher tại Footer để đổi ngôn ngữ", async ({ page }) => {
    await page.goto("/vi/faq");

    // Tìm LanguageSwitcher ở footer
    const footerSwitcher = page.locator("footer").getByRole("radiogroup", {
      name: "Chọn ngôn ngữ",
    });
    await expect(footerSwitcher).toBeVisible();

    const enFooterBtn = footerSwitcher.getByRole("radio", { name: "English" });
    await enFooterBtn.click();

    await expect(page).toHaveURL(/\/en\/faq/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});
