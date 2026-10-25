import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  Clock,
  Calendar,
  AlertTriangle,
  Eye,
  CheckCircle,
  Truck,
  RotateCcw,
  Sparkles,
  CreditCard,
  Search,
  RefreshCw,
  ArrowRight,
  X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "../../services/booking.service";
import { bookingKeys } from "../../hooks/queries/bookingKeys";
import {
  BookingQueryParams,
  BookingResponse,
  BookingStatus,
  UpdateBookingStatusInput,
} from "../../types/booking";
import { PageHeader } from "../../components/common/PageHeader";
import { StatCard } from "../../components/common/StatCard";
import { DataTable, ColumnType, TablePagination } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { BookingDetailModal, UpdateStatusModal } from "./components";
import styles from "./OrdersPage.module.scss";

type TabFilterKey =
  | "ALL"
  | "PENDING"
  | "TODAY_DELIVER"
  | "TODAY_RETURN"
  | "DELIVERED"
  | "OVERDUE"
  | "COMPLETED"
  | "CANCELLED";

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TabFilterKey>("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<BookingStatus | null>(null);
  const [bookingForStatusUpdate, setBookingForStatusUpdate] = useState<BookingResponse | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Construct Query Params based on Active Tab
  const queryParams = useMemo<BookingQueryParams>(() => {
    const params: BookingQueryParams = {
      page,
      size: pageSize,
      sort: "createdAt,desc",
    };

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    switch (activeTab) {
      case "PENDING":
        params.status = "PENDING";
        break;
      case "TODAY_DELIVER":
        params.todayDeliver = true;
        break;
      case "TODAY_RETURN":
        params.todayReturn = true;
        break;
      case "DELIVERED":
        params.status = "DELIVERED";
        break;
      case "OVERDUE":
        params.overdue = true;
        break;
      case "COMPLETED":
        params.status = "COMPLETED";
        break;
      case "CANCELLED":
        params.status = "CANCELLED";
        break;
      case "ALL":
      default:
        break;
    }

    return params;
  }, [activeTab, debouncedSearch, startDate, endDate, page, pageSize]);

  // Fetch Bookings with TanStack Query
  const { data: pageResult, isLoading, isFetching, refetch } = useQuery({
    queryKey: bookingKeys.list(queryParams),
    queryFn: () => bookingService.getBookings(queryParams),
  });

  // Fetch KPI / Overview statistics query
  const { data: allStatsData } = useQuery({
    queryKey: bookingKeys.list({ size: 100 }),
    queryFn: () => bookingService.getBookings({ size: 100 }),
  });

  // Calculate quick stats from current batch
  const kpiStats = useMemo(() => {
    const items = allStatsData?.content || [];
    const total = allStatsData?.totalElements || items.length;
    const pending = items.filter((b) => b.status === "PENDING").length;
    const today = new Date().toISOString().split("T")[0];
    const todayDeliver = items.filter(
      (b) => b.rentalStartDate === today && (b.status === "CONFIRMED" || b.status === "DEPOSITED")
    ).length;
    const overdue = items.filter(
      (b) => b.status === "DELIVERED" && b.rentalEndDate < today
    ).length;

    return { total, pending, todayDeliver, overdue };
  }, [allStatsData]);

  // Mutation for Status Update
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateBookingStatusInput }) =>
      bookingService.updateBookingStatus(id, input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      setIsStatusModalOpen(false);
      setBookingForStatusUpdate(null);
      setTargetStatus(null);
      if (selectedBooking && selectedBooking.id === updated.id) {
        setSelectedBooking(updated);
      }
    },
  });

  const handleOpenDetail = (booking: BookingResponse) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleOpenStatusModal = (
    booking: BookingResponse,
    nextStatus: BookingStatus
  ) => {
    setBookingForStatusUpdate(booking);
    setTargetStatus(nextStatus);
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async (data: UpdateBookingStatusInput) => {
    if (!bookingForStatusUpdate) return;
    await updateStatusMutation.mutateAsync({
      id: bookingForStatusUpdate.id,
      input: data,
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const getQuickAction = useCallback(
    (record: BookingResponse) => {
      switch (record.status) {
        case "PENDING":
          return (
            <Button
              size="sm"
              variant="outline"
              className={styles.quickActionBtn}
              onClick={() => handleOpenStatusModal(record, "CONFIRMED")}
            >
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              {t("orders.actionsBtn.approve")}
            </Button>
          );
        case "CONFIRMED":
          return (
            <Button
              size="sm"
              variant="outline"
              className={styles.quickActionBtn}
              onClick={() => handleOpenStatusModal(record, "DEPOSITED")}
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              {t("orders.actionsBtn.deposit")}
            </Button>
          );
        case "DEPOSITED":
          return (
            <Button
              size="sm"
              variant="outline"
              className={styles.quickActionBtn}
              onClick={() => handleOpenStatusModal(record, "DELIVERED")}
            >
              <Truck className="w-3.5 h-3.5 text-burgundy" />
              {t("orders.actionsBtn.deliver")}
            </Button>
          );
        case "DELIVERED":
        case "OVERDUE":
          return (
            <Button
              size="sm"
              variant="outline"
              className={styles.quickActionBtn}
              onClick={() => handleOpenStatusModal(record, "RETURNED")}
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
              {t("orders.actionsBtn.return")}
            </Button>
          );
        case "RETURNED":
          return (
            <Button
              size="sm"
              variant="outline"
              className={styles.completeQuickBtn}
              onClick={() => handleOpenStatusModal(record, "COMPLETED")}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {t("orders.actionsBtn.complete")}
            </Button>
          );
        default:
          return null;
      }
    },
    [t]
  );

  // Table Columns Definition
  const columns = useMemo<ColumnType<BookingResponse>[]>(
    () => [
      {
        title: t("orders.bookingCode"),
        dataIndex: "bookingCode",
        key: "bookingCode",
        width: 170,
        render: (_val, record) => (
          <div className={styles.bookingCodeCol}>
            <button
              type="button"
              className={styles.codeLink}
              onClick={() => handleOpenDetail(record)}
            >
              {record.bookingCode}
            </button>
            <span className={styles.createdDateMini}>
              {new Date(record.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        ),
      },
      {
        title: t("orders.customer"),
        dataIndex: "customerName",
        key: "customerName",
        render: (_val, record) => (
          <div className={styles.customerCol}>
            <span className={styles.customerNameText}>{record.customerName}</span>
            <span className={styles.customerPhoneText}>{record.customerPhone}</span>
          </div>
        ),
      },
      {
        title: t("orders.deliveryMethod"),
        dataIndex: "deliveryMethod",
        key: "deliveryMethod",
        width: 170,
        render: (_val, record) => (
          <span className={styles.deliveryBadge}>
            {record.deliveryMethod === "PICKUP_STORE"
              ? t("orders.pickupStore")
              : t("orders.shipToAddress")}
          </span>
        ),
      },
      {
        title: t("orders.rentalPeriod"),
        dataIndex: "rentalStartDate",
        key: "rentalPeriod",
        width: 230,
        render: (_val, record) => (
          <div className={styles.dateCol}>
            <div className={styles.dateRangeText}>
              <span>{formatDate(record.rentalStartDate)}</span>
              <ArrowRight className="w-3 h-3 text-stone-400 shrink-0 inline mx-1" />
              <span>{formatDate(record.rentalEndDate)}</span>
            </div>
            <span className={styles.daysBadge}>
              {record.durationDays} {t("orders.days")}
            </span>
          </div>
        ),
      },
      {
        title: t("orders.status"),
        dataIndex: "status",
        key: "status",
        width: 170,
        render: (_val, record) => <StatusBadge type="order" status={record.status} />,
      },
      {
        title: t("orders.totalAmount"),
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 150,
        render: (_val, record) => (
          <span className={styles.totalAmountText}>
            {formatCurrency(record.totalAmount)}
          </span>
        ),
      },
      {
        title: t("orders.actions"),
        key: "actions",
        width: 200,
        render: (_val, record) => (
          <div className={styles.actionCell}>
            <Button
              size="sm"
              variant="ghost"
              className={styles.viewDetailBtn}
              onClick={() => handleOpenDetail(record)}
              title={t("orders.actionsBtn.view")}
              aria-label={`view-order-${record.bookingCode}`}
            >
              <Eye className="w-4 h-4 text-stone-600" />
            </Button>
            {getQuickAction(record)}
          </div>
        ),
      },
    ],
    [t, getQuickAction]
  );

  const paginationConfig: TablePagination = {
    current: page + 1,
    pageSize,
    total: pageResult?.totalElements || 0,
    onChange: (newPage, newPageSize) => {
      setPage(newPage - 1);
      setPageSize(newPageSize);
    },
  };

  const handleTabChange = (key: TabFilterKey) => {
    setActiveTab(key);
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchKeyword("");
    setDebouncedSearch("");
    setStartDate("");
    setEndDate("");
    setActiveTab("ALL");
    setPage(0);
  };

  return (
    <div className={styles.ordersPage}>
      {/* Page Header */}
      <PageHeader
        title={t("orders.title")}
        subtitle={t("orders.subtitle")}
        actions={
          <Button
            variant="outline"
            className={styles.refreshBtn}
            onClick={() => refetch()}
            disabled={isFetching}
            title="Làm mới dữ liệu"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin text-burgundy" : ""}`}
            />
            {t("common.loading") === "Đang tải dữ liệu..." ? "Làm mới" : "Refresh"}
          </Button>
        }
      />

      {/* KPI Overview Cards */}
      <div className={styles.kpiGrid}>
        <StatCard
          title={t("orders.totalOrders")}
          value={kpiStats.total}
          icon={<ShoppingBag className="w-5 h-5 text-burgundy" />}
        />
        <StatCard
          title={t("orders.pendingOrders")}
          value={kpiStats.pending}
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title={t("orders.todayDeliver")}
          value={kpiStats.todayDeliver}
          icon={<Calendar className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title={t("orders.overdueOrders")}
          value={kpiStats.overdue}
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
        />
      </div>

      {/* Filter Tabs / Pills */}
      <div className={styles.tabsWrapper}>
        <div className={styles.tabsScroll}>
          <button
            type="button"
            className={`${styles.tabPill} ${activeTab === "ALL" ? styles.tabPillActive : ""}`}
            onClick={() => handleTabChange("ALL")}
          >
            {t("orders.tabs.all")}
          </button>
          <button
            type="button"
            className={`${styles.tabPill} ${activeTab === "PENDING" ? styles.tabPillActive : ""}`}
            onClick={() => handleTabChange("PENDING")}
          >
            {t("orders.tabs.pending")}
          </button>
          <button
            type="button"
            className={`${styles.tabPill} ${activeTab === "TODAY_DELIVER" ? styles.tabPillActive : ""}`}
            onClick={() => handleTabChange("TODAY_DELIVER")}
          >
            {t("orders.tabs.todayDeliver")}
          </button>
          <button
            type="button"
            className={`${styles.tabPill} ${activeTab === "TODAY_RETURN" ? styles.tabPillActive : ""}`}
            onClick={() => handleTabChange("TODAY_RETURN")}
          >
            {t("orders.tabs.todayReturn")}
          </button>
          <button
            type="button"
            className={`${styles.tabPill} ${activeTab === "DELIVERED" ? styles.tabPillActive : ""}`}
            onClick={() => handleTabChange("DELIVERED")}
          >
            {t("orders.tabs.delivered")}
          </button>
          <button
            type="button"
            className={`${styles.tabPill} ${activeTab === "OVERDUE" ? styles.tabPillActive : ""}`}
            onClick={() => handleTabChange("OVERDUE")}
          >
            {t("orders.tabs.overdue")}
          </button>
          <button
            type="button"
            className={`${styles.tabPill} ${activeTab === "COMPLETED" ? styles.tabPillActive : ""}`}
            onClick={() => handleTabChange("COMPLETED")}
          >
            {t("orders.tabs.completed")}
          </button>
          <button
            type="button"
            className={`${styles.tabPill} ${activeTab === "CANCELLED" ? styles.tabPillActive : ""}`}
            onClick={() => handleTabChange("CANCELLED")}
          >
            {t("orders.tabs.cancelled")}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterCard}>
        <div className={styles.searchBox}>
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm theo mã đơn, số điện thoại, tên khách hàng..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <div className={styles.dateFilterGroup}>
          <div className={styles.datePickerContainer}>
            <Calendar className="w-4 h-4 text-burgundy shrink-0 ml-2.5" />
            <div className={styles.dateInputWrapper}>
              <span className={styles.dateLabelMini}>Từ:</span>
              <input
                type="date"
                className={styles.styledDateInput}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(0);
                }}
                aria-label="Từ ngày nhận đồ"
                title="Từ ngày nhận đồ"
              />
            </div>
            <span className={styles.dateArrow}>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </span>
            <div className={styles.dateInputWrapper}>
              <span className={styles.dateLabelMini}>Đến:</span>
              <input
                type="date"
                className={styles.styledDateInput}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(0);
                }}
                aria-label="Đến ngày trả đồ"
                title="Đến ngày trả đồ"
              />
            </div>
            {(startDate || endDate) && (
              <button
                type="button"
                className={styles.clearDateBtn}
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setPage(0);
                }}
                title="Xóa bộ lọc ngày"
                aria-label="Xóa bộ lọc ngày"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {(searchKeyword || startDate || endDate || activeTab !== "ALL") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className={styles.resetBtn}
            >
              {t("common.reset")}
            </Button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className={styles.tableCard}>
        <DataTable
          columns={columns}
          dataSource={pageResult?.content || []}
          loading={isLoading}
          rowKey="id"
          pagination={paginationConfig}
          emptyText="Chưa có đơn thuê nào phù hợp với bộ lọc hiện tại"
        />
      </div>

      {/* Modals */}
      <BookingDetailModal
        open={isDetailModalOpen}
        booking={selectedBooking}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBooking(null);
        }}
        onRequestStatusChange={(next) => {
          if (selectedBooking) {
            handleOpenStatusModal(selectedBooking, next);
          }
        }}
      />

      <UpdateStatusModal
        open={isStatusModalOpen}
        booking={bookingForStatusUpdate}
        targetStatus={targetStatus}
        loading={updateStatusMutation.isPending}
        onClose={() => {
          setIsStatusModalOpen(false);
          setBookingForStatusUpdate(null);
          setTargetStatus(null);
        }}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
};
export default OrdersPage;
