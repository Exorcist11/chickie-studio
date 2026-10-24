import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import { RevenueChart } from "../components/common/RevenueChart";
import { PermissionGate } from "../routes/PermissionGate";

export const DashboardHome: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const chartData = [
    { label: "T2", revenue: 4500000 },
    { label: "T3", revenue: 6200000 },
    { label: "T4", revenue: 5800000 },
    { label: "T5", revenue: 7100000 },
    { label: "T6", revenue: 9500000 },
    { label: "T7", revenue: 12800000 },
    { label: "CN", revenue: 14200000 },
  ];

  return (
    <div className="space-y-6" data-testid="dashboard-home">
      <PageHeader
        title={`${t("menu.dashboard")} - ${user?.fullName || "Quản trị viên"}`}
        subtitle={`Vai trò: ${user?.role === "ROLE_ADMIN" ? "Chủ Shop (Admin)" : "Nhân Viên Vận Hành"}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t("kpi.orders")}
          value="48"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title={t("kpi.newCustomers")}
          value="19"
          trend={{ value: 5, isPositive: true }}
        />

        {/* Doanh thu chỉ hiển thị cho ADMIN theo BR-01 của AUTH-002 */}
        <PermissionGate allowedRoles="ROLE_ADMIN">
          <StatCard
            title={t("kpi.revenue")}
            value="60.100.000 ₫"
            trend={{ value: 8, isPositive: true }}
          />
        </PermissionGate>
      </div>

      {/* Biểu đồ doanh thu chỉ hiển thị cho ADMIN */}
      <PermissionGate allowedRoles="ROLE_ADMIN">
        <div className="mt-8">
          <RevenueChart data={chartData} title="Biểu đồ doanh thu tuần" />
        </div>
      </PermissionGate>
    </div>
  );
};

export default DashboardHome;
