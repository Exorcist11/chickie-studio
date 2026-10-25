import React, { useId, useMemo, useState, useEffect } from "react";
import { cn } from "../../../lib/cn";
import { formatCurrencyVND, parseCurrencyVND } from "./CurrencyField.utils";

export interface CurrencyFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  value?: number | string;
  onChange?: (numericValue: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  quickPresets?: number[];
  className?: string;
}

export const CurrencyField = React.forwardRef<HTMLInputElement, CurrencyFieldProps>(
  (
    {
      label,
      hint,
      error,
      value,
      onChange,
      suffix = "₫",
      min = 0,
      max,
      quickPresets,
      placeholder = "0",
      disabled = false,
      required = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const numericValue = useMemo(() => {
      if (value === undefined || value === null || value === "") return 0;
      return typeof value === "string" ? parseCurrencyVND(value) : value;
    }, [value]);

    const [displayVal, setDisplayVal] = useState<string>(() =>
      formatCurrencyVND(value)
    );

    useEffect(() => {
      setDisplayVal(formatCurrencyVND(value));
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawText = e.target.value;
      const parsed = parseCurrencyVND(rawText);

      let finalValue = parsed;
      if (min !== undefined && finalValue < min) {
        finalValue = min;
      }
      if (max !== undefined && finalValue > max) {
        finalValue = max;
      }

      setDisplayVal(rawText ? formatCurrencyVND(finalValue) : "");
      onChange?.(finalValue);
    };

    const handlePresetClick = (amount: number) => {
      if (disabled) return;
      onChange?.(amount);
    };

    return (
      <div className={cn("w-full flex flex-col gap-1.5 text-left", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs md:text-sm font-medium text-ink flex items-center gap-1 select-none"
          >
            {label}
            {required && <span className="text-danger">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            {...props}
            ref={ref}
            id={inputId}
            type="text"
            inputMode="numeric"
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            value={displayVal}
            onChange={handleInputChange}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              "w-full h-11 px-3.5 pr-10 text-sm font-sans bg-warm-white text-ink border rounded-btn transition-colors outline-none",
              "focus:border-burgundy focus:ring-2 focus:ring-burgundy/20",
              "disabled:bg-rose/10 disabled:text-ink-muted disabled:cursor-not-allowed",
              error
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-line"
            )}
          />

          <span
            aria-hidden="true"
            className="absolute right-3.5 text-sm font-medium text-ink-muted pointer-events-none select-none"
          >
            {suffix}
          </span>
        </div>

        {quickPresets && quickPresets.length > 0 && !disabled && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {quickPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  "px-2 py-0.5 text-xs rounded-tag border transition-colors select-none",
                  numericValue === preset
                    ? "bg-burgundy text-warm-white border-burgundy font-medium"
                    : "bg-ivory text-ink hover:bg-rose/30 border-line/70"
                )}
              >
                {formatCurrencyVND(preset)}{suffix}
              </button>
            ))}
          </div>
        )}

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
      </div>
    );
  }
);

CurrencyField.displayName = "CurrencyField";
