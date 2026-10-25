"use client";

import * as React from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PhoneFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  value?: string;
  onChange?: (cleanPhone: string) => void;
  className?: string;
}

/**
 * Format raw phone number into chunked display:
 * 0987654321 -> "0987 654 321"
 */
export function formatPhoneNumberVN(val: string | undefined | null): string {
  if (!val) return "";
  const digits = val.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

/**
 * Clean phone string to only 10 digits
 */
export function cleanPhoneNumber(val: string): string {
  return val.replace(/\D/g, "").slice(0, 10);
}

/**
 * Check if the phone number matches Vietnamese mobile telco pattern (10 digits starting with 03, 05, 07, 08, 09)
 */
export function isValidVietnamesePhone(phone: string): boolean {
  const cleaned = cleanPhoneNumber(phone);
  return /^(03|05|07|08|09)\d{8}$/.test(cleaned);
}

export const PhoneField = React.forwardRef<HTMLInputElement, PhoneFieldProps>(
  (
    {
      label,
      hint,
      error,
      value = "",
      onChange,
      placeholder = "0987 654 321",
      disabled = false,
      required = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const [displayVal, setDisplayVal] = React.useState<string>(() =>
      formatPhoneNumberVN(value)
    );

    React.useEffect(() => {
      setDisplayVal(formatPhoneNumberVN(value));
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawText = e.target.value;
      const clean = cleanPhoneNumber(rawText);
      setDisplayVal(formatPhoneNumberVN(clean));
      onChange?.(clean);
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
          {/* Vietnam Flag / Code Prefix */}
          <div
            aria-hidden="true"
            className="absolute left-3 flex items-center gap-1.5 text-xs font-semibold text-ink-muted select-none pointer-events-none border-r border-line/60 pr-2.5 h-6"
          >
            <span role="img" aria-label="Việt Nam">🇻🇳</span>
            <span>+84</span>
          </div>

          <input
            {...props}
            ref={ref}
            id={inputId}
            type="tel"
            inputMode="tel"
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            value={displayVal}
            onChange={handleInputChange}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              "w-full h-11 pl-20 pr-10 text-sm font-sans bg-warm-white text-ink border rounded-btn transition-colors outline-none",
              "focus:border-burgundy focus:ring-2 focus:ring-burgundy/20",
              "disabled:bg-rose/10 disabled:text-ink-muted disabled:cursor-not-allowed",
              error
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-line"
            )}
          />

          <Phone
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
      </div>
    );
  }
);

PhoneField.displayName = "PhoneField";
