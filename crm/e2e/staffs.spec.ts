import { test, expect } from "@playwright/test";

test.describe("CRM Staff Management UI Test", () => {
  test("chuyển hướng người dùng chưa đăng nhập về trang /login khi truy cập /staffs", async ({
    page,
  }) => {
    await page.goto("/staffs");
    await expect(page).toHaveURL(/\/login/);
  });
});
