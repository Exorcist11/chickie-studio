# Danh Mục Component UI Dùng Chung (Component Catalog)

Tài liệu này tổng hợp toàn bộ các component giao diện dùng chung của dự án **Chickie Studio**, phục vụ cho cả hai ứng dụng:
- **Client (Next.js 14 App Router + Tailwind CSS + Lucide Icons + next-intl)**
- **CRM (React 18 + Vite + Tailwind CSS + CVA + Lucide React + Zod + react-i18next — shadcn/ui Standard, KHÔNG Ant Design)**

Toàn bộ component đều được thiết kế tuân thủ nghiêm ngặt theo [docs/DESIGN_SYSTEM.md](file:///e:/chickie-studio/docs/DESIGN_SYSTEM.md) và [docs/UI_UX_ENGINEERING_RULES.md](file:///e:/chickie-studio/docs/UI_UX_ENGINEERING_RULES.md), đạt chuẩn WAI-ARIA Accessible, hỗ trợ i18n đầy đủ, **TUYỆT ĐỐI KHÔNG sử dụng inline CSS** (`style={{ ... }}` = 0), quản lý style qua cấu trúc SCSS/CSS phân tầng hoặc utility Tailwind, và có bộ kiểm thử tự động với độ bao phủ (coverage) $\ge 80\%$.

---

## 0. Package `@chickie/ui` (Kiến Trúc Component Dùng Chung Monorepo)

Các component nền tảng được bọc từ shadcn/ui primitive, tuân thủ nghiêm ngặt [ADR 0002](adr/0002-kien-truc-component-boc-shadcn-package-ui.md) và [docs/UI_LIBRARIES.md](UI_LIBRARIES.md).

| Tên Component | Vị trí file | Props chính | Ví dụ sử dụng (1 dòng) | Trạng thái Test & Coverage |
| :--- | :--- | :--- | :--- | :--- |
| **Button** | `packages/ui/src/base/Button/Button.tsx` | `variant` (primary, secondary, tertiary), `size` (md, sm), `loading` / `isLoading`, `disabled`, `leftIcon`, `rightIcon` | `<Button variant="primary" size="md">Đặt trang phục</Button>` | ✅ Pass (100% statements, 100% branches, axe a11y pass) |
| **TextField** | `packages/ui/src/base/TextField/TextField.tsx` | `label`, `hint`, `error`, `startIcon`, `endIcon`, `required`, HTML input props | `<TextField label="Họ tên" placeholder="Nhập tên" required />` | ✅ Pass (100% statements, 100% branches, axe a11y pass) |
| **PasswordField** | `packages/ui/src/base/TextField/PasswordField.tsx` | Kế thừa `TextFieldProps`, toggle ẩn/hiện mật khẩu có `aria-label` | `<PasswordField label="Mật khẩu" required />` | ✅ Pass (100% statements, 100% branches, axe a11y pass) |
| **SearchField** | `packages/ui/src/base/TextField/SearchField.tsx` | Kế thừa `TextFieldProps`, icon kính lúp + nút xóa `onClear` | `<SearchField label="Tìm kiếm" onClear={() => {}} />` | ✅ Pass (100% statements, 100% branches, axe a11y pass) |
| **TextArea** | `packages/ui/src/base/TextArea/TextArea.tsx` | `label`, `hint`, `error`, `rows`, `maxLength`, `showCount` | `<TextArea label="Ghi chú số đo" maxLength={200} showCount />` | ✅ Pass (100% statements, 93.3% branches, axe a11y pass) |
| **Select** | `packages/ui/src/base/Select/Select.tsx` | `label`, `hint`, `error`, `options` (`{ value, label, disabled }[]`), `placeholder` | `<Select label="Loại đồ" options={opts} placeholder="Chọn..." />` | ✅ Pass (99.5% statements, 96.3% branches, axe a11y pass) |
| **Checkbox** | `packages/ui/src/base/Checkbox/Checkbox.tsx` | `label`, `hint`, `error`, `checked`, `defaultChecked`, `onCheckedChange` | `<Checkbox label="Xuất VAT" onCheckedChange={setVat} />` | ✅ Pass (100% statements, 100% branches, axe a11y pass) |
| **RadioGroup** | `packages/ui/src/base/RadioGroup/RadioGroup.tsx` | `label`, `hint`, `error`, `options` (`{ value, label, hint, disabled }[]`), `value`, `onValueChange`, `orientation` | `<RadioGroup label="Giao hàng" name="ship" options={opts} />` | ✅ Pass (100% statements, 93.5% branches, axe a11y pass) |
| **Switch** | `packages/ui/src/base/Switch/Switch.tsx` | `label`, `hint`, `error`, `checked`, `defaultChecked`, `onCheckedChange`, `labelPosition` | `<Switch label="Gia hạn tự động" onCheckedChange={setRenew} />` | ✅ Pass (100% statements, 100% branches, axe a11y pass) |
| **Badge** | `packages/ui/src/base/Badge/Badge.tsx` | `variant` (primary, secondary, accent, success, warning, destructive, outline), `size` (sm, md) | `<Badge variant="accent">Best Seller</Badge>` | ✅ Pass (100% statements, 100% branches, axe a11y pass) |
| **Card** | `packages/ui/src/base/Card/Card.tsx` | `Card`, `CardHeader`, `CardTitle` (`as`), `CardDescription`, `CardContent`, `CardFooter`, `variant` (default, elevated, outline, ghost), `interactive` | `<Card variant="elevated" interactive><CardHeader><CardTitle>Tiêu đề</CardTitle></CardHeader></Card>` | ✅ Pass (100% statements, 100% branches, axe a11y pass) |
| **Spinner** | `packages/ui/src/base/Spinner/Spinner.tsx` | `size` (xs, sm, md, lg, xl), `variant` (primary, secondary, current, white), `label` (sr-only a11y) | `<Spinner size="md" label="Đang tải dữ liệu..." />` | ✅ Pass (100% statements, 100% branches, axe a11y pass) |
| **Skeleton** | `packages/ui/src/base/Skeleton/Skeleton.tsx` | `shape` (text, circular, rectangular, card), `label`, `aria-hidden` | `<Skeleton shape="circular" className="h-10 w-10" />` | ✅ Pass (100% statements, 100% branches, axe a11y pass) |


---

## 1. Client Components (`client/src/components/ui/`)

Cấu trúc mỗi component: `client/src/components/ui/<ComponentName>/` gồm `<ComponentName>.tsx`, `<ComponentName>.test.tsx`, `index.ts`. Re-export tập trung qua `client/src/components/ui/index.ts`.

| Tên Component | Vị trí file | Props chính | Trạng thái Test & Coverage |
| :--- | :--- | :--- | :--- |
| **Button** | `Button/Button.tsx` | `variant` (primary, secondary, tertiary), `size` (md, sm), `isLoading`, `leftIcon`, `rightIcon`, `href` | ✅ Pass (96.07% lines) |
| **Input** | `Input/Input.tsx` | `label`, `helperText`, `error`, `leftIcon`, `rightIcon`, `id`, `disabled` | ✅ Pass (91.93% lines) |
| **Select** | `Select/Select.tsx` | `label`, `options`, `value`, `onChange`, `error`, `helperText` | ✅ Pass (96.66% lines) |
| **Textarea** | `Textarea/Textarea.tsx` | `label`, `helperText`, `error`, `rows` | ✅ Pass (96.59% lines) |
| **DateRangeField** | `DateRangeField/DateRangeField.tsx` | `label`, `startDate`, `endDate`, `onStartDateChange`, `onEndDateChange`, `error` | ✅ Pass (100% lines) |
| **Chip / ChipGroup** | `Chip/Chip.tsx` | `selected`, `label`, `onToggle`, `multiple` | ✅ Pass (99.29% lines) |
| **Badge** | `Badge/Badge.tsx` | `status` (PENDING, CONFIRMED, DEPOSITED, DELIVERED, RETURNED, COMPLETED, CANCELLED, OVERDUE) | ✅ Pass (100% lines) |
| **Rating** | `Rating/Rating.tsx` | `score`, `reviewCount`, `size` | ✅ Pass (100% lines) |
| **ColorSwatch / ColorSwatchGroup** | `ColorSwatch/ColorSwatch.tsx` | `color` (hex), `name`, `selected`, `onSelectColor` (dùng CSS Custom Property `--swatch-color`) | ✅ Pass (100% lines) |
| **SizeSelector** | `SizeSelector/SizeSelector.tsx` | `sizes` (`{ size, available }[]`), `selectedSize`, `onSelect` | ✅ Pass (96.55% lines) |
| **Card / ProductCard** | `Card/Card.tsx`, `ProductCard/ProductCard.tsx` | `imageSrc`, `title`, `pricePerDay`, `rating`, `colors`, `isFavorite`, `onToggleFavorite` | ✅ Pass (97.72% lines) |
| **ServiceCard** | `ServiceCard/ServiceCard.tsx` | `title`, `description`, `icon`, `priceFrom`, `href` | ✅ Pass (93.15% lines) |
| **TestimonialCard** | `TestimonialCard/TestimonialCard.tsx` | `customerName`, `rating`, `content`, `avatarUrl`, `dressName` | ✅ Pass (86.88% lines) |
| **SectionHeading** | `SectionHeading/SectionHeading.tsx` | `title` (Playfair font), `description`, `align` | ✅ Pass (100% lines) |
| **Container / Section** | `Container/Container.tsx`, `Section/Section.tsx` | `background` (warm-white, ivory), `spacing` (sm, md, lg) | ✅ Pass (100% lines) |
| **Modal / ConfirmModal** | `Modal/Modal.tsx` | `isOpen`, `onClose`, `title`, `children`, `footer` | ✅ Pass (90.23% lines) |
| **Toast** | `Toast/Toast.tsx` | `variant` (success, error, warning, info), `message`, `onClose` | ✅ Pass (100% lines) |
| **Skeleton / Spinner / EmptyState** | `Skeleton/`, `Spinner/`, `EmptyState/` | Primitives hiển thị trạng thái đang tải và dữ liệu trống | ✅ Pass (100% lines) |
| **Header / Footer** | `Header/Header.tsx`, `Footer/Footer.tsx` | Header sticky cuộn mượt, navigation desktop & mobile drawer; Footer 4 cột | ✅ Pass (96-100% lines) |

*Tổng tỷ lệ bao phủ Client*: **97.04% statements / lines, 87.53% branches, 90.24% functions** (88 tests passed).

---

## 2. CRM Components

CRM được chuẩn hóa hoàn toàn theo chuẩn **shadcn/ui**, loại bỏ 100% Ant Design. Cấu trúc tổ chức dạng module độc lập:
`crm/src/components/<category>/<ComponentName>/` gồm:
- `<ComponentName>.tsx`: Logic component chuẩn React/TypeScript, WAI-ARIA Accessible.
- `<ComponentName>.test.tsx`: Bộ kiểm thử đơn vị tự động.
- `<ComponentName>.scss`: Scoped SCSS module quản lý style theo design tokens.
- `index.ts`: Re-export cho từng component.

### 2.1. CRM UI Primitives (`crm/src/components/ui/`)

| Tên Component | Vị trí file | Props chính | Ví dụ sử dụng (1 dòng) | Trạng thái Test |
| :--- | :--- | :--- | :--- | :--- |
| **Button** | `crm/src/components/ui/Button/` | `variant` (primary, secondary, outline, ghost, destructive, tertiary), `size` (default, sm, lg, icon), `isLoading`, `leftIcon`, `rightIcon`, `href` | `<Button variant="primary" size="sm">Lưu dữ liệu</Button>` | ✅ Pass (95.94% lines) |
| **Input** | `crm/src/components/ui/Input/` | `label`, `helperText`, `error`, `leftIcon`, `rightIcon`, `id`, `disabled` | `<Input label="Email" placeholder="admin@chickie.vn" />` | ✅ Pass (100% lines) |
| **Card** | `crm/src/components/ui/Card/` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `hoverEffect` | `<Card hoverEffect><CardHeader><CardTitle>Tiêu đề</CardTitle></CardHeader></Card>` | ✅ Pass (100% lines) |
| **Badge** | `crm/src/components/ui/Badge/` | `variant` (default, secondary, destructive, outline, success, warning) | `<Badge variant="success">Hoàn thành</Badge>` | ✅ Pass (100% lines) |

### 2.2. CRM Common Components (`crm/src/components/common/`)

| Tên Component | Vị trí thư mục | Props chính | Ví dụ sử dụng (1 dòng) | Trạng thái Test |
| :--- | :--- | :--- | :--- | :--- |
| **StatusBadge** | `crm/src/components/common/StatusBadge/` | `type` ("order" \| "item"), `status` (`OrderStatus` \| `ItemStatus`), `size` | `<StatusBadge type="order" status="DELIVERED" />` | ✅ Pass (94.25% lines) |
| **PageHeader** | `crm/src/components/common/PageHeader/` | `title`, `subtitle`, `breadcrumbs` (`{ title, href }[]`), `actions` | `<PageHeader title="Quản lý đơn thuê" subtitle="Danh sách toàn bộ đơn" actions={<Button>Thêm</Button>} />` | ✅ Pass (100% lines) |
| **DataTable** | `crm/src/components/common/DataTable/` | `columns`, `dataSource`, `loading`, `rowKey`, `pagination`, `onSelectionChange` | `<DataTable columns={cols} dataSource={data} rowKey="id" pagination={{ total: 100 }} />` | ✅ Pass (96.66% lines) |
| **FilterBar** | `crm/src/components/common/FilterBar/` | `searchPlaceholder`, `selectOptions`, `onFilterChange`, `onReset`, `extraActions` | `<FilterBar selectOptions={statusOpts} onFilterChange={handleFilter} extraActions={<Button>Xuất Excel</Button>} />` | ✅ Pass (100% lines) |
| **FormField** | `crm/src/components/common/FormField/` | `name`, `label`, `schema` (ZodType), `error`, `helperText`, `required` | `<FormField name="price" label="Giá thuê" error={err}><Input id="price" /></FormField>` | ✅ Pass (98.82% lines) |
| **ConfirmModal** | `crm/src/components/common/ConfirmModal/` | `open`, `title`, `content`, `onConfirm`, `onCancel`, `confirmLoading`, `isDestructive` | `<ConfirmModal open={open} title="Xóa sản phẩm" content="Hành động không thể hoàn tác" onConfirm={handleDelete} onCancel={() => setOpen(false)} />` | ✅ Pass (98.59% lines) |
| **ImageUploader** | `crm/src/components/common/ImageUploader/` | `fileList`, `onChange`, `maxCount` (8), `maxSizeMB` (5), `allowedTypes` | `<ImageUploader fileList={files} onChange={setFiles} maxCount={4} />` | ✅ Pass (100% lines) |
| **AppLayout** | `crm/src/components/common/AppLayout/` | `children`, `selectedKey`, `onMenuClick`, `userName`, `userRole`, `onLogout` | `<AppLayout selectedKey="orders" userName="Admin" onLogout={handleLogout}>...</AppLayout>` | ✅ Pass (100% lines) |
| **StatCard** | `crm/src/components/common/StatCard/` | `title`, `value`, `prefix`, `suffix`, `trend` (`{ value, isPositive, description }`), `icon` | `<StatCard title="Doanh thu" value="110,000,000" suffix="₫" trend={{ value: 12.5, isPositive: true }} icon={<DollarSign />} />` | ✅ Pass (100% lines) |
| **RevenueChart** | `crm/src/components/common/RevenueChart/` | `title`, `subtitle`, `data` (`{ label, revenue, orders }[]`), `height` | `<RevenueChart title="Doanh thu 6 tháng" data={monthlyData} />` | ✅ Pass (100% lines) |
| **EmptyState** | `crm/src/components/common/EmptyState/` | `description`, `actionText`, `onAction` | `<EmptyState description="Chưa có món đồ nào" actionText="Thêm ngay" onAction={openAdd} />` | ✅ Pass (100% lines) |
| **ErrorState** | `crm/src/components/common/ErrorState/` | `title`, `subTitle`, `onRetry` | `<ErrorState title="Mất kết nối" onRetry={refetch} />` | ✅ Pass (100% lines) |
| **PageLoading** | `crm/src/components/common/PageLoading/` | `tip` | `<PageLoading tip="Đang chuẩn bị báo cáo..." />` | ✅ Pass (100% lines) |

*Trang xem trước CRM*: Môi trường Dev (`crm/src/pages/DevComponentsPage.tsx`).
*Tổng tỷ lệ bao phủ CRM hiện tại*: **98.85% statements / lines, 85.27% branches, 91.66% functions** (48 tests passed, 0 inline CSS, không Ant Design).
