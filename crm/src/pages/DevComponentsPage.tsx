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
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [uiSearch, setUiSearch] = useState("");
  const [uiSelect, setUiSelect] = useState("AVAILABLE");
  const [uiChecked, setUiChecked] = useState(true);
  const [uiRadio, setUiRadio] = useState("direct");
  const [uiSwitch, setUiSwitch] = useState(true);

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
                onClick={() => alert("Xuất Excel thành công")}
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
                onAction={() => alert("Thêm đồ")}
              />
            </div>

            <div className="bg-white rounded-card border border-line p-4">
              <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                ErrorState
              </h4>
              <ErrorState
                title="Mất kết nối máy chủ"
                onRetry={() => alert("Thử lại")}
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
      </div>

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
