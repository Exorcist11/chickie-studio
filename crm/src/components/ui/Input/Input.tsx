import * as React from "react";
import { cn } from "../../../lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-ink select-none"
          >
            {label}
            {props.required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className="absolute left-3 text-ink-muted pointer-events-none inline-flex"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "w-full min-h-[40px] px-3 py-2 rounded-btn bg-white text-ink text-sm",
              "border border-line placeholder:text-ink-muted/60 transition-colors",
              "focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-ivory/50",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              hasError && "border-destructive focus:border-destructive focus:ring-destructive/20 text-destructive",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span
              className="absolute right-3 text-ink-muted inline-flex items-center"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>
        {hasError ? (
          <p id={errorId} className="text-xs text-destructive font-medium mt-0.5">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-ink-muted mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
