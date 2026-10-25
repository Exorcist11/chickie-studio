# Đặc Tả Tính Năng: State Machine Quản Lý Vòng Đời Đơn Thuê

| Thuộc tính | Giá trị |
|---|---|
| **ID** | `BOK-003` |
| **Tên tính năng** | State Machine & Ma trận chuyển đổi trạng thái đơn thuê đồ |
| **Module** | BOK (Booking) |
| **Phạm vi** | SERVER, CRM, CLIENT |
| **Ưu tiên** | P0 - MVP |
| **Trạng thái** | ✅ DONE |
| **Người phụ trách** | Fullstack Dev & Tech Lead |
| **Ngày bắt đầu** | 2026-10-25 |
| **Ngày hoàn thành** | 2026-10-25 |
| **Phụ thuộc** | `BOK-001`, `BOK-002` |

---

## 1. Mục Tiêu và Giá Trị Mang Lại
Xây dựng một cỗ máy trạng thái (State Machine) chuẩn hóa toàn bộ vòng đời của đơn thuê trang phục tại Chickie Studio: từ lúc khách gửi yêu cầu trên mạng, thu cọc, giao đồ đi chụp, nhận đồ về, hoàn cọc và xử lý quá hạn trả đồ. Giúp toàn bộ nhân viên vận hành đồng nhất, không bao giờ bỏ sót bước kiểm tra đồ hay hoàn cọc.

## 2. Người Dùng Liên Quan
- [x] **Nhân viên & Admin**: Cập nhật trạng thái từng bước trên CRM.
- [x] **Khách hàng**: Theo dõi tiến độ đơn hàng trên website client theo thời gian thực.

## 3. Luồng Chuyển Đổi Trạng Thái (State Transitions)

```mermaid
stateDiagram-v2
    [*] --> PENDING: Khách đặt trên Web Client
    PENDING --> CONFIRMED: Shop gọi điện xác nhận đơn
    PENDING --> CANCELLED: Khách báo hủy / Quá hạn cọc
    CONFIRMED --> DEPOSITED: Shop đã nhận đủ tiền cọc
    CONFIRMED --> CANCELLED: Khách đổi ý không thuê nữa
    DEPOSITED --> DELIVERED: Giao đồ cho khách đi chụp
    DELIVERED --> RETURNED: Khách mang đồ về trả shop
    DELIVERED --> OVERDUE: Quá ngày trả mà chưa thấy đồ
    OVERDUE --> RETURNED: Khách mang trả trễ hạn
    RETURNED --> COMPLETED: Kiểm tra đồ chuẩn & hoàn cọc
```

### Chi Tiết Từng Trạng Thái:
1. **`PENDING` (Chờ xử lý)**: Đơn mới tạo trên website khách. Hệ thống tự động gửi Email xác nhận đặt đơn và hướng dẫn chuyển khoản cọc (`SET-003`).
2. **`CONFIRMED` (Đã xác nhận)**: Shop đã liên hệ khách qua Điện thoại/Email chốt mẫu váy và ngày giờ.
3. **`DEPOSITED` (Đã đặt cọc)**: Tiền cọc đã vào tài khoản shop, đơn chắc chắn được giữ lịch 100%. Tự động gửi Email xác nhận nhận cọc thành công.
4. **`DELIVERED` (Đang thuê / Đã giao)**: Khách đã nhận váy/máy ảnh rời khỏi cửa hàng. Tự động gửi Email biên bản bàn giao và nhắc ngày hẹn trả.
5. **`RETURNED` (Đã trả đồ)**: Khách mang đồ hoàn trả tại quầy, nhân viên tiếp nhận và treo vào khu giặt kiểm tra.
6. **`COMPLETED` (Hoàn tất)**: Đồ nguyên vẹn, nhân viên hoàn cọc thành công, kết thúc đơn. Tự động gửi Email quyết toán hoàn cọc và lời cảm ơn.
7. **`CANCELLED` (Đã hủy)**: Đơn bị hủy (quá hạn cọc 60 phút hoặc khách báo hủy); toàn bộ lịch đồ được giải phóng ngay lập tức. Tự động gửi Email thông báo hủy đơn.
8. **`OVERDUE` (Quá hạn trả)**: Hệ thống tự động đánh dấu khi ngày hiện tại vượt quá `rental_end_date` mà đơn vẫn ở trạng thái `DELIVERED`. Gửi Email cảnh báo quá hạn.

*(Lưu ý: Mọi thông báo tự động nói trên đều gửi qua kênh Email, chưa thực hiện gửi qua Zalo hay SMS)*.

---

## 4. Ma Trận Chuyển Đổi Hợp Lệ (State Transition Matrix)
| Từ Trạng Thái | Có thể chuyển sang | Không được phép chuyển sang |
|---|---|---|
| `PENDING` | `CONFIRMED`, `CANCELLED` | `DELIVERED`, `RETURNED`, `COMPLETED` |
| `CONFIRMED`| `DEPOSITED`, `CANCELLED` | `RETURNED`, `COMPLETED` |
| `DEPOSITED`| `DELIVERED`, `CANCELLED` (hoàn cọc nếu báo trước) | `PENDING`, `COMPLETED` |
| `DELIVERED`| `RETURNED`, `OVERDUE` | `PENDING`, `CONFIRMED`, `CANCELLED` |
| `OVERDUE`  | `RETURNED` | `PENDING`, `CONFIRMED` |
| `RETURNED` | `COMPLETED` | `PENDING`, `DELIVERED` |
| `COMPLETED`| Không (Trạng thái kết thúc) | Mọi trạng thái khác |
| `CANCELLED`| Không (Trạng thái kết thúc) | Mọi trạng thái khác |

---

## 5. Quy Tắc Nghiệp Vụ
- **BR-01**: Cấm tuyệt đối việc nhảy cóc trạng thái (ví dụ: đang `PENDING` nhảy thẳng sang `DELIVERED` mà chưa qua bước xác nhận cọc).
- **BR-02**: Khi đơn chuyển sang `CANCELLED`, hệ thống tự động giải phóng toàn bộ món đồ thực tế (`product_items`) liên kết với đơn đó.
- **BR-03**: Khi đơn chuyển sang `RETURNED`, trạng thái của món đồ thực tế tự động chuyển sang `LAUNDRY` (`CAT-003`).
- **BR-04**: Các mốc chuyển đổi trạng thái quan trọng (`PENDING`, `DEPOSITED`, `COMPLETED`, `CANCELLED`) kích hoạt gửi thông báo tự động qua **Email** (`SET-003`). Chưa thực hiện thông báo qua Zalo hay SMS.

## 6. Giao Diện & Đa Ngôn Ngữ (UI & i18n)
- **Màn hình**: Steps tracker trên trang tra cứu đơn Client; Badge màu sắc trên CRM DataTable.
- **Keys i18n (`vi.json` / `en.json`)**:
```json
{
  "bookingStatus": {
    "PENDING": "Chờ xác nhận",
    "CONFIRMED": "Đã xác nhận",
    "DEPOSITED": "Đã đặt cọc",
    "DELIVERED": "Đang cho thuê",
    "RETURNED": "Đã trả đồ",
    "COMPLETED": "Hoàn tất",
    "CANCELLED": "Đã hủy",
    "OVERDUE": "Quá hạn trả"
  }
}
```

## 7. Đặc Tả API
| Method | Endpoint | Quyền truy cập | Request Body | Response Body | Mã lỗi |
|---|---|---|---|---|---|
| `PATCH` | `/api/admin/bookings/{id}/status` | `STAFF`, `ADMIN` | `{"status": "...", "note": "..."}` | `ApiResponse<BookingResponse>` | 400, 404 |
| `POST` | `/api/admin/bookings/check-overdue` | `ADMIN`, `STAFF` | Không | `ApiResponse<Integer>` | 401, 403 |

## 8. Thay Đổi Cơ Sở Dữ Liệu
- Tạo bảng ghi nhận nhật ký chuyển trạng thái (Audit Trail):
```sql
CREATE TABLE `booking_status_histories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `booking_id` BIGINT NOT NULL,
    `from_status` VARCHAR(30),
    `to_status` VARCHAR(30) NOT NULL,
    `changed_by_user_id` BIGINT,
    `note` VARCHAR(255),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_bsh_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 9. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
- [x] **Kịch bản 1 - Chuyển trạng thái hợp lệ**: Đơn đang `PENDING` chuyển sang `CONFIRMED` thành công, lưu bản ghi vào `booking_status_histories`.
- [x] **Kịch bản 2 - Chuyển trạng thái bất hợp lệ**: Đơn đang `PENDING` cố chuyển sang `COMPLETED` bị server ném lỗi `400 Bad Request: Chuyển đổi trạng thái không hợp lệ`.

## 10. Kế Hoạch Test
- **Unit Test**: Test toàn bộ các trường hợp chuyển đổi của State Machine bằng bảng ma trận kiểm thử (`BookingStatusTest`, `BookingServiceTest`, `AdminBookingControllerTest`).
- **Mục tiêu Coverage**: $\ge 85\%$ (Đạt 100% tests pass).

## 11. Checklist Hoàn Thành (Definition of Done)
- [x] Xây dựng State Transition Guard (`canTransitionTo`, `getValidNextStatuses`) trên backend Java.
- [x] UI CRM chỉ hiển thị các nút hành động hợp lệ theo trạng thái hiện tại (`UpdateStatusModal.tsx`).
- [x] i18n đầy đủ cho 8 trạng thái.
- [x] Test coverage $\ge 80\%$.
- [x] Cập nhật `docs/FEATURES.md` và `docs/CHANGELOG.md`.

## 12. Nhật Ký Thực Hiện
| Ngày | Người thực hiện | Nội dung thay đổi | Trạng thái mới |
|---|---|---|---|
| 2026-10-25 | Fullstack Dev & Tech Lead | Hoàn thành toàn diện: State Transition Guard trong `BookingStatus` (`canTransitionTo`, `getValidNextStatuses`), ánh xạ `nextValidStatuses` trong `BookingResponse`, đồng bộ món đồ vật lý `ProductItem` vòng đời (`RENTED` $\rightarrow$ `LAUNDRY` $\rightarrow$ `AVAILABLE`), bảng Audit Trail `booking_status_histories`, API `PATCH /api/admin/bookings/{id}/status`, API `POST /api/admin/bookings/check-overdue` quét quá hạn tự động, 203/203 tests pass 100% | ✅ DONE |
| 2026-10-24 | Tech Lead | Soạn thảo tài liệu đặc tả ban đầu | 📝 SPEC |
