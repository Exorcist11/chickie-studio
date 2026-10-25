# Đặc Tả Tính Năng: Các Trang Tĩnh Chính Sách, FAQ, Giới Thiệu & Liên Hệ

| Thuộc tính | Giá trị |
|---|---|
| **ID** | `CNT-002` |
| **Tên tính năng** | Các trang thông tin tĩnh: Chính sách thuê đồ, FAQ, Giới thiệu và Liên hệ |
| **Module** | CNT (Content & SEO) |
| **Phạm vi** | CLIENT |
| **Ưu tiên** | P0 - MVP |
| **Trạng thái** | ✅ DONE |
| **Người phụ trách** | Fullstack Dev & UI/UX Specialist |
| **Ngày bắt đầu** | 2026-10-25 |
| **Ngày hoàn thành** | 2026-10-25 |
| **Phụ thuộc** | `CNT-007` |

---

## 1. Mục Tiêu và Giá Trị Mang Lại
Cung cấp minh bạch và đầy đủ các điều khoản dịch vụ cho thuê đồ tại Chickie Studio: chính sách đặt cọc, đền bù hư hại, hướng dẫn giữ gìn váy áo, giải đáp thắc mắc thường gặp (FAQ) và bản đồ chỉ đường tới tiệm. Giúp khách hàng yên tâm, tránh tranh cãi về sau khi trả đồ và tăng độ tin cậy của thương hiệu.

## 2. Người Dùng Liên Quan
- [x] **Khách hàng**: Đọc kỹ quy định trước khi đặt cọc, tìm đường đến tiệm thử đồ, xem hướng dẫn xử lý khi lỡ làm dính bẩn váy.

## 3. Danh Mục Các Trang Tĩnh Cần Triển Khai
1. **`/chinh-sach-thue-do` (Rental Policy)**:
   - **Quy định đặt cọc**: Cọc tiền mặt/chuyển khoản từ 50% - 100% giá trị đồ hoặc để lại giấy tờ tùy thân (CCCD/thẻ sinh viên).
   - **Quy định bảo quản**: Không tự ý giặt tẩy bằng máy giặt gia đình; không xịt nước hoa trực tiếp lên lụa/tơ; tránh tàn thuốc lá.
   - **Quy định trễ hạn**: Trả muộn dưới 3 tiếng tính phụ phí theo giờ; quá 3 tiếng tính thêm 1 ngày thuê.
   - **Xử lý hư hại**: Bảng giá đền bù minh bạch khi bung cúc, sờn chỉ, rách vải hoặc dính vết ố không tẩy được.
2. **`/faq` (Câu hỏi thường gặp)**:
   - Dạng Accordion đóng/mở tiện lợi (Cách đặt đồ? Có ship COD không? Có được đến thử đồ không?).
3. **`/gioi-thieu` (About Us)**:
   - Câu chuyện Chickie Studio: tiệm cho thuê váy thiết kế, áo dài trẻ trung tại Hà Nội.
4. **`/lien-he` (Contact)**:
   - Địa chỉ showroom, giờ làm việc (08:30 - 21:30 hàng ngày), bản đồ Google Maps tương tác, hotline, form gửi lời nhắn.

```mermaid
flowchart LR
    A[Khách truy cập Footer/Menu] --> B[/chinh-sach-thue-do]
    A --> C[/faq]
    A --> D[/gioi-thieu]
    A --> E[/lien-he]
```

## 4. Quy Tắc Nghiệp Vụ
- **BR-01**: Các trang này được cấu hình **Static Site Generation (SSG)** của Next.js để tải ngay lập tức (<100ms) và tối ưu điểm SEO.
- **BR-02**: Mọi nội dung câu chữ phải được hỗ trợ song ngữ (Tiếng Việt và Tiếng Anh).

## 5. Giao Diện & Đa Ngôn Ngữ (UI & i18n)
- **Màn hình**: Typography chuẩn văn bản đọc dễ nhìn, mục lục liên kết nhanh (Anchor links), bảng biểu so sánh rõ ràng.
- **Component dùng chung**: `Accordion`, `Breadcrumb`, `GoogleMapEmbed`, `Card`.
- **Keys i18n (`vi.json` / `en.json`)**:
```json
{
  "policy": {
    "title": "Chính Sách Cho Thuê & Đặt Cọc",
    "depositSection": "Quy Định Đặt Cọc",
    "damageSection": "Quy Định Xử Lý Hư Hại & Trễ Hạn",
    "faqTitle": "Câu Hỏi Thường Gặp",
    "contactTitle": "Liên Hệ & Ghé Thăm Chickie Studio",
    "openingHours": "Giờ mở cửa: 08:30 - 21:30 (Thứ 2 - Chủ Nhật)"
  }
}
```

## 6. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
- [x] **Kịch bản 1 - Xem FAQ**:
  - **Given**: Khách hàng bấm vào trang `/faq`.
  - **When**: Nhấn vào câu hỏi "Có cần giặt đồ trước khi trả không?".
  - **Then**: Câu trả lời mở ra mượt mà: "Không cần, Chickie Studio đã bao gồm phí giặt hấp chuyên nghiệp".
- [x] **Kịch bản 2 - Bản đồ chỉ đường**:
  - **Given**: Khách vào trang `/lien-he`.
  - **When**: Bấm vào nút "Xem đường đi" / "Mở ứng dụng Google Maps".
  - **Then**: Chuyển hướng chính xác sang Google Maps trỏ đến địa chỉ của Chickie Studio tại Hà Nội.

## 7. Kế Hoạch Test
- **UI Test**: Test render đầy đủ nội dung các trang, kiểm tra hoạt động đóng mở của component Accordion, lọc category và tìm kiếm FAQ.
- **Mục tiêu Coverage**: $\ge 80\%$ (Đạt 100% test pass).

## 8. Checklist Hoàn Thành (Definition of Done)
- [x] Render tĩnh SSG hoàn toàn, không phụ thuộc API động.
- [x] Đầy đủ key đa ngôn ngữ cho toàn bộ nội dung tĩnh trong cả `vi.json` và `en.json`.
- [x] Metadata title/description chuẩn SEO cho từng trang.
- [x] Test coverage $\ge 80\%$ (354/354 unit tests pass, 4/4 Playwright E2E tests pass 100%).
- [x] Cập nhật `docs/FEATURES.md` và `docs/CHANGELOG.md`.

## 9. Nhật Ký Thực Hiện
| Ngày | Người thực hiện | Nội dung thay đổi | Trạng thái mới |
|---|---|---|---|
| 2026-10-25 | Fullstack Dev & UI/UX Specialist | Hoàn thành toàn diện: Bộ component Accordion & Breadcrumbs; 4 routes tĩnh SSG (/chinh-sach-thue-do, /faq, /gioi-thieu, /lien-he); bộ từ điển song ngữ; 354 unit tests pass & 4/4 Playwright E2E tests pass 100% | ✅ DONE |
| 2026-10-24 | Tech Lead | Soạn thảo tài liệu đặc tả ban đầu | 📝 SPEC |
