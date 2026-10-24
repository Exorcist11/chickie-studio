import * as React from "react";
import { Input as PrimitiveInput } from "../../primitives/input";
import { Label as PrimitiveLabel } from "../../primitives/label";
import { cn } from "../../lib/cn";

export interface TextFieldProps
  extends Omit<React.ComponentProps<typeof PrimitiveInput>, "size"> {
  /** Nhãn hiển thị phía trên ô nhập liệu */
  label?: string;
  /** Văn bản hướng dẫn / gợi ý khi chưa có lỗi */
  hint?: string;
  /** Thông báo lỗi hiển thị (tự động bật aria-invalid và role="alert") */
  error?: string;
  /** Icon hoặc phần tử hiển thị đầu ô nhập */
  startIcon?: React.ReactNode;
  /** Icon hoặc phần tử hiển thị cuối ô nhập */
  endIcon?: React.ReactNode;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      hint,
      error,
      required,
      disabled,
      className,
      startIcon,
      endIcon,
      type = "text",
      ...rest
    },
    ref
  ) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const hasError = Boolean(error);
    const describedBy = hasError
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <PrimitiveLabel htmlFor={inputId} className="cursor-pointer">
            {label}
            {required && (
              <span aria-hidden="true" className="text-destructive ml-1">
                *
              </span>
            )}
          </PrimitiveLabel>
        )}

        <div className="relative flex items-center w-full">
          {startIcon && (
            <span
              className="absolute left-3.5 text-muted-foreground inline-flex items-center pointer-events-none"
              aria-hidden="true"
            >
              {startIcon}
            </span>
          )}

          <PrimitiveInput
            ref={ref}
            id={inputId}
            type={type}
            required={required}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            className={cn(
              "h-11 px-3.5 py-2.5 rounded-btn bg-background text-foreground text-sm",
              "border border-input placeholder:text-muted-foreground transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              startIcon && "pl-10",
              endIcon && "pr-10",
              hasError && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...rest}
          />

          {endIcon && (
            <span className="absolute right-3.5 text-muted-foreground inline-flex items-center">
              {endIcon}
            </span>
          )}
        </div>

        {hasError ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs font-medium text-destructive mt-0.5"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={`${inputId}-hint`}
            className="text-xs text-muted-foreground mt-0.5"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = "TextField";
