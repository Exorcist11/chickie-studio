import React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { CalendarBookingDto } from "../../../types/dispatch";
import { Spinner } from "../../../components/ui/Spinner";
import styles from "./BookingCalendarView.module.scss";

export interface BookingCalendarViewProps {
  currentDate: dayjs.Dayjs;
  bookings: CalendarBookingDto[];
  isLoading: boolean;
  onSelectBooking: (booking: CalendarBookingDto) => void;
}

export const BookingCalendarView: React.FC<BookingCalendarViewProps> = ({
  currentDate,
  bookings,
  isLoading,
  onSelectBooking,
}) => {
  const { t } = useTranslation();
  const today = dayjs();

  // Generate 7-day headers Mon -> Sun
  const weekDays = [
    t("dispatch.mon"),
    t("dispatch.tue"),
    t("dispatch.wed"),
    t("dispatch.thu"),
    t("dispatch.fri"),
    t("dispatch.sat"),
    t("dispatch.sun"),
  ];

  // Month bounds
  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");

  // Determine starting Monday
  // dayjs: 0=Sunday, 1=Monday, ..., 6=Saturday
  const startDayOfWeek = startOfMonth.day();
  const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const gridStart = startOfMonth.subtract(startOffset, "day");

  // Determine ending Sunday
  const endDayOfWeek = endOfMonth.day();
  const endOffset = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
  const gridEnd = endOfMonth.add(endOffset, "day");

  // Build grid days
  const calendarDays: dayjs.Dayjs[] = [];
  let curr = gridStart;
  while (curr.isBefore(gridEnd) || curr.isSame(gridEnd, "day")) {
    calendarDays.push(curr);
    curr = curr.add(1, "day");
  }

  if (isLoading) {
    return (
      <div className={styles.calendarView__empty}>
        <Spinner size="lg" />
        <span className="text-sm font-medium">{t("common.loading")}</span>
      </div>
    );
  }

  return (
    <div className={styles.calendarView}>
      {/* Weekday headers */}
      <div className={styles.calendarView__weekdaysHeader}>
        {weekDays.map((name, idx) => (
          <div
            key={name}
            className={`${styles.calendarView__weekdayCell} ${
              idx >= 5 ? styles["calendarView__weekdayCell--weekend"] : ""
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={styles.calendarView__grid}>
        {calendarDays.map((d) => {
          const dateStr = d.format("YYYY-MM-DD");
          const isOtherMonth = d.month() !== currentDate.month();
          const isToday = d.isSame(today, "day");

          const dayBookings = bookings.filter((b) => {
            return dateStr >= b.rentalStartDate && dateStr <= b.rentalEndDate;
          });

          const maxVisible = 3;
          const visibleBookings = dayBookings.slice(0, maxVisible);
          const hiddenCount = dayBookings.length - maxVisible;

          return (
            <div
              key={dateStr}
              className={`${styles.calendarView__dayCell} ${
                isOtherMonth ? styles["calendarView__dayCell--otherMonth"] : ""
              } ${isToday ? styles["calendarView__dayCell--today"] : ""}`}
              data-testid={`calendar-cell-${dateStr}`}
            >
              <div className={styles.calendarView__dayHeader}>
                <span
                  className={`${styles.calendarView__dayNumber} ${
                    isToday ? styles["calendarView__dayNumber--today"] : ""
                  }`}
                >
                  {d.date()}
                </span>
                {dayBookings.length > 0 && (
                  <span className={styles.calendarView__bookingCount}>
                    {dayBookings.length} {t("dispatch.bookings")}
                  </span>
                )}
              </div>

              <div className={styles.calendarView__eventsList}>
                {visibleBookings.map((b) => (
                  <button
                    key={`${dateStr}-${b.id}`}
                    type="button"
                    className={`${styles.calendarView__chip} ${
                      styles[`calendarView__chip--status-${b.status}`] || ""
                    }`}
                    onClick={() => onSelectBooking(b)}
                    title={`${b.bookingCode} - ${b.customerName} (${b.rentalStartDate} → ${b.rentalEndDate})`}
                  >
                    <span className={styles.calendarView__chipCode}>{b.bookingCode}</span>
                    <span className={styles.calendarView__chipName}>{b.customerName}</span>
                  </button>
                ))}

                {hiddenCount > 0 && (
                  <button
                    type="button"
                    className={styles.calendarView__moreLink}
                    onClick={() => onSelectBooking(dayBookings[maxVisible])}
                  >
                    +{hiddenCount} {t("dispatch.otherBookings")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
