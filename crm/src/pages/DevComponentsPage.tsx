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

        {/* 6. shadcn UI Primitives (Button, Input, Card, Badge) */}
        <section className="bg-warm-white p-5 rounded-card border border-line">
          <h3 className="font-playfair text-lg font-semibold text-ink mb-4">
            6. UI Primitives (shadcn/ui Standard)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card hoverEffect>
              <CardHeader>
                <CardTitle>Thẻ Primitive (Card Component)</CardTitle>
                <CardDescription>Thiết kế dạng thẻ card chuẩn shadcn với slot phân tách</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Mặc định</Badge>
                  <Badge variant="secondary">Thứ cấp</Badge>
                  <Badge variant="destructive">Cảnh báo</Badge>
                  <Badge variant="success">Thành công</Badge>
                  <Badge variant="warning">Chờ xử lý</Badge>
                  <Badge variant="outline">Đường viền</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" size="sm">Primary</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                  <Button variant="ghost" size="sm">Ghost</Button>
                  <Button variant="destructive" size="sm">Destructive</Button>
                  <Button isLoading size="sm">Loading</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Input Primitives</CardTitle>
                <CardDescription>Ô nhập liệu tuân thủ chuẩn a11y với nhãn và helper</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input label="Email công việc" placeholder="admin@chickie.vn" />
                <Input label="Mật khẩu" type="password" placeholder="••••••••" helperText="Tối thiểu 8 ký tự" />
              </CardContent>
            </Card>
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
