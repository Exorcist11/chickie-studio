# Đặc Tả Tính Năng: Thống Kê Sản Phẩm Thuê Nhiều & Tỷ Lệ Sử Dụng Kho Đồ

| Thuộc tính | Giá trị |
|---|---|
| **ID** | `RPT-003` |
| **Tên tính năng** | Báo cáo thống kê sản phẩm đắt khách (Top Rented) & Hiệu suất khai thác kho đồ (Asset Utilization) |
| **Module** | RPT (Dashboard & Báo Cáo) |
| **Phạm vi** | CRM, SERVER |
| **Ưu tiên** | P2 - Tối ưu hóa đầu tư & Tồn kho |
| **Trạng thái** | 📝 SPEC |
| **Người phụ trách** | Fullstack Dev & Tech Lead |
| **Ngày bắt đầu** | 2026-10-25 |
| **Ngày hoàn thành** | 2026-10-25 |
| **Phụ thuộc** | `CAT-003`, `BOK-003`, `RPT-002` |

---

## Mục Lục
1. [Mục Tiêu và Giá Trị Mang Lại](#1-mục-tiêu-và-giá-trị-mang-lại)
2. [Người Dùng Liên Quan](#2-người-dùng-liên-quan)
3. [Luồng Nghiệp Vụ Chính (Happy Path)](#3-luồng-nghiệp-vụ-chính-happy-path)
4. [Luồng Ngoại Lệ và Trường Hợp Biên](#4-luồng-ngoại-lệ-và-trường-hợp-biên)
5. [Quy Tắc Nghiệp Vụ (Business Rules)](#5-quy-tắc-nghiệp-vụ-business-rules)
6. [Giao Diện & Đa Ngôn Ngữ (UI & i18n)](#6-giao-diện--đa-ngôn-ngữ-ui--i18n)
7. [Đặc Tả API Backend](#7-đặc-tả-api-backend)
8. [Thay Đổi Cơ Sở Dữ Liệu](#8-thay-đổi-cơ-sở-dữ-liệu)
9. [Tiêu Chí Nghiệm Thu (Acceptance Criteria)](#9-tiêu-chí-nghiệm-thu-acceptance-criteria)
10. [Kế Hoạch Kiểm Thử](#10-kế-hoạch-kiểm-thử)
11. [Checklist Hoàn Thành (Definition of Done)](#11-checklist-hoàn-thành-definition-of-done)

---

## 1. Mục Tiêu và Giá Trị Mang Lại
- **Nhận diện các mẫu trang phục "Hot-trend"**: Báo cáo top 10 mẫu váy và thiết bị có số lượt thuê cao nhất và mang lại doanh thu lớn nhất trong tháng, giúp chủ tiệm quyết định đặt may thêm số lượng hoặc bổ sung size.
- **Phát hiện đồ tồn đọng "chết vốn" (Dead Stock)**: Thống kê những mẫu trang phục trong 30 - 60 ngày không có lượt thuê nào để tiệm tổ chức chương trình giảm giá thanh lý hoặc chụp lại ảnh lookbook để quảng bá.
- **Đo lường tỷ lệ khai thác kho (Asset Utilization Rate)**:
  $$\text{Tỷ lệ khai thác} = \frac{\text{Số ngày đồ được thuê thực tế}}{\text{Tổng số ngày trong tháng} \times \text{Tổng số đồ trong kho}} \times 100\%$$

---

## 2. Người Dùng Liên Quan
- [x] **Admin (Chủ tiệm)**: Ra quyết định nhập thêm hàng, thanh lý mẫu cũ và lên kế hoạch marketing thúc đẩy các mẫu đồ ế.

---

## 3. Luồng Nghiệp Vụ Chính (Happy Path)

```mermaid
flowchart TD
    A[Admin mở trang Báo Cáo Hiệu Suất Kho] --> B[Chọn dải ngày Tháng 10/2026]
    B --> C[Khối 1: Bảng Xếp Hạng Top 10 Sản Phẩm Hot Nhất]
    C --> C1[Tên mẫu, Lượt thuê, Doanh thu mang lại, Tỷ lệ lấp đầy lịch]
    
    B --> D[Khối 2: Danh Sách Sản Phẩm Không Có Lượt Thuê (Deadstock)]
    D --> D1[Gợi ý: Thanh lý đồ cũ hoặc giảm giá kích cầu]

    B --> E[Khối 3: Biểu Đồ Tỷ Lệ Sử Dụng Kho Theo Danh Mục]
    E --> E1[Váy dạ hội: 85% lấp đầy / Áo dài: 92% / Phụ kiện: 45%]
```

---

## 4. Luồng Ngoại Lệ và Trường Hợp Biên
- **Đồ mới nhập kho dưới 7 ngày**: Không bị tính vào danh sách đồ "chết vốn".

---

## 5. Quy Tắc Nghiệp Vụ (Business Rules)
- **BR-01**: Lượt thuê được tính dựa trên số lượng `booking_items` của đơn hàng đã chuyển sang `DELIVERED` hoặc `COMPLETED`.
- **BR-02**: Báo cáo chỉ khả dụng cho tài khoản có quyền `ROLE_ADMIN`.

---

## 6. Giao Diện & Đa Ngôn Ngữ (UI & i18n)
- **Màn hình**: Trang `/reports/inventory` trên CRM với bảng Top 10, biểu đồ tròn phân bổ danh mục và danh sách cảnh báo tồn đọng.
- **Keys i18n**: Namespace `inventoryReport.*`.

---

## 7. Đặc Tả API Backend
- `GET /api/admin/reports/top-products?startDate=...&endDate=...&limit=10`: Top sản phẩm thuê nhiều.
- `GET /api/admin/reports/warehouse-utilization?startDate=...&endDate=...`: Tỷ lệ sử dụng kho.
- `GET /api/admin/reports/dead-stock?inactiveDays=30`: Danh sách mẫu đồ không có khách thuê.

---

## 8. Thay Đổi Cơ Sở Dữ Liệu
- Tận dụng `product_items.rental_count` và bảng `booking_items` để tổng hợp số liệu tốc độ cao.

---

## 9. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
- **Given**: Tháng 10 có mẫu Váy Dạ Hội Đỏ thuê 15 lần, Áo Dài thuê 8 lần.
- **When**: Xem báo cáo Top sản phẩm.
- **Then**: Váy Dạ Hội Đỏ xếp vị trí số 1 kèm doanh thu chi tiết.

---

## 10. Kế Hoạch Kiểm Thử
- **Unit Test**: `InventoryReportServiceTest`.
- **Coverage**: $\ge 85\%$.

---

## 11. Checklist Hoàn Thành (Definition of Done)
- [ ] Tài liệu đặc tả `RPT-003` hoàn thành.
- [ ] Cập nhật `FEATURES.md` và `CHANGELOG.md`.
