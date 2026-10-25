import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { RoleGuard } from "./routes/RoleGuard";
import { LoginPage } from "./pages/auth/LoginPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { DashboardHome } from "./pages/DashboardHome";
import { CategoriesPage } from "./pages/categories/CategoriesPage";
import { ProductsPage } from "./pages/products/ProductsPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { MainDashboardLayout } from "./layouts/MainDashboardLayout";
import { DevComponentsPage } from "./pages/DevComponentsPage";
import "./i18n";

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          {/* Development Showcase */}
          <Route path="/dev/components" element={<DevComponentsPage />} />

          {/* Protected CRM Routes */}
          <Route element={<RoleGuard />}>
            <Route element={<MainDashboardLayout />}>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/bookings" element={<OrdersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/customers" element={<DashboardHome />} />

              {/* Tuyến đường chỉ dành riêng cho Admin (AUTH-002, CAT-001) */}
              <Route element={<RoleGuard allowedRoles={["ROLE_ADMIN"]} />}>
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/reports" element={<DashboardHome />} />
                <Route path="/settings" element={<DashboardHome />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
};

export default App;
