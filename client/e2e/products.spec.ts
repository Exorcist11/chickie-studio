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

    // Kiểm tra bộ lọc danh mục và sắp xếp
    await expect(page.getByText("Bộ lọc tìm kiếm")).toBeVisible();

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

  test("điều hướng từ Header và lọc theo 3 mảng kinh doanh: Thuê máy ảnh, Trang phục, Dịch vụ chụp", async ({
    page,
  }) => {
    // 1. Vào trang chủ và click 'Thuê máy ảnh' trên thanh điều hướng
    await page.goto("/");
    const cameraNavLink = page.getByRole("link", { name: "Thuê máy ảnh" }).first();
    await expect(cameraNavLink).toBeVisible();
    await cameraNavLink.click();

    // Xác nhận đã chuyển hướng đến /products?type=camera
    await expect(page).toHaveURL(/.*\/products\?type=camera.*/);
    await expect(page.getByText("Tiện ích thuê máy ảnh").first()).toBeVisible();

    // Kiểm tra danh sách hiển thị máy ảnh và badge tương ứng
    await expect(page.getByText(/Sony A6400/i).first()).toBeVisible();
    await expect(page.getByText(/Canon EOS R50/i).first()).toBeVisible();
    await expect(page.getByText("Máy ảnh & Thiết bị").first()).toBeVisible();

    // 2. Chuyển sang mảng 'Dịch vụ chụp' bằng Header navigation
    const photoNavLink = page.getByRole("link", { name: "Dịch vụ chụp" }).first();
    await expect(photoNavLink).toBeVisible();
    await photoNavLink.click();

    // Xác nhận đã chuyển hướng đến /products?type=photography
    await expect(page).toHaveURL(/.*\/products\?type=photography.*/);
    await expect(page.getByText("Ưu đãi gói chụp").first()).toBeVisible();
    await expect(page.getByText("Gói Chụp Ngoại Cảnh Nàng Thơ")).toBeVisible();
    await expect(page.getByText("Gói dịch vụ chụp").first()).toBeVisible();

    // 3. Chuyển sang mảng 'Thuê trang phục' bằng Header navigation
    const costumeNavLink = page.getByRole("link", { name: "Thuê trang phục" }).first();
    await expect(costumeNavLink).toBeVisible();
    await costumeNavLink.click();

    // Xác nhận đã chuyển hướng đến /products?type=costume
    await expect(page).toHaveURL(/.*\/products\?type=costume.*/);
    await expect(page.getByText("Kích cỡ (Size)")).toBeVisible();
    await expect(page.getByText("Trang phục thiết kế").first()).toBeVisible();
  });

  test("hiển thị chi tiết sản phẩm máy ảnh theo mảng CAMERA và đặt thuê thiết bị", async ({
    page,
  }) => {
    await page.goto("/products/canon-eos-r50-lens-18-45mm");

    // Kiểm tra tiêu đề và badge của mảng máy ảnh
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Canon EOS R50");
    await expect(page.getByText("Thiết bị sẵn sàng (Đã test kỹ thuật 100%)")).toBeVisible();
    await expect(page.getByText("Thông số & Tình trạng:")).toBeVisible();
    await expect(page.getByText("Mục đích sử dụng:")).toBeVisible();
    await expect(page.getByText("Thông số kỹ thuật & Giới thiệu thiết bị")).toBeVisible();

    // Kiểm tra cam kết thiết bị
    await expect(page.getByText("Kiểm tra kỹ thuật 100% trước bàn giao")).toBeVisible();
    await expect(page.getByText("Kèm đầy đủ phụ kiện tác nghiệp")).toBeVisible();
    await expect(page.getByText("Hỗ trợ set màu máy & hướng dẫn sử dụng")).toBeVisible();

    // Kiểm tra BookingForm cho thiết bị
    await expect(page.getByText("Đặt Thuê Máy Ảnh & Thiết Bị")).toBeVisible();
    await expect(page.getByText(/Phiên bản \/ Bộ Combo:/i)).toBeVisible();

    // Điền thông tin đặt thuê và chọn ngày khả dụng trong tương lai
    await page.getByRole("textbox", { name: "Đến ngày" }).fill("2027-02-16");
    await page.getByRole("textbox", { name: "Từ ngày" }).fill("2027-02-15");
    await page.getByPlaceholder("Ví dụ: Nguyễn Quỳnh Anh").fill("Lê Hoàng Nam");
    await page.getByPlaceholder("Ví dụ: 0912 345 678").fill("0981234567");

    // Submit form
    const submitBtn = page.getByRole("button", { name: "Xác Nhận Thuê Thiết Bị" });
    await submitBtn.click();

    // Kiểm tra Modal thành công
    await expect(
      page.getByRole("heading", { name: "Đặt Thuê Thiết Bị Thành Công!" })
    ).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Lê Hoàng Nam - 0981234567")).toBeVisible();
  });

  test("tương tác với Lịch trống Availability và mở Bảng quy đổi kích cỡ (CAT-006)", async ({
    page,
  }) => {
    await page.goto("/products/dam-maxi-voan-xoe-tieu-thu");

    // 1. Kiểm tra Lịch trống trực quan xuất hiện trong BookingForm
    await expect(page.getByRole("button", { name: "Thu gọn lịch" })).toBeVisible();
    await expect(page.getByText("Còn đồ sẵn sàng")).toBeVisible();
    await expect(page.getByText("Đã kín lịch")).toBeVisible();

    // Thu gọn và mở lại lịch
    const toggleBtn = page.getByRole("button", { name: "Thu gọn lịch" });
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    await expect(page.getByRole("button", { name: "Xem lịch trống" })).toBeVisible();
    await page.getByRole("button", { name: "Xem lịch trống" }).click();
    await expect(page.getByText(/Còn đồ sẵn sàng/i)).toBeVisible();

    // 2. Mở Bảng quy đổi kích cỡ (Size Guide Modal)
    const sizeGuideBtn = page.getByRole("button", { name: /Bảng quy đổi kích cỡ/i });
    await expect(sizeGuideBtn).toBeVisible();
    await sizeGuideBtn.click();

    // Kiểm tra modal xuất hiện với bảng thông số đo 3 vòng
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hướng Dẫn Chọn Size Váy & Áo Dài" })).toBeVisible();
    await expect(page.getByText("S (Phổ biến)")).toBeVisible();
    await expect(page.getByText("Mẹo Đo Số Đo Chuẩn Xác Bằng Thước Dây")).toBeVisible();

    // Đóng modal
    const closeBtn = page.getByRole("button", { name: "Đóng modal" });
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();
  });

  test("hiển thị thanh Sticky Bottom CTA trên giao diện điện thoại (CAT-006)", async ({
    page,
  }) => {
    // Đặt viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/products/dam-maxi-voan-xoe-tieu-thu");

    // Kiểm tra Sticky Bottom CTA xuất hiện
    const stickyCta = page.getByLabel("Thanh đặt thuê nhanh di động");
    await expect(stickyCta).toBeVisible();
    await expect(stickyCta.getByRole("button", { name: "Đặt lịch ngay" })).toBeVisible();

    // Bấm 'Đặt lịch ngay' scroll đến form
    await stickyCta.getByRole("button", { name: "Đặt lịch ngay" }).click();
    await expect(page.locator("#booking-form-section")).toBeInViewport();
  });

  test("hiển thị trang hóa đơn và hướng dẫn chuyển khoản cọc /booking/success/[code] (BOK-001)", async ({
    page,
  }) => {
    await page.goto("/booking/success/BK20261025-DEMO");

    // Tiêu đề biên nhận
    await expect(
      page.getByRole("heading", { name: "Biên Nhận Giữ Đồ Chickie Studio" })
    ).toBeVisible({ timeout: 5000 });

    // Hiển thị mã đơn hàng
    await expect(page.getByText("BK20261025-DEMO", { exact: true })).toBeVisible();

    // Hướng dẫn chuyển khoản ngân hàng & mã QR
    await expect(page.getByText("Hướng Dẫn Chuyển Khoản Cọc")).toBeVisible();
    await expect(
      page.getByAltText("Mã QR chuyển khoản cọc VietQR Chickie Studio")
    ).toBeVisible();
    await expect(page.getByText("9999 8888 6666")).toBeVisible();
    await expect(page.getByText("CHICKIE STUDIO - LE THI PHUONG ANH")).toBeVisible();

    // Mở modal phóng to mã QR
    const zoomBtn = page.getByRole("button", { name: /phóng to/i });
    await expect(zoomBtn).toBeVisible();
    await zoomBtn.click();
    await expect(page.getByRole("dialog", { name: "Mã QR chuyển khoản cọc phóng to" })).toBeVisible();
    await page.getByRole("button", { name: "Đóng", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Mã QR chuyển khoản cọc phóng to" })).not.toBeVisible();

    // Nút quay lại xem đồ
    const continueBtn = page.getByRole("button", { name: "Tiếp tục xem đồ" });
    await expect(continueBtn).toBeVisible();
  });
});


