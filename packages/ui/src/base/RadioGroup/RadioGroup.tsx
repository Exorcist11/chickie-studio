import * as React from "react";
import { RadioPrimitive } from "../../primitives/radio-group";
import { Label as PrimitiveLabel } from "../../primitives/label";
import { cn } from "../../lib/cn";

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  hint?: string;
}

export interface RadioGroupProps {
  /** Nhãn chung cho cả nhóm radio */
  label?: string;
  /** Tên định danh input radio nhóm */
  name?: string;
  /** Danh sách các lựa chọn */
  options: RadioOption[];
  /** Giá trị đang được chọn (controlled) */
  value?: string | number;
  /** Giá trị mặc định ban đầu (uncontrolled) */
  defaultValue?: string | number;
  /** Callback khi giá trị thay đổi */
  onValueChange?: (value: string) => void;
  /** Native change event callback */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Hướng bố cục: dọc (vertical) hoặc ngang (horizontal) */
  orientation?: "vertical" | "horizontal";
  /** Văn bản gợi ý / giải thích */
  hint?: string;
  /** Thông báo lỗi hiển thị */
  error?: string;
  /** Đánh dấu bắt buộc */
  required?: boolean;
  /** Vô hiệu hóa toàn bộ nhóm */
  disabled?: boolean;
  /** Lớp CSS tùy biến */
  className?: string;
  /** ID tùy biến của nhóm */
  id?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      id,
      label,
      name,
      options,
      value,
      defaultValue,
      onValueChange,
      onChange,
      orientation = "vertical",
      hint,
      error,
      required,
      disabled,
      className,
    },
    ref
  ) => {
    const autoId = React.useId();
    const groupId = id ?? autoId;
    const groupName = name ?? `radio-group-${groupId}`;
    const hasError = Boolean(error);
    const describedBy = hasError
      ? `${groupId}-error`
      : hint
        ? `${groupId}-hint`
        : undefined;

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<string | number | undefined>(
      defaultValue
    );
    const currentValue = isControlled ? value : internalValue;

    const handleOptionChange = (
      optValue: string | number,
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (!isControlled) {
        setInternalValue(optValue);
      }
      onValueChange?.(String(optValue));
      onChange?.(e);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        id={groupId}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        aria-required={required}
        className={cn("w-full flex flex-col gap-2 text-left", className)}
      >
        {label && (
          <span className="text-sm font-medium text-foreground select-none">
            {label}
            {required && (
              <span aria-hidden="true" className="text-destructive ml-1">
                *
              </span>
            )}
          </span>
        )}

        <div
          className={cn(
            "flex gap-3",
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
          )}
        >
          {options.map((opt) => {
            const isChecked = String(currentValue) === String(opt.value);
            const isOptDisabled = Boolean(disabled || opt.disabled);
            const itemUniqueId = `${groupId}-${opt.value}`;

            return (
              <div key={String(opt.value)} className="flex items-start gap-2.5">
                <RadioPrimitive
                  id={itemUniqueId}
                  name={groupName}
                  value={opt.value}
                  checked={isChecked}
                  disabled={isOptDisabled}
                  onChange={(e) => handleOptionChange(opt.value, e)}
                  className={cn(hasError && "border-destructive", "mt-0.5")}
                />

                <div className="flex flex-col">
                  <PrimitiveLabel
                    htmlFor={itemUniqueId}
                    className={cn(
                      "cursor-pointer font-normal leading-snug text-foreground",
                      isOptDisabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    {opt.label}
                  </PrimitiveLabel>
                  {opt.hint && (
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {opt.hint}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {hasError ? (
          <p
            id={`${groupId}-error`}
            role="alert"
            className="text-xs font-medium text-destructive mt-0.5"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={`${groupId}-hint`}
            className="text-xs text-muted-foreground mt-0.5"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";
