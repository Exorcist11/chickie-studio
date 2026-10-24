import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../components/common/AppLayout";

export const MainDashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("/orders")) return "orders";
    if (path.includes("/categories")) return "categories";
    if (path.includes("/products")) return "products";
    if (path.includes("/customers")) return "customers";
    if (path.includes("/reports")) return "reports";
    if (path.includes("/settings")) return "settings";
    return "dashboard";
  };

  const handleMenuClick = (key: string) => {
    if (key === "dashboard") navigate("/");
    else navigate(`/${key}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppLayout
      userName={user?.fullName || "Người dùng"}
      userRole={user?.role === "ROLE_ADMIN" ? "Admin" : "Nhân viên"}
      selectedKey={getSelectedKey()}
      onMenuClick={handleMenuClick}
      onLogout={handleLogout}
    >
      <Outlet />
    </AppLayout>
  );
};

export default MainDashboardLayout;
