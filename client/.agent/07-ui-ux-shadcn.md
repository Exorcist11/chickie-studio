# 07 - Quy Chuẩn UI/UX, shadcn/ui & SCSS (Client)

## 1. Nguyên Tắc Cốt Lõi
- **Thư viện UI duy nhất**: Sử dụng **`shadcn/ui`** (Radix UI + Tailwind CSS + CVA).
- **CẤM Inline CSS**: Tuyệt đối không dùng thuộc tính `style={{ ... }}` trong JSX.
- Mọi CSS tùy biến phức tạp phải đặt trong file SCSS tại `src/styles/` hoặc CSS Module `ComponentName.module.scss`.

---

## 2. Quy Tắc Sử Dụng Component
1. **Tìm kiếm trước khi tạo**: Trước khi xây dựng giao diện mới, PHẢI kiểm tra `src/components/ui/`.
2. **Tái sử dụng component shadcn/ui**: Button, Input, Select, Dialog/Modal, Sheet, Dropdown, Card, Badge, Skeleton, Toast.
3. **Không override style bằng `!important`**: Sử dụng `className={cn("...", className)}` và biến thể `cva`.
4. **Accessible First**:
   - Vùng bấm tương tác $\ge 44 \times 44$px.
   - Nút icon bắt buộc có `aria-label`.
   - Focus ring nhìn thấy rõ ràng (focus-visible).
   - Form field luôn có label và liên kết `htmlFor`/`id`.

---

## 3. Ví Dụ Đúng / Sai

```tsx
// ❌ SAI: Dùng inline style và không có label rõ ràng
export function SearchBox() {
  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
      <input style={{ padding: "8px", borderRadius: "4px" }} placeholder="Tìm đồ..." />
      <button style={{ backgroundColor: "#641D2B", color: "#fff" }}>Tìm</button>
    </div>
  );
}

// ✅ ĐÚNG: Tái sử dụng shadcn components và class tiện ích
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function SearchBox() {
  return (
    <div className="flex items-center gap-2 mt-4">
      <Input label="Tìm kiếm trang phục" placeholder="Nhập tên sản phẩm..." />
      <Button variant="primary" size="md">Tìm kiếm</Button>
    </div>
  );
}
```
