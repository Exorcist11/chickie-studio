import * as React from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  hint?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      hint,
      error,
      options,
      children,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const effectiveHelper = hint || helperText;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;
    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-ink select-none"
          >
            {label}
            {props.required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : effectiveHelper ? helperId : undefined
            }
            className={cn(
              "w-full min-h-[44px] px-3.5 py-2.5 pr-10 rounded-btn bg-warm-white text-ink text-base md:text-sm appearance-none",
              "border border-line transition-colors cursor-pointer",
              "focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-ivory/50",
              hasError && "border-danger focus:border-danger focus:ring-danger/20 text-danger",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted"
            aria-hidden="true"
          >
            <svg
              className="h-4 w-4 fill-current"
              viewBox="0 0 20 20"
            >
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {hasError ? (
          <p id={errorId} className="text-xs text-danger font-medium mt-0.5">
            {error}
          </p>
        ) : effectiveHelper ? (
          <p id={helperId} className="text-xs text-ink-muted mt-0.5">
            {effectiveHelper}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
