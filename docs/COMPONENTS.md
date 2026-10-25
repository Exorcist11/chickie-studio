# Danh Mục Component UI Dùng Chung (Component Catalog)

Tài liệu này tổng hợp toàn bộ các component giao diện dùng chung của dự án **Chickie Studio**, phục vụ cho cả hai ứng dụng:
- **Client (Next.js 14 App Router + Tailwind CSS + Lucide Icons + next-intl)**: Thư mục `client/src/components/ui/`
- **CRM (React 18 + Vite + Tailwind CSS + CVA + Lucide React + Zod + react-i18next — shadcn/ui Standard, KHÔNG Ant Design)**: Thư mục `crm/src/components/ui/`

Toàn bộ component đều được thiết kế tuân thủ nghiêm ngặt theo [docs/DESIGN_SYSTEM.md](file:///e:/chickie-studio/docs/DESIGN_SYSTEM.md) và [docs/UI_UX_ENGINEERING_RULES.md](file:///e:/chickie-studio/docs/UI_UX_ENGINEERING_RULES.md), đạt chuẩn WAI-ARIA Accessible, hỗ trợ i18n đầy đủ, **TUYỆT ĐỐI KHÔNG sử dụng inline CSS** (`style={{ ... }}` = 0), quản lý style qua cấu trúc SCSS/CSS phân tầng hoặc utility Tailwind, và có bộ kiểm thử tự động với độ bao phủ (coverage) $\ge 80\%$.

---

## 0. Kiến Trúc Bộ Component UI Chuẩn Hóa (Nội Bộ `client` và `crm`)

Theo yêu cầu kiến trúc của Chickie Studio:
- **Không tạo thư mục ngoài**: Toàn bộ mã nguồn component và primitive shadcn/ui được đặt trực tiếp bên trong `client/src/components/ui/` và `crm/src/components/ui/`.
- Không phụ thuộc vào monorepo root package hay thư mục `packages/`.
- Cấu hình alias `@chickie/ui` trỏ trực tiếp đến `src/components/ui` trong từng project (`tsconfig.json`, `vite.config.ts`), đảm bảo import đồng nhất `@chickie/ui` hoặc `@/components/ui`.

### Bảng Component Cơ Bản (Giai Đoạn UI-1)

Các component nền tảng được bọc từ shadcn/ui primitive, tuân thủ nghiêm ngặt [docs/UI_UX_ENGINEERING_RULES.md](file:///e:/chickie-studio/docs/UI_UX_ENGINEERING_RULES.md):

| Tên Component | Vị trí file trong client & crm | Props chính | Ví dụ sử dụng (1 dòng) | Trạng thái Test & Coverage |
| :--- | :--- | :--- | :--- | :--- |
| **Button** | `src/components/ui/Button/Button.tsx` | `variant` (primary, secondary, tertiary, outline, ghost, destructive), `size` (md/default, sm, lg, icon), `loading` / `isLoading`, `disabled`, `leftIcon`, `rightIcon` | `<Button variant="primary" size="md">Đặt trang phục</Button>` | ✅ Pass ($\ge 95\%$ lines, axe a11y pass) |
| **TextField** | `src/components/ui/TextField/TextField.tsx` | `label`, `hint`, `error`, `startIcon`, `endIcon`, `required`, HTML input props | `<TextField label="Họ tên" placeholder="Nhập tên" required />` | ✅ Pass (100% lines, axe a11y pass) |
| **PasswordField** | `src/components/ui/TextField/PasswordField.tsx` | Kế thừa `TextFieldProps`, toggle ẩn/hiện mật khẩu có `aria-label` | `<PasswordField label="Mật khẩu" required />` | ✅ Pass (100% lines, axe a11y pass) |
| **SearchField** | `src/components/ui/TextField/SearchField.tsx` | Kế thừa `TextFieldProps`, icon kính lúp + nút xóa `onClear` | `<SearchField label="Tìm kiếm" onClear={() => {}} />` | ✅ Pass (100% lines, axe a11y pass) |
| **TextArea** | `src/components/ui/TextArea/TextArea.tsx` (hoặc `Textarea/`) | `label`, `hint`, `error`, `rows`, `maxLength`, `showCount` | `<TextArea label="Ghi chú số đo" maxLength={200} showCount />` | ✅ Pass ($\ge 98\%$ lines, axe a11y pass) |
| **Select** | `src/components/ui/Select/Select.tsx` | `label`, `hint`, `error`, `options` (`{ value, label, disabled }[]`), `placeholder` | `<Select label="Loại đồ" options={opts} placeholder="Chọn..." />` | ✅ Pass ($\ge 95\%$ lines, axe a11y pass) |
| **Checkbox** | `src/components/ui/Checkbox/Checkbox.tsx` | `label`, `hint`, `error`, `checked`, `defaultChecked`, `onCheckedChange` | `<Checkbox label="Xuất VAT" onCheckedChange={setVat} />` | ✅ Pass (100% lines, axe a11y pass) |
| **RadioGroup** | `src/components/ui/RadioGroup/RadioGroup.tsx` | `label`, `hint`, `error`, `options` (`{ value, label, hint, disabled }[]`), `value`, `onValueChange`, `orientation` | `<RadioGroup label="Giao hàng" name="ship" options={opts} />` | ✅ Pass (100% lines, axe a11y pass) |
| **Switch** | `src/components/ui/Switch/Switch.tsx` | `label`, `hint`, `error`, `checked`, `defaultChecked`, `onCheckedChange`, `labelPosition` | `<Switch label="Gia hạn tự động" onCheckedChange={setRenew} />` | ✅ Pass (100% lines, axe a11y pass) |
| **Badge** | `src/components/ui/Badge/Badge.tsx` | `status` (OrderStatus), `variant` (primary, secondary, accent, success, warning, destructive, outline), `size` (sm, md) | `<Badge variant="accent">Best Seller</Badge>` | ✅ Pass ($\ge 95\%$ lines, axe a11y pass) |
| **Card** | `src/components/ui/Card/Card.tsx` | `Card`, `CardHeader`, `CardTitle` (`as`), `CardDescription`, `CardContent`, `CardFooter`, `variant` (default, elevated, outline, ghost), `interactive` | `<Card variant="elevated" interactive><CardHeader><CardTitle>Tiêu đề</CardTitle></CardHeader></Card>` | ✅ Pass (100% lines, axe a11y pass) |
| **Spinner** | `src/components/ui/Spinner/Spinner.tsx` | `size` (xs, sm, md, lg, xl), `variant` (primary, secondary, current, white), `label` (sr-only a11y) | `<Spinner size="md" label="Đang tải dữ liệu..." />` | ✅ Pass (100% lines, axe a11y pass) |
| **Skeleton** | `src/components/ui/Skeleton/Skeleton.tsx` | `shape` (text, circular, rectangular, card), `label`, `aria-hidden` | `<Skeleton shape="circular" className="h-10 w-10" />` | ✅ Pass (100% lines, axe a11y pass) |

### Bảng Component Lớp Phủ & Phản Hồi (Giai Đoạn UI-2)

Bộ component overlays & feedback chuẩn WAI-ARIA, Focus Trap, Escape handler, body scroll lock, 0 inline CSS:

| Tên Component | Vị trí file trong client & crm | Props chính | Ví dụ sử dụng (1 dòng) | Trạng thái Test & Coverage |
| :--- | :--- | :--- | :--- | :--- |
| **Modal** | `src/components/ui/Modal/Modal.tsx` | `isOpen`/`open`, `onClose`, `title`, `description`, `footer`, `size`/`maxWidth` | `<Modal isOpen={open} onClose={handleClose} title="Bảng size">...</Modal>` | ✅ Pass ($\ge 97\%$ lines, axe a11y pass) |
| **ConfirmModal** | `src/components/ui/Modal/` | `isOpen`/`open`, `onClose`, `onConfirm`, `title`, `content`, `variant`, `confirmText` | `<ConfirmModal isOpen={open} onConfirm={handleDelete} title="Xác nhận" content="..." />` | ✅ Pass (100% lines, axe a11y pass) |
| **Drawer** | `src/components/ui/Drawer/Drawer.tsx` | `isOpen`/`open`, `onClose`, `placement` (right, left, bottom, top), `size`, `title`, `footer` | `<Drawer isOpen={open} onClose={handleClose} placement="right" title="Giỏ đồ">...</Drawer>` | ✅ Pass (100% lines, 94.8% branches, axe pass) |
| **Menu** | `src/components/ui/Menu/Menu.tsx` | `trigger`, `align` (left, right), `<MenuItem>`, `<MenuHeader>`, `<MenuDivider>` | `<Menu trigger={<Button>Tác vụ</Button>}><MenuItem onClick={...}>Sửa</MenuItem></Menu>` | ✅ Pass ($\ge 99\%$ lines, 87.5% branches, axe pass) |
| **Popover** | `src/components/ui/Popover/Popover.tsx` | `trigger`, `placement` (bottom, top, left, right), `align`, `open`, `onOpenChange` | `<Popover trigger={<Button>Xem</Button>}><p>Thông tin nổi</p></Popover>` | ✅ Pass ($\ge 99\%$ lines, 88.4% branches, axe pass) |
| **Tooltip** | `src/components/ui/Tooltip/Tooltip.tsx` | `content`, `children`, `placement`, `delayMs` (default 200ms) | `<Tooltip content="Gợi ý"><button>Icon</button></Tooltip>` | ✅ Pass (100% lines, 95% branches, axe pass) |
| **Notify & Toaster** | `src/components/ui/Notify/` | `notify.success()`, `notify.error()`, `notify.warning()`, `notify.info()`, `<Toaster />` | `notify.success("Lưu thành công!", { title: "Hoàn tất" })` | ✅ Pass ($\ge 99\%$ lines, 92.3% branches, axe pass) |

### Bảng Component Ngày Tháng & Form Chuyên Biệt (Giai Đoạn UI-3)

Bộ component chuyên dụng phục vụ luồng đặt lịch thuê, nhập số tiền VND chuẩn định dạng dấu chấm phân cách hàng nghìn, số điện thoại Việt Nam đầu số nhà mạng và các field tích hợp `react-hook-form`:

| Tên Component | Vị trí file trong client & crm | Props chính | Ví dụ sử dụng (1 dòng) | Trạng thái Test & Coverage |
| :--- | :--- | :--- | :--- | :--- |
| **CurrencyField** | `src/components/ui/CurrencyField/CurrencyField.tsx` | `value` (number), `onChange(val: number)`, `presets` (number[]), `min`, `max`, `suffix` ("₫"), `label`, `error` | `<CurrencyField label="Tiền cọc" value={deposit} onChange={setDeposit} presets={[200000, 500000]} />` | ✅ Pass (100% lines, axe a11y pass) |
| **PhoneField** | `src/components/ui/PhoneField/PhoneField.tsx` | `value` (chuỗi 10 số), `onChange(cleanPhone: string)`, `label`, `error`, `hint`, prefix quốc gia `+84` | `<PhoneField label="Số điện thoại" value={phone} onChange={setPhone} />` | ✅ Pass (100% lines, axe a11y pass) |
| **DatePicker** | `src/components/ui/DatePicker/DatePicker.tsx` | `value` ("YYYY-MM-DD"), `onChange(iso: string)`, `minDate`, `maxDate`, `disabledDates`, calendar popup WAI-ARIA grid | `<DatePicker label="Ngày bắt đầu" value={date} onChange={setDate} minDate="2026-10-25" />` | ✅ Pass (100% lines, axe a11y pass) |
| **DateRangePicker** | `src/components/ui/DatePicker/` / `DateRangeField/` | Alias/wrapper chuẩn hóa `DateRangeField` cho chọn khoảng ngày thuê nhận - trả | `<DateRangePicker label="Thời gian thuê" startDate={s} endDate={e} onRangeChange={setRange} />` | ✅ Pass (100% lines, axe a11y pass) |
| **Chip / ChipGroup** | `src/components/ui/Chip/Chip.tsx` | `label`, `selected`, `onToggle`, `options`, `value`, `onChange`, `multiple` (lọc tag/combo) | `<ChipGroup options={pills} value={selectedPill} onChange={setSelectedPill} />` | ✅ Pass (100% lines, axe a11y pass) |
| **SizeSelector** | `src/components/ui/SizeSelector/SizeSelector.tsx` | `sizes` (string[] hoặc object), `value`, `onChange`, radio group buttons chuẩn hóa | `<SizeSelector sizes={["S", "M", "L"]} value={size} onChange={setSize} />` | ✅ Pass (100% lines, axe a11y pass) |
| **ColorSwatchGroup** | `src/components/ui/ColorSwatch/ColorSwatch.tsx` | `colors` (`{ name, value, inStock }[]`), `value`, `onChange`, dùng CSS variable `--swatch-color` (0 inline CSS) | `<ColorSwatchGroup colors={swatches} value={color} onChange={setColor} />` | ✅ Pass (100% lines, axe a11y pass) |
| **Form* Wrappers** | `src/components/ui/Form/FormComponents.tsx` | `FormTextField`, `FormTextArea`, `FormSelect`, `FormCheckbox`, `FormCurrencyField`, `FormPhoneField`, `FormDatePicker` kết nối `react-hook-form` | `<FormCurrencyField control={form.control} name="deposit" label="Tiền cọc" />` | ✅ Pass (100% lines, axe a11y pass) |

---

## 1. Client Components (`client/src/components/ui/`)

Cấu trúc mỗi component: `client/src/components/ui/<ComponentName>/` gồm `<ComponentName>.tsx`, `<ComponentName>.test.tsx`, `index.ts`. Re-export tập trung qua `client/src/components/ui/index.ts`.

| Tên Component | Vị trí file | Props chính | Trạng thái Test & Coverage |
| :--- | :--- | :--- | :--- |
| **Button** | `Button/Button.tsx` | `variant` (primary, secondary, tertiary), `size` (md, sm), `isLoading`, `leftIcon`, `rightIcon`, `href` | ✅ Pass (96.12% lines) |
| **Input** | `Input/Input.tsx` | `label`, `helperText`, `error`, `leftIcon`, `rightIcon`, `id`, `disabled` | ✅ Pass (91.93% lines) |
| **Select** | `Select/Select.tsx` | `label`, `options`, `value`, `onChange`, `error`, `helperText` | ✅ Pass (96.72% lines) |
| **Textarea** | `Textarea/Textarea.tsx` | `label`, `helperText`, `error`, `rows`, `showCount` | ✅ Pass (98.93% lines) |
| **DateRangeField** | `DateRangeField/DateRangeField.tsx` | `label`, `startDate`, `endDate`, `onStartDateChange`, `onEndDateChange`, `error` | ✅ Pass (100% lines) |
| **Chip / ChipGroup** | `Chip/Chip.tsx` | `selected`, `label`, `onToggle`, `multiple` | ✅ Pass (99.29% lines) |
| **Badge** | `Badge/Badge.tsx` | `status` (OrderStatus), `variant` (BadgeVariant) | ✅ Pass (100% lines) |
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

*Tổng tỷ lệ bao phủ Client*: **97.44% statements / lines, 90.30% branches, 91.30% functions** (134 tests passed, 0 inline CSS).

---

## 2. CRM Components

CRM được chuẩn hóa hoàn toàn theo chuẩn **shadcn/ui**, loại bỏ 100% Ant Design. Cấu trúc tổ chức dạng module độc lập:
`crm/src/components/<category>/<ComponentName>/` gồm:
- `<ComponentName>.tsx`: Logic component chuẩn React/TypeScript, WAI-ARIA Accessible.
- `<ComponentName>.test.tsx`: Bộ kiểm thử đơn vị tự động.
- `<ComponentName>.scss`: Scoped SCSS module quản lý style theo design tokens (nếu có).
- `index.ts`: Re-export cho từng component.

### 2.1. CRM UI Primitives (`crm/src/components/ui/`)

| Tên Component | Vị trí file | Props chính | Ví dụ sử dụng (1 dòng) | Trạng thái Test |
| :--- | :--- | :--- | :--- | :--- |
| **Button** | `crm/src/components/ui/Button/` | `variant` (primary, secondary, outline, ghost, destructive, tertiary), `size` (default/md, sm, lg, icon), `isLoading`, `loading`, `leftIcon`, `rightIcon`, `href` | `<Button variant="primary" size="sm">Lưu dữ liệu</Button>` | ✅ Pass (96.02% lines) |
| **TextField / PasswordField / SearchField** | `crm/src/components/ui/TextField/` | `label`, `hint`, `error`, `startIcon`, `endIcon`, `required`, `onClear` | `<TextField label="Email" placeholder="admin@chickie.vn" />` | ✅ Pass (100% lines) |
| **TextArea** | `crm/src/components/ui/TextArea/` | `label`, `hint`, `error`, `rows`, `maxLength`, `showCount` | `<TextArea label="Ghi chú" showCount />` | ✅ Pass (100% lines) |
| **Select** | `crm/src/components/ui/Select/` | `label`, `hint`, `error`, `options`, `placeholder` | `<Select label="Trạng thái" options={opts} />` | ✅ Pass (99.5% lines) |
| **Checkbox** | `crm/src/components/ui/Checkbox/` | `label`, `hint`, `error`, `checked`, `onCheckedChange` | `<Checkbox label="Chọn tất cả" />` | ✅ Pass (100% lines) |
| **RadioGroup** | `crm/src/components/ui/RadioGroup/` | `label`, `hint`, `error`, `options`, `value`, `onValueChange` | `<RadioGroup options={opts} />` | ✅ Pass (100% lines) |
| **Switch** | `crm/src/components/ui/Switch/` | `label`, `hint`, `error`, `checked`, `onCheckedChange` | `<Switch label="Kích hoạt" />` | ✅ Pass (100% lines) |
| **Card** | `crm/src/components/ui/Card/` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `variant`, `interactive`, `hoverEffect` | `<Card hoverEffect><CardHeader><CardTitle>Tiêu đề</CardTitle></CardHeader></Card>` | ✅ Pass (100% lines) |
| **Badge** | `crm/src/components/ui/Badge/` | `variant` (default, primary, secondary, destructive, outline, success, warning, accent), `status` (OrderStatus) | `<Badge variant="success">Hoàn thành</Badge>` | ✅ Pass (96.07% lines) |
| **Spinner** | `crm/src/components/ui/Spinner/` | `size` (xs, sm, md, lg, xl), `variant` (primary, secondary, current, white) | `<Spinner size="md" />` | ✅ Pass (100% lines) |
| **Skeleton** | `crm/src/components/ui/Skeleton/` | `shape` (text, circular, rectangular, card) | `<Skeleton shape="rectangular" className="h-20" />` | ✅ Pass (100% lines) |

### 2.2. CRM Common Components (`crm/src/components/common/`)

| Tên Component | Vị trí thư mục | Props chính | Ví dụ sử dụng (1 dòng) | Trạng thái Test |
| :--- | :--- | :--- | :--- | :--- |
| **StatusBadge** | `crm/src/components/common/StatusBadge/` | `type` ("order" \| "item"), `status` (`OrderStatus` \| `ItemStatus`), `size` | `<StatusBadge type="order" status="DELIVERED" />` | ✅ Pass (94.25% lines) |
| **PageHeader** | `crm/src/components/common/PageHeader/` | `title`, `subtitle`, `breadcrumbs` (`{ title, href }[]`), `actions` | `<PageHeader title="Quản lý đơn thuê" subtitle="Danh sách toàn bộ đơn" actions={<Button>Thêm</Button>} />` | ✅ Pass (100% lines) |
| **DataTable** | `crm/src/components/common/DataTable/` | `columns`, `dataSource`, `loading`, `rowKey`, `pagination`, `onSelectionChange` | `<DataTable columns={cols} dataSource={data} rowKey="id" pagination={{ total: 100 }} />` | ✅ Pass (98.75% lines) |
| **FilterBar** | `crm/src/components/common/FilterBar/` | `searchPlaceholder`, `selectOptions`, `onFilterChange`, `onReset`, `extraActions` | `<FilterBar selectOptions={statusOpts} onFilterChange={handleFilter} extraActions={<Button>Xuất Excel</Button>} />` | ✅ Pass (100% lines) |
| **FormField** | `crm/src/components/common/FormField/` | `name`, `label`, `schema` (ZodType), `error`, `helperText`, `required` | `<FormField name="price" label="Giá thuê" error={err}><Input id="price" /></FormField>` | ✅ Pass (100% lines) |
| **ConfirmModal** | `crm/src/components/common/ConfirmModal/` | `open`, `title`, `content`, `onConfirm`, `onCancel`, `confirmLoading`, `isDestructive` | `<ConfirmModal open={open} title="Xóa sản phẩm" content="Hành động không thể hoàn tác" onConfirm={handleDelete} onCancel={() => setOpen(false)} />` | ✅ Pass (99.29% lines) |
| **ImageUploader** | `crm/src/components/common/ImageUploader/` | `fileList`, `onChange`, `maxCount` (8), `maxSizeMB` (5), `allowedTypes` | `<ImageUploader fileList={files} onChange={setFiles} maxCount={4} />` | ✅ Pass (100% lines) |
| **AppLayout** | `crm/src/components/common/AppLayout/` | `children`, `selectedKey`, `onMenuClick`, `userName`, `userRole`, `onLogout` | `<AppLayout selectedKey="orders" userName="Admin" onLogout={handleLogout}>...</AppLayout>` | ✅ Pass (100% lines) |
| **StatCard** | `crm/src/components/common/StatCard/` | `title`, `value`, `prefix`, `suffix`, `trend` (`{ value, isPositive, description }`), `icon` | `<StatCard title="Doanh thu" value="110,000,000" suffix="₫" trend={{ value: 12.5, isPositive: true }} icon={<DollarSign />} />` | ✅ Pass (100% lines) |
| **RevenueChart** | `crm/src/components/common/RevenueChart/` | `title`, `subtitle`, `data` (`{ label, revenue, orders }[]`), `height` | `<RevenueChart title="Doanh thu 6 tháng" data={monthlyData} />` | ✅ Pass (100% lines) |
| **EmptyState** | `crm/src/components/common/EmptyState/` | `description`, `actionText`, `onAction` | `<EmptyState description="Chưa có món đồ nào" actionText="Thêm ngay" onAction={openAdd} />` | ✅ Pass (100% lines) |
| **ErrorState** | `crm/src/components/common/ErrorState/` | `title`, `subTitle`, `onRetry` | `<ErrorState title="Mất kết nối" onRetry={refetch} />` | ✅ Pass (100% lines) |
| **PageLoading** | `crm/src/components/common/PageLoading/` | `tip` | `<PageLoading tip="Đang chuẩn bị báo cáo..." />` | ✅ Pass (100% lines) |

*Trang xem trước CRM*: Môi trường Dev (`crm/src/pages/DevComponentsPage.tsx`).
*Tổng tỷ lệ bao phủ CRM hiện tại*: **96.58% statements / lines, 91.11% branches, 85.71% functions** (133 tests passed, 0 inline CSS, không Ant Design).
