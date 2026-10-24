import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Shirt,
  Layers,
  Users,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/cn";
import "./AppLayout.scss";

export interface AppLayoutProps {
  children: React.ReactNode;
  selectedKey?: string;
  onMenuClick?: (key: string) => void;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  selectedKey = "dashboard",
  onMenuClick,
  userName = "Quản trị viên",
  userRole = "Admin",
  onLogout,
}) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuItems = [
    { key: "dashboard", icon: LayoutDashboard, label: t("menu.dashboard") },
    { key: "orders", icon: ShoppingBag, label: t("menu.orders") },
    { key: "categories", icon: Layers, label: t("menu.categories") },
    { key: "products", icon: Shirt, label: t("menu.products") },
    { key: "customers", icon: Users, label: t("menu.customers") },
    { key: "reports", icon: BarChart3, label: t("menu.reports") },
    { key: "settings", icon: Settings, label: t("menu.settings") },
  ];

  return (
    <div className="min-h-screen flex bg-ivory/50">
      {/* Sidebar Dark Ink */}
      <aside
        className={cn(
          "bg-[#302528] text-stone-200 transition-all duration-300 flex flex-col shrink-0 z-30 shadow-xl",
          collapsed ? "w-20" : "w-60"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <span className="font-playfair font-bold text-white tracking-wide text-lg whitespace-nowrap overflow-hidden">
            {collapsed ? "CS" : "CHICKIE CRM"}
          </span>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            className="text-stone-400 hover:text-white p-1 rounded-btn hover:bg-white/10 transition-colors"
          >
            {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onMenuClick?.(item.key)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-btn text-sm font-medium transition-colors text-left",
                  isActive
                    ? "bg-burgundy text-white shadow-sm"
                    : "text-stone-300 hover:bg-white/10 hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-line px-6 flex items-center justify-between shadow-sm z-20">
          <div className="text-sm font-medium text-ink-muted">
            Hệ Thống Quản Lý Studio
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-btn hover:bg-ivory transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy"
            >
              <div className="w-8 h-8 rounded-full bg-burgundy text-white flex items-center justify-center font-semibold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-ink leading-tight">{userName}</div>
                <div className="text-[10px] text-ink-muted">{userRole}</div>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-card border border-line shadow-raised py-1 text-sm z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-line/60">
                  <p className="text-xs font-medium text-ink">{userName}</p>
                  <p className="text-[11px] text-ink-muted">{userRole}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-danger hover:bg-red-50 text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-card border border-line p-6 shadow-card min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

