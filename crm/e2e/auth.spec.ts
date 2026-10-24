import { test, expect } from "@playwright/test";

test.describe("CRM Authentication & Navigation UI Test", () => {
  test("chuyển hướng người dùng chưa đăng nhập về trang /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("hiển thị đầy đủ form đăng nhập với các trường thông tin cần thiết", async ({ page }) => {
    await page.goto("/login");

    // Kiểm tra tiêu đề trang đăng nhập
    await expect(page.getByRole("heading", { level: 3 })).toBeVisible();

    // Kiểm tra input tên đăng nhập và mật khẩu
    const usernameInput = page.locator("#username");
    const passwordInput = page.locator("#password");
    const submitBtn = page.getByRole("button", { name: /đăng nhập/i });

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });

  test("hiển thị lỗi validate khi submit form rỗng", async ({ page }) => {
    await page.goto("/login");

    const submitBtn = page.getByRole("button", { name: /đăng nhập/i });
    await submitBtn.click();

    // Hiển thị thông báo lỗi validate Zod
    await expect(page.getByText(/Vui lòng nhập tên đăng nhập hoặc email/i)).toBeVisible();
  });
});
