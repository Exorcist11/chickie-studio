import * as React from "react";
import { SwitchPrimitive, type SwitchPrimitiveProps } from "../primitives/switch";
import { Label as PrimitiveLabel } from "../primitives/label";
import { cn } from "@/lib/cn";

export interface SwitchProps extends SwitchPrimitiveProps {
  /** Nhãn hiển thị bên cạnh công tắc */
  label?: React.ReactNode;
  /** Văn bản gợi ý / giải thích */
  hint?: string;
  /** Thông báo lỗi hiển thị */
  error?: string;
  /** Vị trí hiển thị nhãn: trái (left) hoặc phải (right) */
  labelPosition?: "left" | "right";
  /** Class tùy chỉnh cho khung bọc ngoài (khi có nhãn, gợi ý hoặc thông báo lỗi) */
  wrapperClassName?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      id,
      label,
      hint,
      error,
      disabled,
      className,
      wrapperClassName,
      labelPosition = "right",
      checked,
      defaultChecked,
      onCheckedChange,
      ...rest
    },
    ref
  ) => {
    const autoId = React.useId();
    const switchId = id ?? autoId;
    const hasError = Boolean(error);
    const describedBy = hasError
      ? `${switchId}-error`
      : hint
        ? `${switchId}-hint`
        : undefined;

    const switchControl = (
      <SwitchPrimitive
        ref={ref}
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={cn(hasError && "border-destructive", className)}
        {...rest}
      />
    );

    if (!label && !hint && !error) {
      return switchControl;
    }

    const labelNode = label && (
      <PrimitiveLabel
        htmlFor={switchId}
        className={cn(
          "cursor-pointer font-normal text-foreground leading-none select-none",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {label}
      </PrimitiveLabel>
    );

    return (
      <div className={cn("flex flex-col gap-1 text-left", wrapperClassName)}>
        <div className="flex items-center gap-3">
          {labelPosition === "left" && labelNode}
          {switchControl}
          {labelPosition === "right" && labelNode}
        </div>

        {hasError ? (
          <p
            id={`${switchId}-error`}
            role="alert"
            className="text-xs font-medium text-destructive mt-0.5"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={`${switchId}-hint`}
            className="text-xs text-muted-foreground mt-0.5"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Switch.displayName = "Switch";
