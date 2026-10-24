# 02 - Cấu Trúc Thư Mục & Tái Sử Dụng Component (CRM)

## 1. Cấu Trúc Thư Mục Chuẩn `src/`

CRM Chickie Studio sử dụng chuẩn giao diện **shadcn/ui** (Tailwind CSS, CVA, Lucide React), **TUYỆT ĐỐI KHÔNG dùng Ant Design** và **TUYỆT ĐỐI CẤM inline CSS** (`style={{ ... }}`).

```text
src/
├── components/
│   ├── ui/                   # Primitive shadcn/ui: Button, Input, Card, Badge
│   │   ├── Button/           # Button.tsx, Button.test.tsx, index.ts
│   │   ├── Input/            # Input.tsx, Input.test.tsx, index.ts
│   │   ├── Card/             # Card.tsx, Card.test.tsx, index.ts
│   │   ├── Badge/            # Badge.tsx, Badge.test.tsx, index.ts
│   │   └── index.ts          # Re-export primitives
│   ├── common/               # BẮT BUỘC TÁI SỬ DỤNG: DataTable, FormField, ConfirmModal, FilterBar...
│   │   ├── <ComponentName>/  # Mỗi component một thư mục độc lập:
│   │   │   ├── <Name>.tsx    # Logic JSX & a11y
│   │   │   ├── <Name>.test.tsx # Unit tests (Coverage >= 80%)
│   │   │   ├── <Name>.scss   # Scoped styles theo BEM
│   │   │   └── index.ts      # Re-export component
│   │   └── index.ts          # Re-export toàn bộ common components
│   └── features/             # Component nghiệp vụ riêng từng module (dresses, combos, bookings)
├── hooks/                    # Custom React hooks & TanStack Query hooks
├── layouts/                  # AppLayout (Sidebar Dark, Header, User Menu)
├── pages/                    # Các trang màn hình chính (DevComponentsPage, BookingsPage)
├── routes/                   # Cấu hình Router, Route Guards, phân quyền
├── services/                 # Axios instance, Interceptors, API functions theo feature
├── styles/                   # Hệ thống SCSS phân tầng:
│   ├── _tokens.scss          # Design tokens CSS variables
│   ├── _mixins.scss          # Responsive & layout mixins
│   ├── _functions.scss       # SASS functions
│   ├── _utilities.scss       # Utility classes
│   ├── _global.scss          # Global reset & typography
│   └── main.scss             # Entrypoint SCSS duy nhất
├── types/                    # TypeScript models, enums, interfaces
├── utils/                    # Hàm tiện ích dùng chung (formatCurrency, formatDate)
└── i18n/                     # Cấu hình i18next và locales/ (vi.json, en.json)
```

---

## 2. Quy Tắc Tái Sử Dụng Component Bắt Buộc

1. **PHẢI** dùng `DataTable` từ `src/components/common` cho mọi màn hình danh sách (đã tích hợp phân trang, sắp xếp, loading, selection).
2. **PHẢI** dùng `ConfirmModal` cho mọi thao tác nguy hiểm (Xóa trang phục, Hủy đơn đặt lịch, Khóa tài khoản).
3. **PHẢI** dùng `Button`, `Input`, `Card`, `Badge` từ `src/components/ui` cho các thành phần primitive.
4. **TUYỆT ĐỐI CẤM** viết inline CSS (`style={{ ... }}`). Mọi tùy biến style phải viết trong file `.scss` của component hoặc class Tailwind tiện ích.
5. **TUYỆT ĐỐI CẤM** cài đặt lại hoặc import Ant Design (`antd`).
6. Mọi tùy biến hiển thị chỉ được thực hiện thông qua **props** của component dùng chung.

---

## 3. Ví Dụ Cụ Thể

### Tái Sử Dụng DataTable Chuẩn
```tsx
// ❌ SAI: Tự viết lại thẻ table tùy tiện hoặc inline style
export function DressPage() {
  return <table style={{ width: "100%", background: "#fff" }}>...</table>;
}

// ✅ ĐÚNG: Dùng DataTable chung, chỉ định nghĩa columns và query
import { DataTable, type ColumnType } from "@/components/common";
import { useDressesQuery } from "@/hooks/queries/use-dresses-query";

export function DressListPage() {
  const { data, isLoading, pagination, setPagination } = useDressesQuery();
  return (
    <DataTable
      columns={dressColumns}
      dataSource={data?.items}
      loading={isLoading}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  );
}
```
