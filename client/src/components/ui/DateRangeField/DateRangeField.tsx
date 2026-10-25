import * as React from "react";
import { cn } from "@/lib/cn";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

export interface DateRangeFieldProps {
  label?: string;
  helperText?: string;
  error?: string;
  startDate?: string;
  endDate?: string;
  minDate?: string;
  maxDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  startLabel?: string;
  endLabel?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export const DateRangeField: React.FC<DateRangeFieldProps> = ({
  label,
  helperText,
  error,
  startDate = "",
  endDate = "",
  minDate,
  maxDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = "Từ ngày",
  endLabel = "Đến ngày",
  disabled = false,
  required = false,
  className,
}) => {
  const generatedId = React.useId();
  const startId = `${generatedId}-start`;
  const endId = `${generatedId}-end`;
  const errorId = `${generatedId}-error`;
  const helperId = `${generatedId}-helper`;
  const hasError = Boolean(error);

  // Active popup state: 'start' | 'end' | null
  const [activePicker, setActivePicker] = React.useState<"start" | "end" | null>(null);

  // Current month displayed in popup
  const [viewDate, setViewDate] = React.useState<Date>(() => {
    const initial = startDate || endDate || minDate;
    return initial ? new Date(initial) : new Date();
  });

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close popup on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePicker(null);
      }
    };
    if (activePicker) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [activePicker]);

  // Handle open picker
  const handleOpenPicker = (field: "start" | "end") => {
    if (disabled) return;
    const targetVal = field === "start" ? startDate : endDate;
    if (targetVal) {
      const parsed = new Date(targetVal);
      if (!isNaN(parsed.getTime())) {
        setViewDate(parsed);
      }
    } else if (minDate) {
      const parsed = new Date(minDate);
      if (!isNaN(parsed.getTime())) {
        setViewDate(parsed);
      }
    }
    setActivePicker((prev) => (prev === field ? null : field));
  };

  // Month navigation
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sun
  const leadingBlanks = firstDay === 0 ? 6 : firstDay - 1;

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSelectDay = (day: number) => {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const selectedDateStr = `${year}-${monthStr}-${dayStr}`;

    if (activePicker === "start") {
      onStartDateChange?.(selectedDateStr);
      // Auto move to end date if end is empty or before start
      if (!endDate || endDate < selectedDateStr) {
        setActivePicker("end");
      } else {
        setActivePicker(null);
      }
    } else if (activePicker === "end") {
      onEndDateChange?.(selectedDateStr);
      setActivePicker(null);
    }
  };

  // Format date for visual display button
  const formatDisplay = (val: string) => {
    if (!val) return "Chọn ngày";
    const parts = val.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return val;
  };

  return (
    <div
      ref={containerRef}
      className={cn("w-full flex flex-col gap-1.5 text-left relative", className)}
    >
      {label && (
        <span className="text-sm font-medium text-ink select-none">
          {label}
          {required && (
            <span className="text-danger ml-1" aria-hidden="true">
              *
            </span>
          )}
        </span>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Start Date Field */}
        <div className="relative flex flex-col">
          <label htmlFor={startId} className="text-xs text-ink-muted mb-1 font-medium">
            {startLabel}
          </label>
          <div className="relative flex items-center">
            <span
              className="absolute left-3 text-ink-muted pointer-events-none inline-flex"
              aria-hidden="true"
            >
              <Calendar className="w-4 h-4 text-burgundy" />
            </span>
            <input
              id={startId}
              type="date"
              value={startDate}
              min={minDate}
              max={endDate || maxDate}
              disabled={disabled}
              required={required}
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
              onChange={(e) => onStartDateChange?.(e.target.value)}
              onClick={() => handleOpenPicker("start")}
              className={cn(
                "w-full min-h-[44px] pl-10 pr-9 py-2 rounded-btn bg-warm-white text-ink text-sm",
                "border border-line transition-colors cursor-pointer",
                "focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-ivory/50",
                "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-0 [&::-webkit-calendar-picker-indicator]:p-0",
                hasError && "border-danger focus:border-danger focus:ring-danger/20",
                activePicker === "start" && "border-burgundy ring-2 ring-burgundy/20"
              )}
            />
            <button
              type="button"
              aria-label={`Mở lịch chọn ${startLabel}`}
              disabled={disabled}
              onClick={() => handleOpenPicker("start")}
              className="absolute right-2.5 p-1 text-ink-muted hover:text-burgundy rounded-md transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* End Date Field */}
        <div className="relative flex flex-col">
          <label htmlFor={endId} className="text-xs text-ink-muted mb-1 font-medium">
            {endLabel}
          </label>
          <div className="relative flex items-center">
            <span
              className="absolute left-3 text-ink-muted pointer-events-none inline-flex"
              aria-hidden="true"
            >
              <Calendar className="w-4 h-4 text-burgundy" />
            </span>
            <input
              id={endId}
              type="date"
              value={endDate}
              min={startDate || minDate}
              max={maxDate}
              disabled={disabled}
              required={required}
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
              onChange={(e) => onEndDateChange?.(e.target.value)}
              onClick={() => handleOpenPicker("end")}
              className={cn(
                "w-full min-h-[44px] pl-10 pr-9 py-2 rounded-btn bg-warm-white text-ink text-sm",
                "border border-line transition-colors cursor-pointer",
                "focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-ivory/50",
                "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-0 [&::-webkit-calendar-picker-indicator]:p-0",
                hasError && "border-danger focus:border-danger focus:ring-danger/20",
                activePicker === "end" && "border-burgundy ring-2 ring-burgundy/20"
              )}
            />
            <button
              type="button"
              aria-label={`Mở lịch chọn ${endLabel}`}
              disabled={disabled}
              onClick={() => handleOpenPicker("end")}
              className="absolute right-2.5 p-1 text-ink-muted hover:text-burgundy rounded-md transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Styled DatePicker Popover */}
      {activePicker && (
        <div
          role="dialog"
          aria-label="Lịch chọn ngày"
          className={cn(
            "absolute z-30 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-line p-4 shadow-raised animate-in fade-in zoom-in-95 duration-150",
            activePicker === "start" ? "left-0" : "right-0"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <span className="font-semibold text-xs sm:text-sm text-ink">
              Tháng {month + 1} / {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Tháng trước"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-line text-ink hover:bg-ivory hover:text-burgundy transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label="Tháng sau"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-line text-ink hover:bg-ivory hover:text-burgundy transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label="Đóng bảng lịch"
                onClick={() => setActivePicker(null)}
                className="p-1.5 ml-1 rounded-lg text-ink-muted hover:text-ink hover:bg-ivory transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-muted py-2 border-b border-line/60">
            {WEEKDAYS.map((w, idx) => (
              <div key={w} className={idx >= 5 ? "text-burgundy/80 font-bold" : ""}>
                {w}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 pt-2">
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <div key={`blank-${i}`} className="h-8" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

              // Determine availability based on min/max constraints
              const isPastMin = minDate ? dateStr < minDate : false;
              const isPastMax = maxDate ? dateStr > maxDate : false;
              const isBeforeStart =
                activePicker === "end" && startDate ? dateStr < startDate : false;
              const isAfterEnd =
                activePicker === "start" && endDate ? dateStr > endDate : false;

              const isDisabled = isPastMin || isPastMax || isBeforeStart || isAfterEnd;

              const isStartSelected = startDate === dateStr;
              const isEndSelected = endDate === dateStr;
              const isSelected =
                activePicker === "start" ? isStartSelected : isEndSelected;
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    "h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all",
                    isDisabled && "text-ink-muted/30 cursor-not-allowed bg-ivory/20",
                    !isDisabled &&
                      !isSelected &&
                      "text-ink hover:bg-ivory hover:text-burgundy border border-transparent hover:border-line",
                    isSelected && "bg-burgundy text-white font-bold shadow-xs",
                    isToday && !isSelected && "border border-burgundy/40 text-burgundy font-semibold"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2 border-t border-line flex items-center justify-between text-[11px] text-ink-muted">
            <span>
              Đang chọn:{" "}
              <strong className="text-burgundy">
                {activePicker === "start" ? startLabel : endLabel}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => setActivePicker(null)}
              className="text-xs text-burgundy font-medium hover:underline"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}

      {hasError ? (
        <p id={errorId} className="text-xs text-danger font-medium mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-ink-muted mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
