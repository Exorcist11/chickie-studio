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
});
