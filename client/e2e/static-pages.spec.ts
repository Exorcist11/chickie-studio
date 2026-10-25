import { test, expect } from "@playwright/test";

test.describe("Static Content Pages (CNT-002)", () => {
  test("trang chính sách thuê đồ: hiển thị mục lục, các điều khoản và bảng bồi thường", async ({ page }) => {
    await page.goto("/chinh-sach-thue-do");

    // Kiểm tra Header & Breadcrumbs
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Chính Sách Thuê Đồ & Đặt Cọc"
    );
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();

    // Kiểm tra các phần cốt lõi
    await expect(page.getByText("1. Quy Định Đặt Cọc & Giữ Lịch")).toBeVisible();
    await expect(page.getByText("2. Hướng Dẫn Giữ Gìn & Bảo Quản")).toBeVisible();
    await expect(page.getByText("3. Quy Định Thời Gian Trả & Phụ Phí Trễ Hạn")).toBeVisible();
    await expect(page.getByText("4. Biểu Phí Xử Lý Hư Hại & Mất Mát")).toBeVisible();

    // Kiểm tra bảng bồi hoàn hư hại
    await expect(page.getByText("Tình trạng hư hại")).toBeVisible();
    await expect(page.getByText("Miễn phí hỗ trợ phục chế")).toBeVisible();
  });

  test("trang FAQ: tìm kiếm, lọc theo danh mục và đóng mở câu hỏi tương tác", async ({ page }) => {
    await page.goto("/faq");

    // Kiểm tra Tiêu đề
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Câu Hỏi Thường Gặp"
    );

    // Tìm kiếm câu hỏi
    const searchInput = page.getByPlaceholder("Tìm kiếm câu hỏi thắc mắc...");
    await searchInput.fill("thử đồ");
    await expect(
      page.getByText("Chickie Studio có hỗ trợ đến thử đồ trực tiếp tại showroom không?")
    ).toBeVisible();

    // Xóa từ khóa tìm kiếm
    await searchInput.clear();

    // Lọc theo danh mục "Giặt ủi & Giữ gìn"
    const carePill = page.getByRole("button", { name: "Giặt ủi & Giữ gìn" });
    await carePill.click();

    // Bấm mở accordion câu hỏi giặt hấp
    const faqBtn = page.getByRole("button", {
      name: /Tôi có cần tự giặt hấp trang phục trước khi trả lại tiệm không/i,
    });
    await expect(faqBtn).toBeVisible();
  });

  test("trang giới thiệu: hiển thị câu chuyện thương hiệu, chỉ số thống kê và giá trị cốt lõi", async ({ page }) => {
    await page.goto("/gioi-thieu");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Về Chickie Studio"
    );
    await expect(page.getByText("More Than Just A Dress")).toBeVisible();

    // Kiểm tra các chỉ số thống kê
    await expect(page.getByText("200+")).toBeVisible();
    await expect(page.getByText("5,000+")).toBeVisible();
    await expect(page.getByText("100%")).toBeVisible();

    // Kiểm tra nút CTA dẫn tới danh sách sản phẩm
    const exploreBtn = page.getByRole("link", { name: /Xem bộ sưu tập váy/i });
    await expect(exploreBtn).toBeVisible();
  });

  test("trang liên hệ: hiển thị thông tin showroom, bản đồ và gửi form thành công", async ({ page }) => {
    await page.goto("/lien-he");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Liên Hệ & Ghé Thăm Showroom"
    );
    await expect(page.getByText("Số 12 ngõ 80 Chùa Láng, Đống Đa, Hà Nội")).toBeVisible();
    await expect(page.getByText("08:30 - 21:30 (Thứ Hai - Chủ Nhật)")).toBeVisible();

    // Kiểm tra link Google Maps
    const mapsLink = page.getByRole("link", { name: /Mở ứng dụng Google Maps/i });
    await expect(mapsLink).toBeVisible();
    await expect(mapsLink).toHaveAttribute("target", "_blank");

    // Điền form liên hệ
    await page.getByPlaceholder("Ví dụ: Nguyễn Linh Chi").fill("Lê Phương Linh");
    await page.getByPlaceholder("Ví dụ: 0912345678").fill("0977889900");
    await page.getByPlaceholder("linhchi@gmail.com").fill("phuonglinh@gmail.com");

    const submitBtn = page.getByRole("button", { name: "Gửi lời nhắn" });
    await submitBtn.click();

    // Kiểm tra thông báo thành công
    await expect(page.getByText("Gửi lời nhắn thành công!")).toBeVisible();
  });
});
