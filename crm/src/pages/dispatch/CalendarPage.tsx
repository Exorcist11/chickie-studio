import React, { useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  Calendar as CalendarIcon,
  Layers,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import {
  CalendarBookingDto,
  CalendarItemDto,
  DispatchViewMode,
  TimelineEventDto,
} from "../../types/dispatch";
import { BookingStatus } from "../../types/booking";
import {
  useCalendarDataQuery,
  useTimelineDataQuery,
} from "../../hooks/queries/useDispatch";
import { Button } from "../../components/ui/Button";
import { BookingCalendarView } from "./components/BookingCalendarView";
import { ItemTimelineView } from "./components/ItemTimelineView";
import { BookingDetailModal } from "./components/BookingDetailModal";
import { ReassignItemModal } from "./components/ReassignItemModal";
import { RescheduleModal } from "./components/RescheduleModal";
import styles from "./CalendarPage.module.scss";

export const CalendarPage: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<DispatchViewMode>("calendar");
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");

  // Modals state
  const [detailBooking, setDetailBooking] = useState<CalendarBookingDto | null>(null);
  const [rescheduleBooking, setRescheduleBooking] = useState<CalendarBookingDto | null>(null);
  const [reassignData, setReassignData] = useState<{
    bookingItemId: number;
    bookingCode?: string;
    currentBarcode?: string;
    productName?: string;
    variantInfo?: string;
    rentalDates?: string;
  } | null>(null);

  // Month range
  const startDate = currentDate.startOf("month").format("YYYY-MM-DD");
  const endDate = currentDate.endOf("month").format("YYYY-MM-DD");

  // Fetch Calendar Data
  const { data: calendarData, isLoading: isLoadingCalendar } = useCalendarDataQuery(
    {
      startDate,
      endDate,
      status: statusFilter || undefined,
      search: searchKeyword.trim() || undefined,
    },
    viewMode === "calendar"
  );

  // Fetch Timeline Data
  const { data: timelineData, isLoading: isLoadingTimeline } = useTimelineDataQuery(
    {
      startDate,
      endDate,
      search: searchKeyword.trim() || undefined,
    },
    viewMode === "timeline"
  );

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => prev.add(1, "month"));
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  // Open Reassign from detail modal
  const handleOpenReassign = (booking: CalendarBookingDto, item: CalendarItemDto) => {
    setReassignData({
      bookingItemId: item.bookingItemId,
      bookingCode: booking.bookingCode,
      currentBarcode: item.barcode,
      productName: item.productName,
      variantInfo: item.variantInfo,
      rentalDates: `${booking.rentalStartDate} → ${booking.rentalEndDate}`,
    });
  };

  // Open Reschedule from detail modal
  const handleOpenReschedule = (booking: CalendarBookingDto) => {
    setRescheduleBooking(booking);
  };

  // Timeline event click handler
  const handleSelectTimelineEvent = (event: TimelineEventDto) => {
    // If the booking exists in current calendar list, open detail modal
    const matched = calendarData?.bookings.find((b: CalendarBookingDto) => b.id === event.bookingId);
    if (matched) {
      setDetailBooking(matched);
    } else {
      // Create minimal booking DTO to display details
      setDetailBooking({
        id: event.bookingId,
        bookingCode: event.bookingCode,
        customerName: event.customerName,
        customerPhone: event.customerPhone,
        status: event.status,
        rentalStartDate: event.startDate,
        rentalEndDate: event.endDate,
        totalRentalPrice: event.rentalPrice,
        totalDepositPrice: event.depositPrice,
        totalAmount: event.rentalPrice + event.depositPrice,
        itemCount: 1,
        items: [
          {
            bookingItemId: event.bookingItemId,
            barcode: "",
            productName: "Hiện vật thuê",
            variantInfo: "",
            rentalPrice: event.rentalPrice,
          },
        ],
      });
    }
  };

  const bookingStatusOptions: { value: BookingStatus | ""; label: string }[] = [
    { value: "", label: t("dispatch.allStatuses") },
    { value: "PENDING", label: t("orderStatus.PENDING") },
    { value: "CONFIRMED", label: t("orderStatus.CONFIRMED") },
    { value: "DEPOSITED", label: t("orderStatus.DEPOSITED") },
    { value: "DELIVERED", label: t("orderStatus.DELIVERED") },
    { value: "RETURNED", label: t("orderStatus.RETURNED") },
    { value: "COMPLETED", label: t("orderStatus.COMPLETED") },
    { value: "CANCELLED", label: t("orderStatus.CANCELLED") },
    { value: "OVERDUE", label: t("orderStatus.OVERDUE") },
  ];

  return (
    <div className={styles.calendarPage}>
      {/* Page Header */}
      <div className={styles.calendarPage__header}>
        <div className={styles.calendarPage__titleGroup}>
          <h1 className={styles.calendarPage__title}>{t("dispatch.title")}</h1>
          <p className={styles.calendarPage__subtitle}>{t("dispatch.subtitle")}</p>
        </div>

        {/* View Switcher: Calendar vs Timeline */}
        <div className={styles.calendarPage__viewSwitcher} role="group" aria-label="Chế độ xem">
          <button
            type="button"
            className={`${styles.calendarPage__switchBtn} ${
              viewMode === "calendar" ? styles["calendarPage__switchBtn--active"] : ""
            }`}
            onClick={() => setViewMode("calendar")}
            aria-pressed={viewMode === "calendar"}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>{t("dispatch.calendarView")}</span>
          </button>
          <button
            type="button"
            className={`${styles.calendarPage__switchBtn} ${
              viewMode === "timeline" ? styles["calendarPage__switchBtn--active"] : ""
            }`}
            onClick={() => setViewMode("timeline")}
            aria-pressed={viewMode === "timeline"}
          >
            <Layers className="w-4 h-4" />
            <span>{t("dispatch.timelineView")}</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Navigator & Filters */}
      <div className={styles.calendarPage__toolbar}>
        {/* Month Navigator */}
        <div className={styles.calendarPage__navigator}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrevMonth}
            aria-label="Tháng trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToday}
          >
            {t("dispatch.today")}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            aria-label="Tháng sau"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div className={styles.calendarPage__monthTitle}>
            {t("dispatch.monthYear", {
              month: currentDate.format("MM"),
              year: currentDate.format("YYYY"),
            })}
          </div>
        </div>

        {/* Filters */}
        <div className={styles.calendarPage__filters}>
          {/* Status filter (only for calendar view) */}
          {viewMode === "calendar" && (
            <select
              aria-label={t("dispatch.filterByStatus")}
              className={styles.calendarPage__select}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "")}
            >
              {bookingStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {/* Search box */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-2.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              aria-label={t("dispatch.searchPlaceholder")}
              className={`${styles.calendarPage__searchInput} pl-8`}
              placeholder={t("dispatch.searchPlaceholder")}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "calendar" ? (
        <BookingCalendarView
          currentDate={currentDate}
          bookings={calendarData?.bookings || []}
          isLoading={isLoadingCalendar}
          onSelectBooking={(b) => setDetailBooking(b)}
        />
      ) : (
        <ItemTimelineView
          currentDate={currentDate}
          resources={timelineData?.resources || []}
          isLoading={isLoadingTimeline}
          onSelectEvent={handleSelectTimelineEvent}
        />
      )}

      {/* Booking Detail Modal */}
      <BookingDetailModal
        isOpen={!!detailBooking}
        booking={detailBooking}
        onClose={() => setDetailBooking(null)}
        onReassign={handleOpenReassign}
        onReschedule={handleOpenReschedule}
      />

      {/* Reassign Item Modal */}
      <ReassignItemModal
        isOpen={!!reassignData}
        bookingItemId={reassignData?.bookingItemId || null}
        bookingCode={reassignData?.bookingCode}
        currentBarcode={reassignData?.currentBarcode}
        productName={reassignData?.productName}
        variantInfo={reassignData?.variantInfo}
        rentalDates={reassignData?.rentalDates}
        onClose={() => setReassignData(null)}
      />

      {/* Reschedule Booking Modal */}
      <RescheduleModal
        isOpen={!!rescheduleBooking}
        bookingId={rescheduleBooking?.id || null}
        bookingCode={rescheduleBooking?.bookingCode}
        customerName={rescheduleBooking?.customerName}
        currentStartDate={rescheduleBooking?.rentalStartDate}
        currentEndDate={rescheduleBooking?.rentalEndDate}
        onClose={() => setRescheduleBooking(null)}
      />
    </div>
  );
};

export default CalendarPage;
