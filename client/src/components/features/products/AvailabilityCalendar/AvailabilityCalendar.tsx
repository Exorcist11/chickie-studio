"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { getPublicProductAvailability } from "@/lib/api/product";
import { ProductAvailabilityResponse, DayAvailability } from "@/types/product";
import { BusinessPillar } from "../product-pillar.config";

export interface AvailabilityCalendarProps {
  productId?: number;
  slug: string;
  variantId?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  pillar?: BusinessPillar;
  initialMonth?: string; // YYYY-MM
  className?: string;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  slug,
  variantId,
  startDate,
  endDate,
  onDateRangeChange,
  pillar = "COSTUME",
  initialMonth,
  className,
}) => {
  // Current displayed Year-Month (e.g. "2026-11")
  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = React.useState<string>(
    initialMonth || currentMonthStr
  );
  const [availabilityData, setAvailabilityData] = React.useState<ProductAvailabilityResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hoveredDate, setHoveredDate] = React.useState<string | null>(null);

  // Selection internal states
  const [pickingStart, setPickingStart] = React.useState<string | null>(startDate || null);
  const [pickingEnd, setPickingEnd] = React.useState<string | null>(endDate || null);

  // Sync external dates if updated from parent
  React.useEffect(() => {
    if (startDate) setPickingStart(startDate);
    if (endDate) setPickingEnd(endDate);
  }, [startDate, endDate]);

  // Fetch availability on mount, month change or variant change
  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getPublicProductAvailability(slug, variantId, selectedMonth)
      .then((res) => {
        if (isMounted) {
          setAvailabilityData(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, variantId, selectedMonth]);

  // Month navigation helpers
  const [yearNum, monthNum] = selectedMonth.split("-").map((v) => parseInt(v, 10));
  const isCurrentMonth = selectedMonth <= currentMonthStr;

  const handlePrevMonth = () => {
    if (isCurrentMonth) return;
    const prevDate = new Date(yearNum, monthNum - 2, 1);
    setSelectedMonth(`${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`);
  };

  const handleNextMonth = () => {
    const nextDate = new Date(yearNum, monthNum, 1);
    setSelectedMonth(`${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`);
  };

  // Build grid calendar days: first day of month alignment
  const firstDayOfMonth = new Date(yearNum, monthNum - 1, 1).getDay(); // 0 is Sunday
  // Convert Sunday (0) to 6, Monday (1) to 0
  const emptyLeadingDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Map days by date key
  const dayMap = React.useMemo(() => {
    const map = new Map<string, DayAvailability>();
    if (availabilityData?.days) {
      for (const d of availabilityData.days) {
        map.set(d.date, d);
      }
    }
    return map;
  }, [availabilityData]);

  const daysInMonthCount = new Date(yearNum, monthNum, 0).getDate();

  // Handle click on a date
  const handleDateClick = (dateStr: string, isAvailable: boolean) => {
    if (!isAvailable) return;

    if (!pickingStart || (pickingStart && pickingEnd)) {
      // First click: select start date
      setPickingStart(dateStr);
      setPickingEnd(null);
    } else {
      // Second click: select end date
      if (dateStr < pickingStart) {
        // Clicked date is earlier: swap to new start
        setPickingStart(dateStr);
        setPickingEnd(null);
      } else {
        setPickingEnd(dateStr);
        onDateRangeChange?.(pickingStart, dateStr);
      }
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl bg-white border border-line p-4 sm:p-5 shadow-card space-y-4",
        className
      )}
    >
      {/* Header Month Navigation */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-burgundy" />
          <h4 className="font-semibold text-sm text-ink">
            Tháng {monthNum} / {yearNum}
          </h4>
          {availabilityData?.bufferDays && availabilityData.bufferDays > 0 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted bg-ivory px-2 py-0.5 rounded-full border border-line">
              <Clock className="w-3 h-3 text-burgundy" />
              Đệm giặt {availabilityData.bufferDays} ngày
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Tháng trước"
            disabled={isCurrentMonth}
            onClick={handlePrevMonth}
            className={cn(
              "p-1.5 rounded-lg border text-ink transition-colors",
              isCurrentMonth
                ? "border-line/40 text-ink-muted/40 cursor-not-allowed bg-ivory/20"
                : "border-line text-ink hover:bg-ivory hover:text-burgundy"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Tháng sau"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-line text-ink hover:bg-ivory hover:text-burgundy transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-muted border-b border-line/50 pb-2">
        {WEEKDAYS.map((w, idx) => (
          <div key={idx} className={idx >= 5 ? "text-burgundy/80 font-bold" : ""}>
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Leading empty cells */}
        {Array.from({ length: emptyLeadingDays }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-11 sm:h-12" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonthCount }).map((_, idx) => {
          const day = idx + 1;
          const dateStr = `${yearNum}-${String(monthNum).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayInfo = dayMap.get(dateStr);

          const isAvailable = dayInfo ? dayInfo.available : false;
          const isPast = dayInfo?.reason === "PAST_DATE";
          const isFullyBooked = dayInfo?.reason === "FULLY_BOOKED";
          const isMaintenance = dayInfo?.reason === "MAINTENANCE";

          const isStart = pickingStart === dateStr;
          const isEnd = pickingEnd === dateStr;
          const isInRange =
            pickingStart &&
            pickingEnd &&
            dateStr > pickingStart &&
            dateStr < pickingEnd;

          // In-progress range hover
          const isHoverInRange =
            pickingStart &&
            !pickingEnd &&
            hoveredDate &&
            hoveredDate > pickingStart &&
            dateStr > pickingStart &&
            dateStr <= hoveredDate;

          return (
            <button
              key={dateStr}
              type="button"
              data-testid={`calendar-day-${dateStr}`}
              aria-label={`Ngày ${day}${isFullyBooked ? " - Đã kín lịch" : isPast ? " - Đã qua" : ""}`}
              disabled={!isAvailable || isLoading}
              onClick={() => handleDateClick(dateStr, isAvailable)}
              onMouseEnter={() => setHoveredDate(dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
              className={cn(
                "relative h-11 sm:h-12 rounded-xl text-xs flex flex-col items-center justify-center transition-all group",
                // Base status styles
                isPast && "text-ink-muted/30 bg-ivory/20 cursor-not-allowed",
                (isFullyBooked || isMaintenance) &&
                  "bg-danger/5 text-ink-muted/60 line-through cursor-not-allowed border border-danger/10",
                isAvailable &&
                  !isStart &&
                  !isEnd &&
                  !isInRange &&
                  !isHoverInRange &&
                  "bg-white hover:bg-emerald-50 text-ink border border-line hover:border-emerald-500/50 hover:shadow-xs",
                // Selection highlight
                (isStart || isEnd) &&
                  "bg-burgundy text-white font-bold shadow-md z-10 scale-105",
                (isInRange || isHoverInRange) &&
                  "bg-burgundy/15 text-burgundy font-medium rounded-none first:rounded-l-xl last:rounded-r-xl"
              )}
            >
              <span className="font-semibold text-xs sm:text-sm">{day}</span>

              {/* Status indicator pill or dot */}
              {isAvailable && !isStart && !isEnd && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 group-hover:scale-125 transition-transform" />
              )}
              {(isStart || isEnd) && (
                <span className="text-[9px] font-normal opacity-90 leading-none mt-0.5">
                  {isStart ? "Nhận" : "Trả"}
                </span>
              )}
              {isFullyBooked && (
                <span className="text-[9px] text-danger/80 leading-none">Hết</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Dates Display & Clear Action */}
      {pickingStart && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-ivory/60 border border-line text-xs">
          <div className="flex items-center gap-1.5 text-ink">
            <CheckCircle2 className="w-4 h-4 text-burgundy shrink-0" />
            <span>
              {pickingEnd ? (
                <>
                  Khoảng thuê: <strong>{pickingStart}</strong> đến <strong>{pickingEnd}</strong>
                </>
              ) : (
                <>
                  Ngày nhận: <strong>{pickingStart}</strong> (Vui lòng click chọn ngày trả)
                </>
              )}
            </span>
          </div>

          <Button
            size="sm"
            variant="secondary"
            className="text-xs h-7 px-2 text-ink-muted hover:text-burgundy"
            onClick={() => {
              setPickingStart(null);
              setPickingEnd(null);
            }}
          >
            Chọn lại
          </Button>
        </div>
      )}

      {/* Legend & Guarantees */}
      <div className="pt-2 border-t border-line/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-ink-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span>Còn đồ sẵn sàng</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-burgundy shrink-0" />
          <span>Ngày bạn chọn</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-danger/50 shrink-0" />
          <span>Đã kín lịch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-ink-muted/30 shrink-0" />
          <span>Ngày đã qua</span>
        </div>
      </div>

      {/* Laundering Buffer Notice */}
      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-ivory/40 border border-line/60 text-[11px] text-ink-muted leading-relaxed">
        <Info className="w-3.5 h-3.5 text-burgundy shrink-0 mt-0.5" />
        <span>
          {pillar === "CAMERA"
            ? "Thiết bị được kiểm tra sạc pin và test lens ngay trước giờ bàn giao cho quý khách."
            : pillar === "PHOTOGRAPHY"
            ? "Mỗi khung giờ chỉ nhận 01 ca chụp độc quyền để đảm bảo chất lượng hình ảnh tốt nhất."
            : "Hệ thống tự động cộng 01 ngày đệm giặt hấp tiệt trùng an toàn sau mỗi lượt khách trả đồ."}
        </span>
      </div>
    </div>
  );
};
