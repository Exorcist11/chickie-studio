import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RoleGuard } from "./routes/RoleGuard";
import { LoginPage } from "./pages/auth/LoginPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { DashboardHome } from "./pages/DashboardHome";
import { MainDashboardLayout } from "./layouts/MainDashboardLayout";
import { DevComponentsPage } from "./pages/DevComponentsPage";
import "./i18n";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
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
              <Route path="/orders" element={<DashboardHome />} />
              <Route path="/products" element={<DashboardHome />} />
              <Route path="/customers" element={<DashboardHome />} />

              {/* Tuyến đường chỉ dành riêng cho Admin (AUTH-002) */}
              <Route element={<RoleGuard allowedRoles={["ROLE_ADMIN"]} />}>
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
  );
};

export default App;
