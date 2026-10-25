import React, { useId, useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { cn } from "../../../lib/cn";
import { formatPhoneNumberVN, cleanPhoneNumber } from "./PhoneField.utils";

export interface PhoneFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  value?: string;
  onChange?: (cleanPhone: string) => void;
  className?: string;
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
    const generatedId = useId();
    const inputId = id || generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const [displayVal, setDisplayVal] = useState<string>(() =>
      formatPhoneNumberVN(value)
    );

    useEffect(() => {
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
