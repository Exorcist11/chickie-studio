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

  test("điều hướng đến trang Showcase UI Components khi bấm nút Xem Design System UI", async ({ page }) => {
    await page.goto("/");
    const showcaseBtn = page.getByRole("link", { name: "Xem Design System UI" });
    await expect(showcaseBtn).toBeVisible();
    await showcaseBtn.click();
    await expect(page).toHaveURL(/\/dev\/components/);
  });
});
