import * as React from "react";
import { CheckboxPrimitive, type CheckboxPrimitiveProps } from "../../primitives/checkbox";
import { Label as PrimitiveLabel } from "../../primitives/label";
import { cn } from "../../lib/cn";

export interface CheckboxProps extends CheckboxPrimitiveProps {
  /** Nhãn hiển thị bên cạnh checkbox */
  label?: React.ReactNode;
  /** Văn bản gợi ý / giải thích thêm */
  hint?: string;
  /** Thông báo lỗi hiển thị */
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      hint,
      error,
      required,
      disabled,
      className,
      checked,
      defaultChecked,
      onCheckedChange,
      ...rest
    },
    ref
  ) => {
    const autoId = React.useId();
    const checkboxId = id ?? autoId;
    const hasError = Boolean(error);
    const describedBy = hasError
      ? `${checkboxId}-error`
      : hint
        ? `${checkboxId}-hint`
        : undefined;

    return (
      <div className={cn("flex flex-col gap-1 text-left", className)}>
        <div className="flex items-start gap-2.5">
          <CheckboxPrimitive
            ref={ref}
            id={checkboxId}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            required={required}
            onCheckedChange={onCheckedChange}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            className={cn(hasError && "border-destructive", "mt-0.5")}
            {...rest}
          />

          {label && (
            <PrimitiveLabel
              htmlFor={checkboxId}
              className={cn(
                "cursor-pointer leading-snug font-normal text-foreground",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {label}
              {required && (
                <span aria-hidden="true" className="text-destructive ml-1">
                  *
                </span>
              )}
            </PrimitiveLabel>
          )}
        </div>

        {hasError ? (
          <p
            id={`${checkboxId}-error`}
            role="alert"
            className="text-xs font-medium text-destructive ml-7 mt-0.5"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={`${checkboxId}-hint`}
            className="text-xs text-muted-foreground ml-7 mt-0.5"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
