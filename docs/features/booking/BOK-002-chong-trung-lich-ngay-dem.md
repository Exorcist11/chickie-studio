# Đặc Tả Tính Năng: Thuật Toán Chống Trùng Lịch & Ngày Đệm Giặt Ủi

| Thuộc tính | Giá trị |
|---|---|
| **ID** | `BOK-002` |
| **Tên tính năng** | Thuật toán chống trùng lịch & Cấu hình ngày đệm giặt ủi (Concurrency Safe) |
| **Module** | BOK (Booking) |
| **Phạm vi** | SERVER |
| **Ưu tiên** | P0 - MVP (Nghiệp vụ cốt lõi) |
| **Trạng thái** | ✅ DONE |
| **Người phụ trách** | Fullstack Dev & Tech Lead |
| **Ngày bắt đầu** | 2026-10-25 |
| **Ngày hoàn thành** | 2026-10-25 |
| **Phụ thuộc** | `CAT-003`, `BOK-001` |

---

## 1. Mục Tiêu và Giá Trị Mang Lại
Giải quyết triệt để vấn đề nhức nhối nhất của cửa hàng cho thuê đồ thủ công: tình trạng "trùng lịch" (hai khách cùng thuê một chiếc váy cùng ngày) và tình trạng "cháy đồ" do không kịp giặt ủi/kiểm tra sau khi khách trước trả. Thuật toán tự động cộng thêm số ngày đệm giặt ủi và khóa an toàn giao dịch đồng thời (Pessimistic Lock) ở tầng database.

## 2. Người Dùng Liên Quan
- [x] **Khách hàng**: Đảm bảo 100% mẫu đồ mình đặt sẽ sẵn sàng, sạch sẽ, không bị hủy đột ngột do trùng lịch.
- [x] **Nhân viên cửa hàng**: Luôn có đủ thời gian giặt hấp, là ủi váy phẳng phiu trước khi giao cho khách tiếp theo.

## 3. Luồng Chính (Happy Path)
1. Khách hàng gửi yêu cầu đặt thuê biến thể váy (ví dụ: Size S) từ ngày $D_{start}$ đến ngày $D_{end}$.
2. Hệ thống lấy cấu hình ngày đệm giặt ủi (ví dụ: `bufferDays = 1` ngày sau khi trả).
3. Khoảng thời gian thực tế chiếc váy bị chiếm giữ:
   $$\text{Blocked Interval} = [D_{start}, D_{end} + \text{bufferDays}]$$
4. Server bắt đầu một Transaction (`@Transactional`):
   - Truy vấn danh sách các `product_items` thuộc biến thể đó với khóa độc quyền:
     `SELECT p FROM ProductItem p WHERE p.variant.id = :variantId AND p.status = 'AVAILABLE' FOR UPDATE`
   - Kiểm tra trong bảng `booking_items` xem chiếc nào KHÔNG giao thoa (overlap) với bất kỳ đơn nào chưa bị hủy:
     $$\text{Overlap Condition: } (Start_A \le End_B) \land (End_A \ge Start_B)$$
5. Gán chiếc váy vật lý thỏa mãn đầu tiên cho đơn mới.
6. Lưu chi tiết đơn và hoàn tất Transaction, nhả khóa an toàn.

```mermaid
flowchart TD
    A[Bắt đầu đặt đơn với khoảng thời gian [Start, End]] --> B[Lấy cấu hình bufferDays = 1 ngày]
    B --> C[Khoảng chiếm dụng = [Start, End + 1]]
    C --> D[Pessimistic Write Lock danh sách product_items]
    D --> E{Còn món đồ nào không bị trùng lịch?}
    E -- Còn đồ khả dụng --> F[Gán item_id vào đơn hàng]
    F --> G[Tạo booking_item & Commit Transaction]
    G --> H[201 Created Thành công]
    E -- Tất cả đều trùng --> I[Rollback Transaction]
    I --> J[Ném ConflictException: Đã kín lịch]
```

## 4. Luồng Ngoại Lệ và Trường Hợp Biên
- **Tranh chấp đồng thời (High Concurrency / Race Condition)**: 2 khách hàng cùng gửi đơn cho chiếc váy duy nhất tại cùng một mili-giây. Do có Pessimistic Write Lock, request thứ hai phải đợi request thứ nhất commit xong. Khi request thứ hai đọc lại dữ liệu, phát hiện đồ đã bị giữ và nhận lỗi `409 Conflict`, đảm bảo không bao giờ bị đè lịch (Zero Double-Booking).
- **Đơn bị hủy (`CANCELLED`)**: Khoảng thời gian của đơn bị hủy ngay lập tức được giải phóng, người khác có thể đặt ngay.

## 5. Quy Tắc Nghiệp Vụ
- **BR-01**: Cấu hình `bufferDays` mặc định là 1 ngày đối với trang phục (váy, áo dài) để giặt hấp sấy, và 0 ngày đối với máy ảnh (chỉ cần kiểm tra pin, thẻ nhớ).
- **BR-02**: Mọi đơn có trạng thái `PENDING`, `CONFIRMED`, `DEPOSITED`, `DELIVERED` đều được tính là đang giữ lịch. Chỉ trạng thái `CANCELLED` và `COMPLETED` (sau ngày trả) mới không chiếm lịch.

## 6. Giao Diện & Đa Ngôn Ngữ (UI & i18n)
- **Màn hình**: Hiển thị trên màn hình lịch khả dụng và thông báo lỗi xung đột nếu bị trùng lịch.
- **Keys i18n (`vi.json` / `en.json`)**:
```json
{
  "bookingError": {
    "slotUnavailable": "Rất tiếc, sản phẩm này vừa có người đặt trong khoảng thời gian đã chọn (bao gồm thời gian giặt ủi đồ). Vui lòng chọn ngày khác."
  }
}
```

## 7. Đặc Tả API
- Tích hợp nội bộ trong logic của `POST /api/public/bookings` và `POST /api/admin/bookings`.

## 8. Thay Đổi Cơ Sở Dữ Liệu
- Sử dụng hàm truy vấn với Pessimistic Lock trong `ProductItemRepository`:
```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT p FROM ProductItem p WHERE p.variant.id = :variantId " +
       "AND p.status NOT IN (com.chickiestudio.product.entity.ProductItemStatus.RETIRED, com.chickiestudio.product.entity.ProductItemStatus.MAINTENANCE) " +
       "ORDER BY p.id ASC")
List<ProductItem> findActiveItemsForUpdate(@Param("variantId") Long variantId);

@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT p FROM ProductItem p WHERE p.variant.id = :variantId AND p.status = com.chickiestudio.product.entity.ProductItemStatus.AVAILABLE ORDER BY p.id ASC")
List<ProductItem> findAvailableItemsForUpdate(@Param("variantId") Long variantId);
```

## 9. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
- [x] **Kịch bản 1 - Tính ngày đệm giặt ủi**:
  - **Given**: Khách A thuê váy từ 10/11 đến 11/11, ngày đệm 1 ngày (đến hết 12/11).
  - **When**: Khách B muốn thuê cùng chiếc váy đó vào ngày 12/11.
  - **Then**: Hệ thống báo ngày 12/11 không khả dụng vì đang trong thời gian giặt ủi.
- [x] **Kịch bản 2 - Kiểm thử tải đồng thời (Concurrency Test)**:
  - **Given**: Biến thể chỉ còn đúng 1 chiếc duy nhất.
  - **When**: Bắn đồng thời các requests đặt cùng 1 ngày mô phỏng tranh chấp Race condition.
  - **Then**: Chỉ duy nhất 1 request thành công (201 Created), request còn lại nhận lỗi 409 Conflict ("đã kín lịch"). Không có bất kỳ bản ghi trùng lịch nào trong DB.

## 10. Kế Hoạch Test
- **Unit Test**: Test logic overlap giữa các cặp ngày $[Start_1, End_1]$ và $[Start_2, End_2]$ có cộng `bufferDays` (`bok002_isIntervalOverlappingWithBuffer_Scenarios`).
- **Concurrency Integration Test**: Mô phỏng bắn song song nhiều request kiểm chứng khóa dòng (`bok002_concurrencyRaceCondition_OnlyOneSucceeds`).
- **Mục tiêu Coverage**: $\ge 85\%$ (Đạt 100% test pass).

## 11. Checklist Hoàn Thành (Definition of Done)
- [x] Thuật toán an toàn tuyệt đối trước Race condition bằng `@Lock(LockModeType.PESSIMISTIC_WRITE)`.
- [x] Cấu hình `bufferDays` linh hoạt theo danh mục (`COSTUME` = 1, `CAMERA` / `PHOTOGRAPHY` = 0).
- [x] Test kịch bản chống trùng lịch & tranh chấp đồng thời chạy pass 100%.
- [x] Cập nhật `docs/FEATURES.md` và `docs/CHANGELOG.md`.

## 12. Nhật Ký Thực Hiện
| Ngày | Người thực hiện | Nội dung thay đổi | Trạng thái mới |
|---|---|---|---|
| 2026-10-25 | Fullstack Dev | Triển khai Pessimistic Write Lock `findActiveItemsForUpdate` trong `ProductItemRepository`, chuẩn hóa logic tính `calculateBufferDays` & `isIntervalOverlappingWithBuffer` trong `BookingService`, bổ sung 3 kịch bản test chuyên sâu BOK-002 (198/198 tests pass 100%) | ✅ DONE |
| 2026-10-24 | Tech Lead | Soạn thảo tài liệu đặc tả ban đầu | 📝 SPEC |
