# 02 - Cấu Trúc Thư Mục & Tái Sử Dụng Component (CRM)

## 1. Cấu Trúc Thư Mục Chuẩn `src/`

```text
src/
├── components/
│   ├── common/           # BẮT BUỘC TÁI SỬ DỤNG: DataTable, FormField, ConfirmModal, FilterBar, ImageUploader
│   └── features/         # Component nghiệp vụ riêng từng module (dresses, combos, bookings)
├── hooks/                # Custom React hooks & TanStack Query hooks
├── layouts/              # MainLayout (Sidebar, Header, Breadcrumb)
├── pages/                # Các trang màn hình chính (DressesPage, BookingsPage)
├── routes/               # Cấu hình Router, Route Guards, phân quyền
├── services/             # Axios instance, Interceptors, API functions theo feature
├── types/                # TypeScript models, enums, interfaces
├── utils/                # Hàm tiện ích dùng chung (formatCurrency, formatDate)
└── i18n/                 # Cấu hình i18next và locales/ (vi.json, en.json)
```

---

## 2. Quy Tắc Tái Sử Dụng Component Bắt Buộc

- **PHẢI** dùng `DataTable` từ `src/components/common` cho mọi màn hình danh sách (đã tích hợp phân trang, sắp xếp, loading).
- **PHẢI** dùng `ConfirmModal` cho mọi thao tác nguy hiểm (Xóa trang phục, Hủy đơn đặt lịch, Khóa tài khoản).
- **TUYỆT ĐỐI CẤM** sao chép (copy-paste) các đoạn mã cấu hình Ant Design Table, Form lặp lại qua các trang khác nhau.
- Mọi tùy biến hiển thị chỉ được thực hiện thông qua **props** của component dùng chung.

---

## 3. Ví Dụ Cụ Thể

### Tái Sử Dụng DataTable Chuẩn
```tsx
// ❌ SAI: Tự viết lại Ant Design Table + State phân trang ở từng trang
export function DressPage() {
  const [page, setPage] = useState(1);
  return <Table pagination={{ current: page, onChange: setPage }} ... />;
}

// ✅ ĐÚNG: Dùng DataTable chung, chỉ định nghĩa columns và query
import { DataTable } from "@/components/common/data-table";
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
