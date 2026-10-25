import React, { useState } from "react";
import { DollarSign, ShoppingBag, UserCheck } from "lucide-react";
import {
  AppLayout,
  PageHeader,
  StatusBadge,
  DataTable,
  FilterBar,
  FormField,
  ConfirmModal,
  ImageUploader,
  StatCard,
  RevenueChart,
  EmptyState,
  ErrorState,
  PageLoading,
  type OrderStatus,
  type ItemStatus,
  type ColumnType,
} from "../components/common";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Drawer,
  Menu,
  MenuItem,
  MenuHeader,
  MenuDivider,
  Popover,
  Tooltip,
  notify,
  CurrencyField,
  PhoneField,
  DatePicker,
  ChipGroup,
  SizeSelector,
  ColorSwatchGroup,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Breadcrumbs,
  Pagination,
  Gallery,
  Rating,
  SectionHeading,
  ProductCard,
} from "../components/ui";
import {
  Button as ChickieUIButton,
  TextField as ChickieTextField,
  PasswordField as ChickiePasswordField,
  SearchField as ChickieSearchField,
  TextArea as ChickieTextArea,
  Select as ChickieSelect,
  Checkbox as ChickieCheckbox,
  RadioGroup as ChickieRadioGroup,
  Switch as ChickieSwitch,
  Badge as ChickieBadge,
  Card as ChickieCard,
  CardHeader as ChickieCardHeader,
  CardTitle as ChickieCardTitle,
  CardDescription as ChickieCardDescription,
  CardContent as ChickieCardContent,
  CardFooter as ChickieCardFooter,
  Spinner as ChickieSpinner,
  Skeleton as ChickieSkeleton,
} from "../components/ui";

interface SampleOrderRecord extends Record<string, unknown> {
  id: string;
  customer: string;
  product: string;
  total: string;
  status: OrderStatus;
  date: string;
}

export const DevComponentsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [uiSearch, setUiSearch] = useState("");
  const [uiSelect, setUiSelect] = useState("AVAILABLE");
  const [uiChecked, setUiChecked] = useState(true);
  const [uiRadio, setUiRadio] = useState("direct");
  const [uiSwitch, setUiSwitch] = useState(true);
  const [crmDeposit, setCrmDeposit] = useState(500000);
  const [crmPhone, setCrmPhone] = useState("0987654321");
  const [crmDate, setCrmDate] = useState("2026-10-25");
  const [crmSize, setCrmSize] = useState("M");
  const [crmColor, setCrmColor] = useState("#641D2B");
  const [crmChip, setCrmChip] = useState("dress");
  const [crmTab, setCrmTab] = useState("overview");
  const [crmPage, setCrmPage] = useState(2);

  // Sample data for DataTable
  const sampleTableData: SampleOrderRecord[] = [
    {
      id: "ORD-001",
      customer: "Nguyễn Thị Hoa",
      product: "Váy cưới Ren Pháp Hoàng Gia",
      total: "2,500,000 ₫",
      status: "CONFIRMED",
      date: "2026-10-25",
    },
    {
      id: "ORD-002",
      customer: "Trần Mai Anh",
      product: "Áo dài Lụa Tơ Tằm Thêu Tay",
      total: "1,200,000 ₫",
      status: "DELIVERED",
      date: "2026-10-24",
    },
    {
      id: "ORD-003",
      customer: "Lê Hoàng Yến",
      product: "Combo Fujifilm X-T4 + Lens 35mm",
      total: "800,000 ₫",
      status: "OVERDUE",
      date: "2026-10-20",
    },
  ];

  const tableColumns: ColumnType<SampleOrderRecord>[] = [
    { title: "Mã đơn", dataIndex: "id", key: "id", width: 120 },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    { title: "Sản phẩm", dataIndex: "product", key: "product" },
    { title: "Tổng tiền", dataIndex: "total", key: "total" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus) => <StatusBadge type="order" status={status} />,
    },
    { title: "Ngày tạo", dataIndex: "date", key: "date" },
  ];

  const revenueData = [
    { label: "T5", revenue: 42000000 },
    { label: "T6", revenue: 58000000 },
    { label: "T7", revenue: 75000000 },
    { label: "T8", revenue: 64000000 },
    { label: "T9", revenue: 89000000 },
    { label: "T10", revenue: 110000000 },
  ];

  const orderStatuses: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "DEPOSITED",
    "DELIVERED",
    "RETURNED",
    "COMPLETED",
    "CANCELLED",
    "OVERDUE",
  ];

  const itemStatuses: ItemStatus[] = [
    "AVAILABLE",
    "RENTED",
    "CLEANING",
    "REPAIRING",
    "INACTIVE",
  ];

  return (
    <AppLayout selectedKey={activeMenu} onMenuClick={setActiveMenu}>
      <PageHeader
        title="CRM Design System & Showcase (shadcn/ui Standard)"
        subtitle="Môi trường xem trước và kiểm thử toàn bộ Component dùng chung của Chickie Studio CRM (Không Ant Design)"
        breadcrumbs={[
          { title: "Trang chủ" },
          { title: "Hệ thống" },
          { title: "Dev Components" },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => setModalOpen(true)}
          >
            Mở ConfirmModal Test
          </Button>
        }
      />

      <div className="space-y-8 mt-6">
        {/* 1. Status Badges */}
        <section className="bg-warm-white p-5 rounded-card border border-line">
          <h3 className="font-playfair text-lg font-semibold text-ink mb-4">
            1. Status Badges (Order & Item Status)
          </h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold uppercase text-ink-muted mb-2 tracking-wider">
                Trạng thái đơn hàng (Order Statuses):
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {orderStatuses.map((st) => (
                  <StatusBadge key={st} type="order" status={st} />
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-line/60">
              <h4 className="text-xs font-semibold uppercase text-ink-muted mb-2 tracking-wider">
                Trạng thái món đồ (Item Statuses):
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {itemStatuses.map((st) => (
                  <StatusBadge key={st} type="item" status={st} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Stat Cards & Revenue Chart */}
        <section className="bg-warm-white p-5 rounded-card border border-line">
          <h3 className="font-playfair text-lg font-semibold text-ink mb-4">
            2. KPI StatCards & Revenue Chart
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Doanh thu tháng này"
              value="110,000,000"
              suffix="₫"
              trend={{ value: 23.6, isPositive: true, description: "so với tháng trước" }}
              icon={<DollarSign className="w-5 h-5" />}
            />
            <StatCard
              title="Đơn thuê mới"
              value={148}
              trend={{ value: 12.0, isPositive: true, description: "tăng 16 đơn" }}
              icon={<ShoppingBag className="w-5 h-5" />}
            />
            <StatCard
              title="Khách hàng mới"
              value={82}
              trend={{ value: 4.5, isPositive: false, description: "giảm nhẹ" }}
              icon={<UserCheck className="w-5 h-5" />}
            />
          </div>

          <div className="mt-6">
            <RevenueChart
              title="Doanh thu 6 tháng gần nhất"
              subtitle="Cập nhật tự động theo kỳ báo cáo kinh doanh"
              data={revenueData}
            />
          </div>
        </section>

        {/* 3. FilterBar & DataTable */}
        <section className="bg-warm-white p-5 rounded-card border border-line">
          <h3 className="font-playfair text-lg font-semibold text-ink mb-4">
            3. FilterBar & DataTable
          </h3>
          <FilterBar
            selectOptions={[
              { label: "Chờ xác nhận", value: "PENDING" },
              { label: "Đã xác nhận", value: "CONFIRMED" },
              { label: "Đang cho thuê", value: "DELIVERED" },
              { label: "Quá hạn", value: "OVERDUE" },
            ]}
            onFilterChange={(v) => console.log("Filters changed:", v)}
            extraActions={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => notify.success("Xuất file Excel thành công!")}
              >
                Xuất Excel
              </Button>
            }
          />

          <DataTable<SampleOrderRecord>
            columns={tableColumns}
            dataSource={sampleTableData}
            rowKey="id"
            pagination={{ total: 3 }}
          />
        </section>

        {/* 4. FormField & ImageUploader */}
        <section className="bg-warm-white p-5 rounded-card border border-line">
          <h3 className="font-playfair text-lg font-semibold text-ink mb-4">
            4. FormField & ImageUploader
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Tên khách hàng"
                required
                placeholder="Ví dụ: Nguyễn Thị Hoa"
                helperText="Nhập đầy đủ họ và tên"
              />

              <Input
                label="Số điện thoại"
                required
                defaultValue="090123"
                error="Số điện thoại không đúng định dạng!"
              />
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-ink">
                Hình ảnh sản phẩm (ImageUploader):
              </div>
              <ImageUploader maxCount={4} />
            </div>
          </div>
        </section>

        {/* 5. Feedback States (EmptyState, ErrorState, PageLoading) */}
        <section className="bg-warm-white p-5 rounded-card border border-line">
          <h3 className="font-playfair text-lg font-semibold text-ink mb-4">
            5. Feedback States
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-card border border-line p-4">
              <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                EmptyState
              </h4>
              <EmptyState
                description="Chưa có món đồ nào"
                actionText="Thêm ngay"
                onAction={() => notify.info("Đã mở form thêm món đồ")}
              />
            </div>

            <div className="bg-white rounded-card border border-line p-4">
              <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                ErrorState
              </h4>
              <ErrorState
                title="Mất kết nối máy chủ"
                onRetry={() => notify.warning("Đang thử kết nối lại...")}
              />
            </div>

            <div className="bg-white rounded-card border border-line p-4">
              <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                PageLoading
              </h4>
              <PageLoading tip="Đang tải dữ liệu báo cáo..." />
            </div>
          </div>
        </section>

        {/* 6. @chickie/ui Base Components (Giai đoạn UI-1) */}
        <section className="bg-warm-white p-5 rounded-card border border-line space-y-6">
          <div>
            <h3 className="font-playfair text-lg font-semibold text-ink">
              6. Giai đoạn UI-1: Bộ Nhập Liệu Cơ Bản & Hiển Thị (@chickie/ui)
            </h3>
            <p className="text-sm text-ink-muted mt-1">
              Component chuẩn hóa bọc shadcn primitive (Zero Inline CSS, WAI-ARIA 100%, Vitest Coverage &gt; 80%)
            </p>
          </div>

          <div className="space-y-6">
            {/* Buttons */}
            <div className="bg-white p-4 rounded-card border border-line space-y-3">
              <h4 className="text-xs font-semibold uppercase text-ink-muted tracking-wider">
                1. Nút bấm (Button)
              </h4>
              <div className="flex flex-wrap gap-2.5">
                <ChickieUIButton variant="primary" size="md">Primary MD (44px)</ChickieUIButton>
                <ChickieUIButton variant="secondary" size="md">Secondary MD</ChickieUIButton>
                <ChickieUIButton variant="tertiary" size="md">Tertiary MD</ChickieUIButton>
                <ChickieUIButton variant="primary" size="sm">Primary SM (36px)</ChickieUIButton>
                <ChickieUIButton variant="primary" loading size="sm">Đang lưu...</ChickieUIButton>
                <ChickieUIButton variant="secondary" disabled size="sm">Vô hiệu hóa</ChickieUIButton>
              </div>
            </div>

            {/* TextFields */}
            <div className="bg-white p-4 rounded-card border border-line space-y-3">
              <h4 className="text-xs font-semibold uppercase text-ink-muted tracking-wider">
                2. Ô nhập liệu (TextField, PasswordField, SearchField)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ChickieTextField
                  label="Tên khách hàng"
                  placeholder="Ví dụ: Trần Mai Anh"
                  hint="Nhập đầy đủ tên theo CCCD"
                  required
                />
                <ChickiePasswordField
                  label="Mật khẩu nội bộ"
                  placeholder="Nhập tối thiểu 8 ký tự"
                  required
                />
                <ChickieSearchField
                  label="Tìm kiếm sản phẩm"
                  placeholder="Nhập mã sản phẩm hoặc tên váy..."
                  value={uiSearch}
                  onChange={(e) => setUiSearch(e.target.value)}
                  onClear={() => setUiSearch("")}
                />
              </div>
            </div>

            {/* TextArea & Select */}
            <div className="bg-white p-4 rounded-card border border-line space-y-3">
              <h4 className="text-xs font-semibold uppercase text-ink-muted tracking-wider">
                3. Vùng văn bản & Hộp chọn (TextArea & Select)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChickieTextArea
                  label="Ghi chú đơn hàng"
                  placeholder="Nhập tình trạng trang phục trước khi giao cho khách..."
                  maxLength={150}
                  showCount
                  hint="Lưu vào nhật ký kiểm đồ xuất kho"
                />
                <ChickieSelect
                  label="Trạng thái kho đồ"
                  value={uiSelect}
                  onChange={(e) => setUiSelect(e.target.value)}
                  options={[
                    { value: "AVAILABLE", label: "Có sẵn tại studio" },
                    { value: "RENTED", label: "Đang cho khách thuê" },
                    { value: "CLEANING", label: "Đang gửi giặt hấp cao cấp" },
                    { value: "REPAIRING", label: "Đang sửa đường may" },
                  ]}
                  hint="Hệ thống tự động cập nhật lịch khả dụng"
                />
              </div>
            </div>

            {/* Checkbox, RadioGroup & Switch */}
            <div className="bg-white p-4 rounded-card border border-line space-y-3">
              <h4 className="text-xs font-semibold uppercase text-ink-muted tracking-wider">
                4. Chọn lựa & Công tắc (Checkbox, RadioGroup & Switch)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <ChickieCheckbox
                    label="Khách đã đặt cọc CCCD"
                    hint="Giữ giấy tờ gốc tại két sắt quầy lễ tân"
                    checked={uiChecked}
                    onCheckedChange={setUiChecked}
                  />
                </div>
                <div>
                  <ChickieRadioGroup
                    label="Hình thức thanh toán"
                    name="crm-payment-type"
                    value={uiRadio}
                    onValueChange={setUiRadio}
                    options={[
                      { value: "direct", label: "Tiền mặt / Quẹt thẻ tại quầy" },
                      { value: "transfer", label: "Chuyển khoản VietQR" },
                    ]}
                  />
                </div>
                <div>
                  <ChickieSwitch
                    label="Gửi SMS thông báo nhắc trả đồ"
                    hint="Tự động gửi trước giờ trả 3 tiếng"
                    checked={uiSwitch}
                    onCheckedChange={setUiSwitch}
                  />
                </div>
              </div>
            </div>

            {/* Badges, Spinners & Skeletons */}
            <div className="bg-white p-4 rounded-card border border-line space-y-3">
              <h4 className="text-xs font-semibold uppercase text-ink-muted tracking-wider">
                5. Huy hiệu ngữ nghĩa & Trạng thái tải (Badge, Spinner & Skeleton)
              </h4>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-ink-muted block mb-2">Huy hiệu ngữ nghĩa (Badge):</span>
                  <div className="flex flex-wrap gap-2 items-center">
                    <ChickieBadge variant="primary">Primary</ChickieBadge>
                    <ChickieBadge variant="secondary">Secondary</ChickieBadge>
                    <ChickieBadge variant="accent">Accent</ChickieBadge>
                    <ChickieBadge variant="success">Hoàn thành</ChickieBadge>
                    <ChickieBadge variant="warning">Chờ xử lý</ChickieBadge>
                    <ChickieBadge variant="destructive">Quá hạn</ChickieBadge>
                    <ChickieBadge variant="outline">Đường viền</ChickieBadge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <span className="text-xs text-ink-muted block">Spinners:</span>
                    <div className="flex items-center gap-4">
                      <ChickieSpinner size="xs" />
                      <ChickieSpinner size="sm" />
                      <ChickieSpinner size="md" />
                      <ChickieSpinner size="lg" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-ink-muted block">Skeletons:</span>
                    <div className="flex items-center gap-3">
                      <ChickieSkeleton shape="circular" className="h-10 w-10 shrink-0" />
                      <div className="space-y-1 w-full">
                        <ChickieSkeleton shape="text" className="w-1/2" />
                        <ChickieSkeleton shape="text" className="w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compound Card */}
            <div className="bg-white p-4 rounded-card border border-line space-y-3">
              <h4 className="text-xs font-semibold uppercase text-ink-muted tracking-wider">
                6. Thẻ ghép cấu trúc (Compound Card)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ChickieCard variant="default">
                  <ChickieCardHeader>
                    <ChickieCardTitle>Đơn hàng #ORD-001</ChickieCardTitle>
                    <ChickieCardDescription>Khách: Nguyễn Thị Hoa</ChickieCardDescription>
                  </ChickieCardHeader>
                  <ChickieCardContent>
                    <p className="text-sm text-ink-muted">Tổng tiền: 2.500.000₫</p>
                  </ChickieCardContent>
                  <ChickieCardFooter>
                    <ChickieBadge variant="success">Đã cọc</ChickieBadge>
                  </ChickieCardFooter>
                </ChickieCard>

                <ChickieCard variant="elevated" interactive>
                  <ChickieCardHeader>
                    <ChickieCardTitle>Thẻ Nổi Bật (Interactive)</ChickieCardTitle>
                    <ChickieCardDescription>Hiệu ứng hover tương tác</ChickieCardDescription>
                  </ChickieCardHeader>
                  <ChickieCardContent>
                    <p className="text-sm text-ink-muted">Chạm vào để xem chi tiết đơn hàng.</p>
                  </ChickieCardContent>
                  <ChickieCardFooter>
                    <ChickieUIButton variant="primary" size="sm">Chi tiết</ChickieUIButton>
                  </ChickieCardFooter>
                </ChickieCard>

                <ChickieCard variant="outline">
                  <ChickieCardHeader>
                    <ChickieCardTitle>Báo cáo kho</ChickieCardTitle>
                    <ChickieCardDescription>Thống kê tháng 10</ChickieCardDescription>
                  </ChickieCardHeader>
                  <ChickieCardContent>
                    <p className="text-sm text-ink-muted">98% trang phục sẵn sàng sử dụng.</p>
                  </ChickieCardContent>
                  <ChickieCardFooter>
                    <ChickieBadge variant="outline">Báo cáo</ChickieBadge>
                  </ChickieCardFooter>
                </ChickieCard>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Giai đoạn UI-002: Lớp Phủ & Phản Hồi (@chickie/ui Overlays & Feedback) */}
        <section className="bg-warm-white p-5 rounded-card border border-line space-y-4">
          <div>
            <h3 className="font-playfair text-lg font-semibold text-ink">
              7. Giai đoạn UI-002: Lớp Phủ & Phản Hồi (Overlays & Feedback)
            </h3>
            <p className="text-sm text-ink-muted mt-1">
              Bộ Modal, Drawer, Menu, Popover, Tooltip và Notify chuẩn WAI-ARIA Accessible, Focus Trap, 0 Inline CSS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" onClick={() => setDrawerOpen(true)}>
              Mở Drawer (Ngăn kéo)
            </Button>

            <Menu trigger={<Button variant="secondary" size="sm">Tác vụ nhanh (Menu)</Button>}>
              <MenuHeader>Thao tác đơn</MenuHeader>
              <MenuItem onClick={() => notify.info("Đang in biên bản bàn giao...")}>In biên bản bàn giao</MenuItem>
              <MenuItem onClick={() => notify.success("Đã gửi mã VietQR cho khách!")}>Gửi lại mã VietQR</MenuItem>
              <MenuDivider />
              <MenuItem danger onClick={() => notify.error("Đã ghi nhận hỏng đồ")}>Báo cáo hỏng đồ</MenuItem>
            </Menu>

            <Popover trigger={<Button variant="secondary" size="sm">Bộ lọc nâng cao (Popover)</Button>}>
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-ink">Cấu hình hiển thị cột</h4>
                <p className="text-xs text-ink-muted">Tùy chỉnh các trường dữ liệu hiển thị trên bảng quản trị.</p>
                <div className="pt-2 flex justify-end">
                  <Button size="sm" onClick={() => notify.success("Đã lưu thiết lập!")}>Áp dụng</Button>
                </div>
              </div>
            </Popover>

            <Tooltip content="Nhấn để gửi thông báo thử nghiệm">
              <Button
                variant="outline"
                size="sm"
                onClick={() => notify.success("Thao tác CRM thành công!", { title: "Thông báo" })}
              >
                Gửi Notify Toast
              </Button>
            </Tooltip>
          </div>
        </section>

        {/* 8. Giai đoạn UI-003: Ngày & Form Chuyên Biệt (CurrencyField, PhoneField, DatePicker, Chip, Size, Color) */}
        <section className="bg-warm-white p-5 rounded-card border border-line space-y-4">
          <div>
            <h3 className="font-playfair text-lg font-semibold text-ink">
              8. Giai đoạn UI-003: Ngày & Form Chuyên Biệt (Form Fields, DatePicker & Selection)
            </h3>
            <p className="text-sm text-ink-muted mt-1">
              Bộ nhập liệu tiền tệ VND, số điện thoại VN, lịch DatePicker, ChipGroup, SizeSelector và ColorSwatchGroup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white rounded-card border border-line">
            <CurrencyField
              label="Tiền cọc nhận trước (VND)"
              value={crmDeposit}
              onChange={setCrmDeposit}
              quickPresets={[200000, 500000, 1000000]}
              hint="Nút chọn nhanh số tiền cọc"
              required
            />
            <PhoneField
              label="Số điện thoại nhân viên / khách"
              value={crmPhone}
              onChange={setCrmPhone}
              hint="Tự động định dạng đầu số VN"
              required
            />
            <DatePicker
              label="Ngày giao hàng dự kiến"
              value={crmDate}
              onChange={setCrmDate}
              hint="Chọn từ lịch WAI-ARIA"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white rounded-card border border-line">
            <div>
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                Loại trang phục (ChipGroup)
              </span>
              <ChipGroup
                options={[
                  { label: "Váy dạ hội", value: "dress" },
                  { label: "Áo dài", value: "aodai" },
                  { label: "Máy ảnh", value: "camera" },
                ]}
                value={crmChip}
                onChange={setCrmChip}
              />
            </div>

            <div>
              <SizeSelector
                value={crmSize}
                onChange={setCrmSize}
                sizes={["S", "M", "L", "XL"]}
              />
            </div>

            <div>
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                Bảng màu trang phục (ColorSwatchGroup)
              </span>
              <ColorSwatchGroup
                colors={[
                  { name: "Burgundy", hex: "#641D2B" },
                  { name: "Rose", hex: "#D48B97" },
                  { name: "Gold", hex: "#D4AF37" },
                  { name: "Ivory", hex: "#FDFBF7" },
                ]}
                selectedColor={crmColor}
                onSelectColor={setCrmColor}
                showName
              />
            </div>
          </div>
        </section>

        {/* 9. Giai đoạn UI-004: Hiển Thị Dữ Liệu (@chickie/ui Data Display) */}
        <section className="bg-warm-white p-5 rounded-card border border-line space-y-4">
          <div>
            <h3 className="font-playfair text-lg font-semibold text-ink">
              9. Giai đoạn UI-004: Hiển Thị Dữ Liệu (Data Display)
            </h3>
            <p className="text-sm text-ink-muted mt-1">
              Bộ Tabs, Accordion, Breadcrumbs, Pagination, Gallery, EmptyState, ErrorState và DataTable chuẩn shadcn/ui Standard.
            </p>
          </div>

          <div className="space-y-6 p-4 bg-white rounded-card border border-line">
            {/* Breadcrumbs */}
            <div>
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                Đường dẫn điều hướng (Breadcrumbs)
              </span>
              <Breadcrumbs
                homeLabel="Bảng điều khiển"
                homeHref="/dashboard"
                items={[
                  { label: "Quản lý sản phẩm", href: "/products" },
                  { label: "Chi tiết trang phục #CK-2026-09" },
                ]}
              />
            </div>

            {/* Tabs */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                Thanh chuyển Tab (Tabs - Pills & Underline)
              </span>
              <Tabs value={crmTab} onValueChange={setCrmTab} variant="pills">
                <TabsList>
                  <TabsTrigger value="overview">Tổng quan kho</TabsTrigger>
                  <TabsTrigger value="history">Lịch sử mượn trả</TabsTrigger>
                  <TabsTrigger value="maintenance">Bảo trì & Giặt ủi</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-4 bg-stone-50 rounded-md mt-3">
                  <p className="text-sm text-ink">Tổng số món đồ thực tế: 48 chiếc. Sẵn sàng cho thuê: 36 chiếc.</p>
                </TabsContent>
                <TabsContent value="history" className="p-4 bg-stone-50 rounded-md mt-3">
                  <p className="text-sm text-ink">Đã phục vụ 124 lượt thuê trong tháng 10/2026. Tỷ lệ hoàn trả đúng hạn 98.4%.</p>
                </TabsContent>
                <TabsContent value="maintenance" className="p-4 bg-stone-50 rounded-md mt-3">
                  <p className="text-sm text-ink">4 món đang trong quy trình đệm giặt hấp chuyên nghiệp. 1 món đang sửa đường may.</p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Accordion */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                Accordion (Thu phóng nội dung quản trị)
              </span>
              <Accordion type="single" collapsible defaultValue="acc-1">
                <AccordionItem value="acc-1">
                  <AccordionTrigger>Quy trình kiểm tra tình trạng đồ khi nhận lại từ khách</AccordionTrigger>
                  <AccordionContent>
                    1. Kiểm tra vết bẩn, rách sợi vải hoặc hư khóa kéo.<br />
                    2. Đối chiếu mã barcode trên thẻ bài của món đồ.<br />
                    3. Hoàn tiền cọc nếu đồ nguyên vẹn hoặc cấn trừ phí giặt tẩy theo quy định.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="acc-2">
                  <AccordionTrigger>Chính sách phạt trả đồ trễ hạn (Overdue Fee)</AccordionTrigger>
                  <AccordionContent>
                    Phí trễ hạn tính bằng 50% giá thuê ngày đầu cho mỗi ngày trễ. Nếu sau 3 ngày không liên lạc được, hệ thống sẽ tự động trừ toàn bộ cọc.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Gallery */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                Gallery (Thư viện media hình ảnh)
              </span>
              <div className="max-w-md">
                <Gallery
                  items={[
                    { src: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800", alt: "Ảnh sản phẩm 1" },
                    { src: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800", alt: "Ảnh sản phẩm 2" },
                    { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800", alt: "Ảnh sản phẩm 3" },
                  ]}
                  aspectRatio="4/3"
                />
              </div>
            </div>

            {/* Pagination & ErrorState */}
            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                  Phân trang (Pagination)
                </span>
                <Pagination
                  currentPage={crmPage}
                  totalPages={12}
                  onPageChange={setCrmPage}
                  showTotal
                  totalItems={120}
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                  Trạng thái lỗi (ErrorState)
                </span>
                <ErrorState
                  title="Không thể đồng bộ trạng thái đơn"
                  description="Dữ liệu tạm thời bị gián đoạn kết nối socket. Vui lòng bấm thử lại."
                  onRetry={() => notify.warning("Đang kết nối lại máy chủ CRM...")}
                  className="p-4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 10. Giai đoạn UI-5: Common Nghiệp Vụ (@chickie/ui) */}
        <section className="bg-warm-white p-5 rounded-card border border-line space-y-6">
          <div>
            <h3 className="font-playfair text-lg font-semibold text-ink">
              10. Giai đoạn UI-5: Common Nghiệp Vụ (@chickie/ui)
            </h3>
            <p className="text-sm text-ink-muted mt-1">
              Component nghiệp vụ chuẩn hóa: Rating, SectionHeading, ProductCard, StatusBadge, FilterBar, ImageUploader, StatCard
            </p>
          </div>

          <div className="space-y-6">
            {/* SectionHeading */}
            <div className="bg-white p-4 rounded-card border border-line">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-3">
                Tiêu đề phân đoạn (SectionHeading)
              </span>
              <SectionHeading
                title="Quản lý bộ sưu tập đầm dạ hội"
                description="Theo dõi danh mục, tình trạng thuê và giá niêm yết theo ngày của các mẫu thiết kế cao cấp"
                action={<Button size="sm">Xuất báo cáo tồn</Button>}
              />
            </div>

            {/* ProductCard & Rating */}
            <div className="bg-white p-4 rounded-card border border-line space-y-3">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
                Thẻ sản phẩm trang phục (ProductCard) & Đánh giá (Rating)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProductCard
                  id="1"
                  name="Váy Nàng Thơ Lụa Tơ Tằm"
                  code="CK-DR-2601"
                  category="Dạ hội"
                  imageUrl="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"
                  price={450000}
                  statusBadge={<StatusBadge type="item" status="AVAILABLE" size="sm" />}
                  rating={4.9}
                  reviewCount={24}
                  colors={[
                    { name: "Burgundy", hex: "#641D2B" },
                    { name: "Gold", hex: "#B8914F" },
                  ]}
                  onSelect={() => notify.info("Xem chi tiết đầm CK-DR-2601")}
                  onEdit={() => notify.info("Chỉnh sửa đầm CK-DR-2601")}
                />
                <ProductCard
                  id="2"
                  name="Áo Dài Gấm Phượng Hoàng"
                  code="CK-AD-1902"
                  category="Áo dài"
                  imageUrl="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500"
                  price={350000}
                  statusBadge={<StatusBadge type="item" status="RENTED" size="sm" />}
                  rating={5.0}
                  reviewCount={18}
                  colors={[
                    { name: "Rose Beige", hex: "#DCC8BD" },
                  ]}
                  onSelect={() => notify.info("Xem chi tiết áo dài CK-AD-1902")}
                  onEdit={() => notify.info("Chỉnh sửa áo dài CK-AD-1902")}
                />
                <div className="flex flex-col justify-between p-4 bg-stone-50 rounded-card border border-line">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block">
                      Các mức đánh giá (Rating)
                    </span>
                    <Rating score={5.0} reviewCount={42} size="md" />
                    <Rating score={4.5} reviewCount={16} size="sm" />
                    <Rating score={3.8} showCount={false} size="sm" />
                  </div>
                  <div className="pt-4 border-t border-line text-xs text-ink-muted">
                    Chuẩn WAI-ARIA Accessible role="img" kèm nhãn aria-label cho thiết bị trợ thính.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Ngăn kéo chi tiết đơn thuê"
        subtitle="Mã đơn: ORD-20261025-001"
        footer={<Button size="sm" onClick={() => setDrawerOpen(false)}>Đóng ngăn kéo</Button>}
      >
        <div className="space-y-3 text-sm text-ink-muted">
          <p>• Khách hàng: Lê Thuỳ Chi (0987654321)</p>
          <p>• Ngày nhận: 25/10/2026 - Ngày trả: 27/10/2026</p>
          <p>• Tiền cọc giữ đồ: 500.000₫ (Đã nhận chuyển khoản)</p>
        </div>
      </Drawer>

      <ConfirmModal
        open={modalOpen}
        title="Xác nhận cập nhật trạng thái"
        content="Bạn có chắc chắn muốn chuyển đơn hàng sang trạng thái ĐÃ HOÀN TẤT không?"
        onConfirm={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      />
    </AppLayout>
  );
};
