import React, { useMemo } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { TimelineEventDto, TimelineResourceDto } from "../../../types/dispatch";
import { Spinner } from "../../../components/ui/Spinner";
import { StatusBadge, ItemStatus } from "../../../components/common/StatusBadge";
import styles from "./ItemTimelineView.module.scss";

export interface ItemTimelineViewProps {
  currentDate: dayjs.Dayjs;
  resources: TimelineResourceDto[];
  isLoading: boolean;
  onSelectEvent?: (event: TimelineEventDto) => void;
}

interface TimelineSegment {
  type: "event" | "buffer" | "empty";
  event?: TimelineEventDto;
  day?: number;
  span: number;
  key: string;
}

export const ItemTimelineView: React.FC<ItemTimelineViewProps> = ({
  currentDate,
  resources,
  isLoading,
  onSelectEvent,
}) => {
  const { t } = useTranslation();
  const today = dayjs();
  const daysInMonth = currentDate.daysInMonth();

  // Generate days array for the current month
  const monthDays = useMemo(() => {
    const list: dayjs.Dayjs[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      list.push(currentDate.date(i));
    }
    return list;
  }, [currentDate, daysInMonth]);

  // Compute row segments for each resource
  const computeRowSegments = (resource: TimelineResourceDto): TimelineSegment[] => {
    const segments: TimelineSegment[] = [];
    let day = 1;

    // Filter events overlapping with this month
    const monthStartStr = currentDate.startOf("month").format("YYYY-MM-DD");
    const monthEndStr = currentDate.endOf("month").format("YYYY-MM-DD");

    const activeEvents = (resource.events || []).filter((e) => {
      const eEnd = e.bufferDays > 0 ? e.bufferEndDate : e.endDate;
      return eEnd >= monthStartStr && e.startDate <= monthEndStr;
    });

    while (day <= daysInMonth) {
      const dateStr = currentDate.date(day).format("YYYY-MM-DD");

      // Check if day falls in rental phase of an event
      const rentalEvent = activeEvents.find(
        (e) => dateStr >= e.startDate && dateStr <= e.endDate
      );

      if (rentalEvent) {
        const eEnd = dayjs(rentalEvent.endDate);
        const rentalEndDay =
          eEnd.month() === currentDate.month()
            ? Math.min(daysInMonth, eEnd.date())
            : daysInMonth;

        const span = Math.max(1, rentalEndDay - day + 1);
        segments.push({
          type: "event",
          event: rentalEvent,
          span,
          key: `event-${rentalEvent.bookingItemId}-${day}`,
        });
        day += span;
        continue;
      }

      // Check if day falls in laundry buffer phase of an event
      const bufferEvent = activeEvents.find((e) => {
        if (e.bufferDays <= 0) return false;
        const bufStartStr = dayjs(e.endDate).add(1, "day").format("YYYY-MM-DD");
        return dateStr >= bufStartStr && dateStr <= e.bufferEndDate;
      });

      if (bufferEvent) {
        const bEnd = dayjs(bufferEvent.bufferEndDate);
        const bufEndDay =
          bEnd.month() === currentDate.month()
            ? Math.min(daysInMonth, bEnd.date())
            : daysInMonth;

        const span = Math.max(1, bufEndDay - day + 1);
        segments.push({
          type: "buffer",
          event: bufferEvent,
          span,
          key: `buffer-${bufferEvent.bookingItemId}-${day}`,
        });
        day += span;
        continue;
      }

      // Empty cell
      segments.push({
        type: "empty",
        day,
        span: 1,
        key: `empty-${day}`,
      });
      day += 1;
    }

    return segments;
  };

  if (isLoading) {
    return (
      <div className={styles.timelineView__emptyState}>
        <Spinner size="lg" />
        <span className="text-sm font-medium">{t("common.loading")}</span>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className={styles.timelineView__emptyState}>
        <p className="text-base font-medium text-stone-700">Không tìm thấy tài nguyên kho đồ phù hợp</p>
        <p className="text-xs text-muted-foreground">Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc phân loại</p>
      </div>
    );
  }

  return (
    <div className={styles.timelineView}>
      <div className={styles.timelineView__wrapper}>
        <table className={styles.timelineView__table}>
          <thead className={styles.timelineView__thead}>
            <tr className={styles.timelineView__headerRow}>
              <th className={styles.timelineView__resourceTh}>
                {t("dispatch.resources")} ({resources.length})
              </th>
              {monthDays.map((d) => {
                const isToday = d.isSame(today, "day");
                const dayOfWeek = d.day();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                return (
                  <th
                    key={d.format("YYYY-MM-DD")}
                    className={`${styles.timelineView__dayTh} ${
                      isToday ? styles["timelineView__dayTh--today"] : ""
                    } ${isWeekend ? styles["timelineView__dayTh--weekend"] : ""}`}
                    data-testid={`timeline-header-${d.format("YYYY-MM-DD")}`}
                  >
                    <div className={styles.timelineView__dayNumber}>{d.date()}</div>
                    <div className={styles.timelineView__dayOfWeek}>
                      {d.format("dd")}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {resources.map((res) => {
              const segments = computeRowSegments(res);

              return (
                <tr key={res.itemId} className={styles.timelineView__row}>
                  {/* Sticky Resource Column */}
                  <td className={styles.timelineView__resourceTd}>
                    <div className={styles.timelineView__resourceInfo}>
                      <div className={styles.timelineView__resourceHeader}>
                        <span className={styles.timelineView__barcode}>{res.barcode}</span>
                        <StatusBadge
                          type="item"
                          status={res.itemStatus as ItemStatus}
                          size="sm"
                        />
                      </div>
                      <div className={styles.timelineView__productName} title={res.productName}>
                        {res.productName}
                      </div>
                      <div className={styles.timelineView__variant}>
                        {res.variantInfo || res.categoryType}
                      </div>
                    </div>
                  </td>

                  {/* Days Timeline Cells */}
                  {segments.map((seg) => {
                    if (seg.type === "event" && seg.event) {
                      const e = seg.event;
                      return (
                        <td
                          key={seg.key}
                          colSpan={seg.span}
                          className={styles.timelineView__cell}
                        >
                          <button
                            type="button"
                            className={`${styles.timelineView__event} ${
                              styles[`timelineView__event--status-${e.status}`] || ""
                            }`}
                            onClick={() => onSelectEvent?.(e)}
                            title={`${e.bookingCode} - ${e.customerName} (${e.startDate} → ${e.endDate})`}
                          >
                            <span className={styles.timelineView__eventCode}>{e.bookingCode}</span>
                            <span className={styles.timelineView__eventName}>{e.customerName}</span>
                          </button>
                        </td>
                      );
                    }

                    if (seg.type === "buffer" && seg.event) {
                      return (
                        <td
                          key={seg.key}
                          colSpan={seg.span}
                          className={styles.timelineView__cell}
                        >
                          <div
                            className={styles.timelineView__buffer}
                            title={`${t("dispatch.laundryBuffer")}: ${seg.event.startDate} → ${seg.event.endDate} + 1 ngày giặt sấy`}
                          >
                            {t("dispatch.laundryBuffer")}
                          </div>
                        </td>
                      );
                    }

                    // Empty cell
                    const isToday =
                      seg.day !== undefined &&
                      currentDate.date(seg.day).isSame(today, "day");

                    return (
                      <td
                        key={seg.key}
                        colSpan={seg.span}
                        className={`${styles.timelineView__cell} ${
                          isToday ? styles["timelineView__cell--today"] : ""
                        }`}
                      >
                        <div className={styles.timelineView__emptyCell} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
