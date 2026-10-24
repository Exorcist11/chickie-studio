# 01 - Clean Code & Form Validation (CRM)

## 1. Quy Định Bắt Buộc

- **PHẢI** bật TypeScript strict; **TUYỆT ĐỐI CẤM** dùng `any`, ép kiểu mù quáng `as unknown as Type`, hoặc bỏ qua kiểm tra kiểu.
- **PHẢI** sử dụng **Zod** để định nghĩa schema validation cho mọi Form (kết hợp `react-hook-form` hoặc Ant Design Form).
- **KHÔNG ĐƯỢC** viết logic validate thủ công bằng hàng loạt câu `if-else` trong component.
- **KHÔNG ĐƯỢC** để magic number/string trong code; **PHẢI** tạo Enum hoặc `as const` object cho trạng thái đơn, role, loại trang phục.
- **PHẢI** tách biệt state giao diện (modal open, tab active) với server state (danh sách đơn, chi tiết khách hàng).
- **PHẢI** xóa bỏ console.log, code thừa và code bị comment trước khi commit.

---

## 2. Ví Dụ Cụ Thể

### Type Safety & Zod Schema Validation
```tsx
// ❌ SAI: Dùng any cho form values, validate thủ công lộn xộn
const handleSave = (values: any) => {
  if (!values.name || values.price < 0) {
    alert("Dữ liệu sai"); // cấm alert và cấm validate thủ công thế này
    return;
  }
};

// ✅ ĐÚNG: Khai báo Zod schema tường minh, suy diễn type tự động
import { z } from "zod";

export const DressSchema = z.object({
  name: z.string().min(3, "Tên trang phục tối thiểu 3 ký tự"),
  rentalPrice: z.number().positive("Giá thuê phải lớn hơn 0"),
  depositPrice: z.number().nonnegative("Tiền cọc không được âm"),
  status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"])
});

export type DressFormValues = z.infer<typeof DressSchema>;
```

### Sử Dụng Constants & Enums Thay Cho Magic String
```tsx
// ❌ SAI: So sánh magic string rải rác trong code
if (booking.status === "CHO_DUYET") { ... }

// ✅ ĐÚNG: Định nghĩa tập trung tại src/types/booking.ts
export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  RETURNED: "RETURNED",
  CANCELLED: "CANCELLED"
} as const;

if (booking.status === BOOKING_STATUS.PENDING) { ... }
```
