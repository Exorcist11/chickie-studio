import * as React from "react";
import { cn } from "@/lib/cn";
import { Calendar } from "lucide-react";

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

  return (
    <div className={cn("w-full flex flex-col gap-1.5 text-left", className)}>
      {label && (
        <span className="text-sm font-medium text-ink select-none">
          {label}
          {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
        </span>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Start Date */}
        <div className="relative flex flex-col">
          <label htmlFor={startId} className="text-xs text-ink-muted mb-1 font-medium">
            {startLabel}
          </label>
          <div className="relative flex items-center">
            <span
              className="absolute left-3 text-ink-muted pointer-events-none inline-flex"
              aria-hidden="true"
            >
              <Calendar className="w-4 h-4" />
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
              className={cn(
                "w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-btn bg-warm-white text-ink text-sm",
                "border border-line transition-colors cursor-pointer",
                "focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-ivory/50",
                hasError && "border-danger focus:border-danger focus:ring-danger/20"
              )}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="relative flex flex-col">
          <label htmlFor={endId} className="text-xs text-ink-muted mb-1 font-medium">
            {endLabel}
          </label>
          <div className="relative flex items-center">
            <span
              className="absolute left-3 text-ink-muted pointer-events-none inline-flex"
              aria-hidden="true"
            >
              <Calendar className="w-4 h-4" />
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
              className={cn(
                "w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-btn bg-warm-white text-ink text-sm",
                "border border-line transition-colors cursor-pointer",
                "focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-ivory/50",
                hasError && "border-danger focus:border-danger focus:ring-danger/20"
              )}
            />
          </div>
        </div>
      </div>

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
