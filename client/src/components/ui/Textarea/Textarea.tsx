import * as React from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      id,
      disabled,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;
    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-ink select-none"
          >
            {label}
            {props.required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "w-full px-3.5 py-2.5 rounded-btn bg-warm-white text-ink text-base md:text-sm",
            "border border-line placeholder:text-ink-muted/60 transition-colors resize-y",
            "focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-ivory/50",
            hasError && "border-danger focus:border-danger focus:ring-danger/20 text-danger",
            className
          )}
          {...props}
        />
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
  }
);

Textarea.displayName = "Textarea";
