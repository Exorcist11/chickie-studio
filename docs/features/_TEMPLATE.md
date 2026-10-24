# Đặc Tả Tính Năng: [TÊN TÍNH NĂNG]

| Thuộc tính | Giá trị |
|---|---|
| **ID** | `MOD-000` |
| **Tên tính năng** | [Tên tính năng ngắn gọn] |
| **Module** | [AUTH / CAT / BOK / PAY / CUS / RPT / CNT / SET] |
| **Phạm vi** | [CLIENT / CRM / SERVER] |
| **Ưu tiên** | [P0 - MVP / P1 - Vận hành / P2 - Tăng trưởng] |
| **Trạng thái** | 📝 SPEC |
| **Người phụ trách** | [Tên / Role] |
| **Ngày bắt đầu** | YYYY-MM-DD |
| **Ngày hoàn thành** | YYYY-MM-DD |
| **Phụ thuộc** | [Danh sách ID các tính năng phụ thuộc hoặc Không] |

---

## 1. Mục Tiêu và Giá Trị Mang Lại
- [1-3 câu mô tả mục tiêu tính năng giải quyết vấn đề gì và đem lại giá trị gì cho khách hàng hoặc cửa hàng]

## 2. Người Dùng Liên Quan
- [ ] **Khách hàng**: [Mô tả vai trò/thao tác nếu có]
- [ ] **Nhân viên cửa hàng**: [Mô tả vai trò/thao tác nếu có]
- [ ] **Admin (Chủ shop)**: [Mô tả quyền hạn/thao tác nếu có]

## 3. Luồng Chính (Happy Path)
1. Bước 1: Người dùng...
2. Bước 2: Hệ thống...
3. Bước 3: ...

```mermaid
sequenceDiagram
    autonumber
    actor Actor as Người dùng
    participant UI as Giao diện (Client/CRM)
    participant API as Backend API
    participant DB as MySQL Database

    Actor->>UI: Thao tác...
    UI->>API: Gọi API...
    API->>DB: Truy vấn/Cập nhật...
    DB-->>API: Trả về kết quả
    API-->>UI: 200 OK
    UI-->>Actor: Hiển thị thông báo thành công
```

## 4. Luồng Ngoại Lệ và Trường Hợp Biên (Edge Cases)
- **Ngoại lệ 1**: Khi... hệ thống phản hồi...
- **Ngoại lệ 2**: Khi... hệ thống chặn và thông báo...
- **Trường hợp biên**: Khi dữ liệu rỗng / số lượng = 0 / hết hạn...

## 5. Quy Tắc Nghiệp Vụ (Business Rules)
- **BR-01**: [Quy tắc 1: ví dụ thời gian giữ đồ, số tiền, ngày đệm...]
- **BR-02**: [Quy tắc 2...]

## 6. Giao Diện & Đa Ngôn Ngữ (UI & i18n)
- **Màn hình**: [Mô tả bố cục UI trên Client hoặc CRM, responsive mobile]
- **Component dùng chung**: [Liệt kê component tái sử dụng: Button, DataTable, Modal...]
- **Danh sách key i18n cần thêm (`vi.json` / `en.json`)**:
```json
{
  "moduleName": {
    "key1": "Nội dung tiếng Việt",
    "key2": "Nội dung tiếng Việt"
  }
}
```

## 7. Đặc Tả API
| Method | Endpoint | Quyền truy cập | Request Body | Response Body (200/201) | Mã lỗi |
|---|---|---|---|---|---|
| `POST` | `/api/...` | Public / Role | `{ ... }` | `{ "code": 200, "data": ... }` | 400, 401, 404, 409 |

- **Ví dụ Request DTO**:
```json
{}
```
- **Ví dụ Response DTO**:
```json
{}
```

## 8. Thay Đổi Cơ Sở Dữ Liệu
- **File Migration Flyway**: `V{n}__[mo_ta_ngan_gon].sql`
- **Bảng mới / Sửa đổi**:
```sql
-- DDL dự kiến
```
- **Indexes**: Đánh index cho các cột tìm kiếm/khóa ngoại.

## 9. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
- [ ] **Scenario 1**: [Tên kịch bản thành công]
  - **Given** [Điều kiện tiền đề]
  - **When** [Hành động xảy ra]
  - **Then** [Kết quả kỳ vọng]
- [ ] **Scenario 2**: [Tên kịch bản thất bại/lỗi]
  - **Given** ...
  - **When** ...
  - **Then** ...

## 10. Kế Hoạch Test
- **Unit Test**: [Liệt kê các hàm/service cần test logic]
- **Integration Test**: [Test luồng API, database testcontainers]
- **UI Test**: [Test component render, loading, empty, error, user interaction]
- **Ngưỡng Coverage**: Bắt buộc $\ge 80\%$ (line & branch).

## 11. Checklist Hoàn Thành (Definition of Done)
- [ ] Code tuân thủ Clean Code & architecture rules của phân vùng tương ứng.
- [ ] Đã tái sử dụng component/service có sẵn.
- [ ] Đầy đủ key đa ngôn ngữ cho cả `vi` và `en` (không hardcode text).
- [ ] Đã viết unit/integration test, JaCoCo/Vitest coverage $\ge 80\%$.
- [ ] Lệnh kiểm tra chất lượng (lint, typecheck, test) pass 100%.
- [ ] Cập nhật trạng thái tính năng trong `docs/FEATURES.md` sang ✅ DONE.
- [ ] Ghi nhận nội dung thay đổi vào `docs/CHANGELOG.md`.

## 12. Nhật Ký Thực Hiện
| Ngày | Người thực hiện | Nội dung thay đổi | Trạng thái mới |
|---|---|---|---|
| YYYY-MM-DD | Tech Lead | Khởi tạo file đặc tả | 📝 SPEC |
