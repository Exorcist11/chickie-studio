# 02 - Cấu Trúc Thư Mục & Tái Sử Dụng Component (Client)

## 1. Cấu Trúc Thư Mục Chuẩn `src/`

```text
src/
├── app/                  # App Router: routes, pages, layouts
├── components/
│   ├── ui/               # Thành phần cơ bản dùng chung (Button, Input, Modal, Card, Badge)
│   ├── layout/           # Header, Footer, Sidebar, Navigation
│   └── features/         # Component gắn nghiệp vụ (features/booking, features/dresses)
├── hooks/                # Custom hooks tái sử dụng toàn app
├── lib/                  # Tiện ích chung, api client (src/lib/api), formatters
├── types/                # Type definitions dùng chung toàn client
└── i18n/                 # Cấu hình đa ngôn ngữ và messages/ (vi.json, en.json)
```

---

## 2. Quy Tắc Tái Sử Dụng Component

- **PHẢI** kiểm tra `src/components/ui` trước khi code giao diện mới.
- **KHÔNG ĐƯỢC** tạo component trùng chức năng với component đã có.
- **PHẢI** tách component theo nguyên tắc:
  - `ui/`: Tinh khiết (dumb component), không chứa logic nghiệp vụ đặc thù hay API call.
  - `features/`: Chứa nghiệp vụ cụ thể, ghép nối các component từ `ui/`.
- **PHẢI** dùng design token trong cấu hình Tailwind; **KHÔNG ĐƯỢC** hardcode mã màu hex (`#ff4d4f`) hoặc giá trị tùy tiện (`w-[317px]`).
- **PHẢI** viết CSS theo quy tắc **Mobile-First** (base style cho mobile, sau đó tăng dần `md:`, `lg:`).

---

## 3. Ví Dụ Cụ Thể

### Tái Sử Dụng vs Tự Viết Lại
```tsx
// ❌ SAI: Tự viết lại button với style riêng lẻ trong feature
export function DressItem({ dress }: DressItemProps) {
  return (
    <div className="p-4 border">
      <h3>{dress.name}</h3>
      <button className="bg-[#ff4d4f] text-white px-4 py-2 rounded">Thuê ngay</button>
    </div>
  );
}

// ✅ ĐÚNG: Tái sử dụng component Button chuẩn từ ui/
import { Button } from "@/components/ui/button";

export function DressItem({ dress, onBook }: DressItemProps) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <h3 className="text-lg font-semibold text-foreground">{dress.name}</h3>
      <Button variant="primary" size="md" onClick={() => onBook(dress.id)}>
        {/* chuỗi sẽ dùng i18n */}
      </Button>
    </div>
  );
}
```
