import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Shirt,
  Layers,
  Users,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
  UserCog,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, Card } from "../../ui";
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
  userName,
  userRole,
  onLogout,
}) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const effectiveUserName = userName ?? t("layout.defaultUser");
  const effectiveUserRole = userRole ?? t("layout.defaultRole");

  const menuItems = [
    { key: "dashboard", icon: LayoutDashboard, label: t("menu.dashboard") },
    { key: "orders", icon: ShoppingBag, label: t("menu.orders") },
    { key: "calendar", icon: Calendar, label: t("menu.calendar") },
    { key: "categories", icon: Layers, label: t("menu.categories") },
    { key: "products", icon: Shirt, label: t("menu.products") },
    { key: "staffs", icon: UserCog, label: t("menu.staffs") },
    { key: "customers", icon: Users, label: t("menu.customers") },
    { key: "reports", icon: BarChart3, label: t("menu.reports") },
    { key: "settings", icon: Settings, label: t("menu.settings") },
  ];

  return (
    <div className="crm-app-layout">
      {/* Sidebar */}
      <aside
        className={cn(
          "crm-app-layout__sidebar",
          collapsed && "crm-app-layout__sidebar--collapsed"
        )}
      >
        {/* Brand Header */}
        <div className="crm-app-layout__brand">
          <span className="crm-app-layout__brand-text">
            {collapsed ? t("layout.brandShort") : t("layout.brand")}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? t("layout.expandSidebar") : t("layout.collapseSidebar")}
            className="crm-app-layout__brand-toggle h-8 w-8"
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="crm-app-layout__nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onMenuClick?.(item.key)}
                className={cn(
                  "crm-app-layout__nav-item",
                  isActive && "crm-app-layout__nav-item--active"
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
      <div className="crm-app-layout__content">
        {/* Header */}
        <header className="crm-app-layout__header">
          <div className="crm-app-layout__title">
            {t("layout.systemTitle")}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="crm-app-layout__user-trigger"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="crm-app-layout__user-avatar">
                <User className="w-4 h-4" />
              </div>
              <div className="crm-app-layout__user-info hidden sm:block">
                <div className="crm-app-layout__user-name">{effectiveUserName}</div>
                <div className="crm-app-layout__user-role">{effectiveUserRole}</div>
              </div>
            </button>

            {userMenuOpen && (
              <div className="crm-app-layout__dropdown">
                <div className="crm-app-layout__dropdown-header">
                  <p className="text-xs font-medium text-ink">{effectiveUserName}</p>
                  <p className="text-[11px] text-ink-muted">{effectiveUserRole}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUserMenuOpen(false);
                    onLogout?.();
                  }}
                  className="w-full justify-start text-xs font-medium text-danger hover:bg-red-50 hover:text-danger px-4 py-2 h-auto rounded-none"
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  {t("layout.logout")}
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="crm-app-layout__main">
          <Card className="p-6 min-h-[calc(100vh-8rem)]">
            {children}
          </Card>
        </main>
      </div>
    </div>
  );
};
