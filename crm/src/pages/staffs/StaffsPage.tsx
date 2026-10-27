import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  Mail,
  Phone,
  Edit2,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "../../components/common/PageHeader";
import { StatCard } from "../../components/common/StatCard";
import { DataTable, ColumnType } from "../../components/common/DataTable";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Switch } from "../../components/ui/Switch";
import { notify } from "../../components/ui/Notify";
import { useAuth } from "../../context/AuthContext";
import { staffService } from "../../services/staff.service";
import { staffKeys } from "../../hooks/queries/staffKeys";
import { StaffUser, StaffQueryParams } from "../../types/staff";
import { UserRole, UserStatus } from "../../types/auth";
import {
  CreateStaffModal,
  EditStaffModal,
  ResetPasswordModal,
} from "./components";
import { cn } from "../../lib/cn";
import styles from "./StaffsPage.module.scss";

export const StaffsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "">("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [resetPasswordStaff, setResetPasswordStaff] = useState<StaffUser | null>(null);
  const [lockingStaff, setLockingStaff] = useState<StaffUser | null>(null);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedRole("");
    setSelectedStatus("");
    setPage(0);
  };

  const queryParams = useMemo<StaffQueryParams>(() => {
    return {
      search: debouncedSearch || undefined,
      role: (selectedRole as UserRole) || undefined,
      status: (selectedStatus as UserStatus) || undefined,
      page,
      size: pageSize,
      sort: "createdAt,desc",
    };
  }, [debouncedSearch, selectedRole, selectedStatus, page, pageSize]);

  const { data: pageData, isLoading, refetch } = useQuery({
    queryKey: staffKeys.list(queryParams),
    queryFn: () => staffService.getStaffs(queryParams),
  });

  const staffList = useMemo(() => pageData?.content || [], [pageData]);
  const totalElements = pageData?.totalElements || 0;

  // Compute stat counts
  const stats = useMemo(() => {
    const total = totalElements;
    const active = staffList.filter((s) => s.status === "ACTIVE").length;
    const locked = staffList.filter((s) => s.status === "LOCKED").length;
    return { total, active, locked };
  }, [totalElements, staffList]);

  const handleToggleStatus = (staff: StaffUser) => {
    const isCurrentActive = staff.status === "ACTIVE";

    if (isCurrentActive) {
      if (currentUser?.username && staff.username.toLowerCase() === currentUser.username.toLowerCase()) {
        notify.warning(t("staff.cannotLockSelf"));
        return;
      }
      if (staff.username.toLowerCase() === "admin") {
        notify.warning(t("staff.cannotLockRootAdmin"));
        return;
      }
      setLockingStaff(staff);
      setIsLockModalOpen(true);
    } else {
      // Unlock account directly
      staffService
        .updateStaffStatus(staff.id, { status: "ACTIVE" })
        .then(() => {
          notify.success(t("staff.unlockSuccess"));
          queryClient.invalidateQueries({ queryKey: staffKeys.all });
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "Không thể mở khóa tài khoản";
          notify.error(message);
        });
    }
  };

  const handleConfirmLock = async () => {
    if (!lockingStaff) return;
    try {
      setLockLoading(true);
      await staffService.updateStaffStatus(lockingStaff.id, { status: "LOCKED" });
      notify.success(t("staff.lockSuccess"));
      setIsLockModalOpen(false);
      setLockingStaff(null);
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể khóa tài khoản";
      notify.error(message);
    } finally {
      setLockLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const columns: ColumnType<StaffUser>[] = [
    {
      title: t("staff.colName"),
      key: "name",
      render: (_, record) => {
        const initials = record.fullName
          ? record.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : record.username.slice(0, 2).toUpperCase();

        return (
          <div className={styles.staffsPage__userCell}>
            <div className={styles.staffsPage__avatar}>{initials}</div>
            <div className={styles.staffsPage__userInfo}>
              <span className={styles.staffsPage__userName}>{record.fullName}</span>
              <span className={styles.staffsPage__userHandle}>@{record.username}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: t("staff.colContact"),
      key: "contact",
      render: (_, record) => (
        <div className={styles.staffsPage__contactCell}>
          <span className={styles.staffsPage__contactItem}>
            <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {record.email}
          </span>
          {record.phone && (
            <span className={styles.staffsPage__contactItem}>
              <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              {record.phone}
            </span>
          )}
        </div>
      ),
    },
    {
      title: t("staff.colRole"),
      key: "role",
      render: (_, record) => {
        const isAdmin = record.role === "ROLE_ADMIN";
        return (
          <Badge
            variant={isAdmin ? "default" : "secondary"}
            className={isAdmin ? "bg-burgundy/10 text-burgundy border-burgundy/20 font-medium" : "bg-slate-100 text-slate-700 border-slate-200"}
          >
            {isAdmin ? (
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-burgundy" />
                {t("staff.roleAdmin")}
              </span>
            ) : (
              t("staff.roleStaff")
            )}
          </Badge>
        );
      },
    },
    {
      title: t("staff.colStatus"),
      key: "status",
      render: (_, record) => {
        const isActive = record.status === "ACTIVE";
        const isSelf = currentUser?.username && record.username.toLowerCase() === currentUser.username.toLowerCase();
        const isRootAdmin = record.username.toLowerCase() === "admin";
        const isProtected = isSelf || isRootAdmin;

        return (
          <div className="flex items-center gap-3">
            <Switch
              checked={isActive}
              disabled={isProtected}
              onCheckedChange={() => handleToggleStatus(record)}
              aria-label={`status-toggle-${record.username}`}
              title={
                isSelf
                  ? "Không thể khóa tài khoản của chính mình"
                  : isRootAdmin
                  ? "Tài khoản Quản trị viên gốc được bảo vệ"
                  : undefined
              }
            />
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border select-none transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                  : "bg-rose-50 text-rose-700 border-rose-200/80"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  isActive ? "bg-emerald-500" : "bg-rose-500"
                )}
                aria-hidden="true"
              />
              {isActive ? t("staff.statusActive") : t("staff.statusLocked")}
            </span>
          </div>
        );
      },
    },
    {
      title: t("staff.colCreatedAt"),
      key: "createdAt",
      render: (_, record) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(record.createdAt as string)}
        </span>
      ),
    },
    {
      title: t("common.actions"),
      key: "actions",
      render: (_, record) => (
        <div className={styles.staffsPage__actions}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setEditingStaff(record)}
            aria-label={`edit-${record.username}`}
            className="h-8 w-8 text-muted-foreground hover:text-burgundy"
            title={t("common.edit")}
          >
            <Edit2 className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setResetPasswordStaff(record)}
            aria-label={`reset-pwd-${record.username}`}
            className="h-8 w-8 text-muted-foreground hover:text-amber-600"
            title={t("staff.resetPasswordTitle")}
          >
            <KeyRound className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.staffsPage}>
      {/* Header */}
      <PageHeader
        title={t("staff.title")}
        subtitle={t("staff.subtitle")}
        breadcrumbs={[
          { title: t("menu.dashboard", "Tổng quan"), href: "/" },
          { title: t("staff.title", "Nhân viên") },
        ]}
        actions={
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4 shrink-0" />}
          >
            {t("staff.addBtn")}
          </Button>
        }
      />

      {/* Stat Cards */}
      <div className={styles.staffsPage__stats}>
        <StatCard
          title={t("staff.totalStaff")}
          value={stats.total}
          icon={<Users className="w-5 h-5 text-burgundy" />}
        />
        <StatCard
          title={t("staff.activeStaff")}
          value={stats.active}
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title={t("staff.lockedStaff")}
          value={stats.locked}
          icon={<UserX className="w-5 h-5 text-danger" />}
        />
      </div>

      {/* Filters */}
      <div className={styles.staffsPage__filters}>
        <div className={styles.staffsPage__searchWrapper}>
          <Search className={styles.staffsPage__searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("staff.searchPlaceholder")}
            className={styles.staffsPage__searchInput}
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value as UserRole | "");
            setPage(0);
          }}
          className={styles.staffsPage__select}
        >
          <option value="">{t("staff.allRoles")}</option>
          <option value="ROLE_ADMIN">{t("staff.roleAdmin")}</option>
          <option value="ROLE_STAFF">{t("staff.roleStaff")}</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value as UserStatus | "");
            setPage(0);
          }}
          className={styles.staffsPage__select}
        >
          <option value="">{t("staff.allStatuses")}</option>
          <option value="ACTIVE">{t("staff.statusActive")}</option>
          <option value="LOCKED">{t("staff.statusLocked")}</option>
        </select>

        {(Boolean(search) || Boolean(selectedRole) || Boolean(selectedStatus)) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className={styles.staffsPage__resetBtn}
            title={t("common.reset", "Đặt lại")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("common.reset", "Đặt lại")}</span>
          </button>
        )}
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        dataSource={staffList}
        loading={isLoading}
        rowKey="id"
        emptyText={t("staff.noStaffFound")}
        pagination={{
          current: page + 1,
          pageSize,
          total: totalElements,
          onChange: (newPage, newPageSize) => {
            setPage(newPage - 1);
            setPageSize(newPageSize);
          },
        }}
      />

      {/* Create Modal */}
      <CreateStaffModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: staffKeys.all });
          refetch();
        }}
      />

      {/* Edit Modal */}
      <EditStaffModal
        open={Boolean(editingStaff)}
        staff={editingStaff}
        onClose={() => setEditingStaff(null)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: staffKeys.all });
          refetch();
        }}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        open={Boolean(resetPasswordStaff)}
        staff={resetPasswordStaff}
        onClose={() => setResetPasswordStaff(null)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: staffKeys.all });
        }}
      />

      {/* Confirm Lock Modal */}
      <ConfirmModal
        open={isLockModalOpen}
        title={t("staff.confirmLockTitle")}
        content={t("staff.confirmLockMessage", { name: lockingStaff?.fullName })}
        onConfirm={handleConfirmLock}
        onCancel={() => {
          setIsLockModalOpen(false);
          setLockingStaff(null);
        }}
        confirmLoading={lockLoading}
        isDestructive={true}
      />
    </div>
  );
};

export default StaffsPage;
