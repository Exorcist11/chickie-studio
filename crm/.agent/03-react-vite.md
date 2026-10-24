# 03 - API Services, TanStack Query & Phân Quyền (CRM)

## 1. Quy Định Tầng API & TanStack Query

- **PHẢI** gọi API duy nhất qua các hàm khai báo trong `src/services/` với Axios client chuẩn hóa (tự động đính kèm token, xử lý refresh token và interceptor lỗi 401/403).
- **KHÔNG ĐƯỢC** gọi `axios.get()` hay `fetch()` trực tiếp trong React component.
- **PHẢI** sử dụng **TanStack Query** cho mọi dữ liệu từ server.
- **PHẢI** tập trung hóa Query Keys (ví dụ: `dressKeys.all`, `dressKeys.detail(id)`); **CẤM** viết query key dạng chuỗi rời rạc.
- **PHẢI** tách mỗi resource thành custom hook riêng (ví dụ: `useBookings`, `useUpdateBookingStatus`).
- **PHẢI** invalidate query key liên quan sau khi mutation thành công.

---

## 2. Quy Định Phân Quyền (Authorization)

- **PHẢI** bảo vệ các trang quản trị bằng **Route Guard** (`ProtectedRoute`).
- **PHẢI** dùng component kiểm tra quyền tập trung (`<PermissionGate requiredRole="ADMIN">`) để ẩn/hiện nút bấm hoặc hành động nhạy cảm.
- **KHÔNG ĐƯỢC** rải rác điều kiện `user.role === 'ADMIN'` trực tiếp khắp các component UI.

---

## 3. Ví Dụ Cụ Thể

### Quản Lý Query Key & Custom Hook
```tsx
// ❌ SAI: Gọi API trực tiếp với queryKey tự do không quản lý
useQuery({ queryKey: ["dresses", id], queryFn: () => axios.get(`/api/dresses/${id}`) });

// ✅ ĐÚNG: Định nghĩa Query Key Factory & Service chuẩn
// src/services/dresses.service.ts
export const dressService = {
  getById: (id: string) => apiClient.get<DressResponse>(`/admin/dresses/${id}`)
};

// src/hooks/queries/use-dress-detail.ts
export const dressKeys = {
  all: ["dresses"] as const,
  detail: (id: string) => [...dressKeys.all, "detail", id] as const
};

export function useDressDetail(id: string) {
  return useQuery({
    queryKey: dressKeys.detail(id),
    queryFn: () => dressService.getById(id)
  });
}
```

### Phân Quyền Bằng PermissionGate
```tsx
// ❌ SAI: Kiểm tra role thủ công trong UI
{user?.role === "SUPER_ADMIN" && <Button onClick={deleteItem}>Xóa</Button>}

// ✅ ĐÚNG: Dùng PermissionGate bọc lại
<PermissionGate allowedRoles={["SUPER_ADMIN", "STORE_MANAGER"]}>
  <Button danger onClick={handleDelete}>{t("common.delete")}</Button>
</PermissionGate>
```
