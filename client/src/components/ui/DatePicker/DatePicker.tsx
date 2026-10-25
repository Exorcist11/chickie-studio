"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DatePickerProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  value?: string; // ISO format "YYYY-MM-DD"
  onChange?: (dateIso: string) => void;
  minDate?: string; // ISO format "YYYY-MM-DD"
  maxDate?: string; // ISO format "YYYY-MM-DD"
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/**
 * Format ISO string YYYY-MM-DD to DD/MM/YYYY for display
 */
export function formatIsoToVietnamese(iso: string | undefined): string {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Convert Date object to YYYY-MM-DD string
 */
export function dateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  hint,
  error,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Chọn ngày (DD/MM/YYYY)",
  required = false,
  disabled = false,
  className,
  id,
}) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Month currently viewed in calendar
  const [viewDate, setViewDate] = React.useState<Date>(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  });

  React.useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) setViewDate(parsed);
    }
  }, [value]);

  // Click outside and Esc handling
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDate = (dateStr: string) => {
    onChange?.(dateStr);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

  const handleSelectToday = () => {
    const todayStr = dateToIso(new Date());
    handleSelectDate(todayStr);
  };

  // Generate calendar days
  const calendarDays = React.useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Monday-based index (0 = Monday, 6 = Sunday)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isDisabled: boolean }[] = [];

    // Prev month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(currentYear, currentMonth - 1, d);
      const str = dateToIso(prevDate);
      days.push({
        dateStr: str,
        dayNum: d,
        isCurrentMonth: false,
        isDisabled: Boolean((minDate && str < minDate) || (maxDate && str > maxDate)),
      });
    }

    // Current month days
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      const curDate = new Date(currentYear, currentMonth, d);
      const str = dateToIso(curDate);
      days.push({
        dateStr: str,
        dayNum: d,
        isCurrentMonth: true,
        isDisabled: Boolean((minDate && str < minDate) || (maxDate && str > maxDate)),
      });
    }

    // Next month padding to fill 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(currentYear, currentMonth + 1, d);
      const str = dateToIso(nextDate);
      days.push({
        dateStr: str,
        dayNum: d,
        isCurrentMonth: false,
        isDisabled: Boolean((minDate && str < minDate) || (maxDate && str > maxDate)),
      });
    }

    return days;
  }, [currentYear, currentMonth, minDate, maxDate]);

  const displayString = formatIsoToVietnamese(value);
  const todayIso = dateToIso(new Date());

  return (
    <div ref={containerRef} className={cn("relative w-full flex flex-col gap-1.5 text-left", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs md:text-sm font-medium text-ink flex items-center gap-1 select-none"
        >
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div className="relative flex items-center">
        <button
          ref={triggerRef}
          id={inputId}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            "w-full h-11 px-3.5 pr-10 text-sm font-sans bg-warm-white text-ink border rounded-btn transition-colors outline-none text-left flex items-center",
            "focus-visible:border-burgundy focus-visible:ring-2 focus-visible:ring-burgundy/20",
            "disabled:bg-rose/10 disabled:text-ink-muted disabled:cursor-not-allowed",
            error ? "border-danger" : "border-line",
            !displayString && "text-ink-muted"
          )}
        >
          {displayString || placeholder}
        </button>

        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Xóa ngày đã chọn"
            className="absolute right-9 p-1 text-ink-muted hover:text-ink rounded-full transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <CalendarIcon
          aria-hidden="true"
          className="absolute right-3.5 w-4 h-4 text-ink-muted pointer-events-none"
        />
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger leading-tight">
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={hintId} className="text-xs text-ink-muted leading-tight">
          {hint}
        </p>
      )}

      {/* Calendar Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Lịch chọn ngày"
          className="absolute top-full left-0 mt-2 z-50 p-4 bg-warm-white rounded-card border border-line shadow-raised w-[280px] animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Tháng trước"
              className="p-1 rounded-btn hover:bg-ivory text-ink transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm font-medium text-ink select-none">
              Tháng {currentMonth + 1}, {currentYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Tháng sau"
              className="p-1 rounded-btn hover:bg-ivory text-ink transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEKDAYS.map((w) => (
              <span key={w} className="text-xs font-semibold text-ink-muted select-none">
                {w}
              </span>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ dateStr, dayNum, isCurrentMonth, isDisabled }) => {
              const isSelected = dateStr === value;
              const isToday = dateStr === todayIso;

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDate(dateStr)}
                  className={cn(
                    "h-8 w-8 text-xs font-medium rounded-full flex items-center justify-center transition-colors select-none",
                    isDisabled && "opacity-25 cursor-not-allowed",
                    !isCurrentMonth && "text-ink-muted/50",
                    isCurrentMonth && !isSelected && "text-ink hover:bg-ivory",
                    isToday && !isSelected && "border border-burgundy/60 text-burgundy font-semibold",
                    isSelected && "bg-burgundy text-warm-white font-semibold shadow-xs"
                  )}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer presets */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-line/60">
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-xs font-medium text-burgundy hover:underline select-none"
            >
              Hôm nay
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-ink-muted hover:text-ink select-none"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
