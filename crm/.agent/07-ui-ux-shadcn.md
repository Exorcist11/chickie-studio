# 07 - Quy Chuẩn UI/UX, shadcn/ui & Cấm Inline CSS (CRM)

## 1. Nguyên Tắc Cốt Lõi
- **Định hướng thư viện UI**: Thống nhất chuyển đổi sang **`shadcn/ui`** làm thư viện UI tiêu chuẩn cho toàn dự án.
- **TUYỆT ĐỐI CẤM INLINE CSS**: Bất kỳ component nào viết mới hoặc sửa đổi đều **KHÔNG ĐƯỢC PHÉP** dùng `style={{ ... }}`.
- Mọi CSS tùy biến phải được viết trong file SCSS (`src/styles/`) hoặc CSS Modules (`*.module.scss`).

---

## 2. Quy Định Đối Với Các Component Dùng Chung Hiện Tại
1. Hiện tại CRM đang có các wrapper component tại `src/components/common/` (`DataTable`, `FilterBar`, `FormField`, `ConfirmModal`, `StatCard`, `PageHeader`, `ImageUploader`, `AppLayout`, `RevenueChart`, `StatusBadge`).
2. **Quy tắc refactor**:
   - Khi chỉnh sửa hoặc phát triển màn hình mới, PHẢI loại bỏ dần `style={{ ... }}` và chuyển sang các class trong file SCSS tương ứng hoặc utility classes.
   - Không tự ý thêm `style={{ ... }}` vào các thẻ JSX để căn chỉnh nhanh.
3. **Form & Validation**:
   - Mọi form field bắt buộc có label rõ ràng và validate schema bằng Zod.
   - Thông báo lỗi phải hiển thị trực quan và có `role="alert"`.

---

## 3. Ví Dụ Đúng / Sai

```tsx
// ❌ SAI: Sử dụng inline style trong JSX component
export function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ backgroundColor: "#FFFFFF", padding: 20, borderRadius: 12, border: "1px solid #EADFD6" }}>
      <span style={{ fontSize: 13, color: "#6B5D60" }}>{label}</span>
      <h2 style={{ fontFamily: "Playfair Display", fontSize: 28, color: "#302528" }}>{value}</h2>
    </div>
  );
}

// ✅ ĐÚNG: Tách style vào file SCSS hoặc dùng class chuẩn
import styles from "./StatBlock.module.scss";

export function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <h2 className={styles.value}>{value}</h2>
    </div>
  );
}
```
*File `StatBlock.module.scss`:*
```scss
.card {
  background-color: var(--color-warm-white);
  padding: var(--space-5);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-line);
}

.label {
  font-size: 0.8125rem;
  color: var(--color-ink-muted);
}

.value {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-ink);
}
```
