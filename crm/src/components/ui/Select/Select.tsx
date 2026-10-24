import * as React from "react";
import { ChevronDown } from "lucide-react";
import { SelectPrimitive } from "../primitives/select";
import { Label as PrimitiveLabel } from "../primitives/label";
import { cn } from "@/lib/cn";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.ComponentProps<typeof SelectPrimitive>, "onChange"> {
  /** Nhãn hiển thị cho menu chọn */
  label?: string;
  /** Văn bản gợi ý hướng dẫn */
  hint?: string;
  /** Thông báo lỗi hiển thị */
  error?: string;
  /** Danh sách các lựa chọn */
  options?: SelectOption[];
  /** Placeholder hiển thị khi chưa chọn */
  placeholder?: string;
  /** Callback khi giá trị được chọn thay đổi (trả về chuỗi giá trị) */
  onValueChange?: (value: string) => void;
  /** Native onChange handler */
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      hint,
      error,
      required,
      disabled,
      className,
      options,
      placeholder,
      children,
      onValueChange,
      onChange,
      value,
      defaultValue,
      ...rest
    },
    ref
  ) => {
    const autoId = React.useId();
    const selectId = id ?? autoId;
    const hasError = Boolean(error);
    const describedBy = hasError
      ? `${selectId}-error`
      : hint
        ? `${selectId}-hint`
        : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onValueChange?.(e.target.value);
      onChange?.(e);
    };

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <PrimitiveLabel htmlFor={selectId} className="cursor-pointer">
            {label}
            {required && (
              <span aria-hidden="true" className="text-destructive ml-1">
                *
              </span>
            )}
          </PrimitiveLabel>
        )}

        <div className="relative flex items-center w-full">
          <SelectPrimitive
            ref={ref}
            id={selectId}
            required={required}
            disabled={disabled}
            value={value}
            defaultValue={value !== undefined ? undefined : (defaultValue ?? (placeholder ? "" : undefined))}
            onChange={handleChange}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            className={cn(
              "h-11 px-3.5 py-2.5 pr-10 rounded-btn bg-background text-foreground text-sm",
              "border border-input placeholder:text-muted-foreground transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              hasError && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

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
          </SelectPrimitive>

          <span
            className="absolute right-3.5 text-muted-foreground pointer-events-none inline-flex items-center"
            aria-hidden="true"
          >
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>

        {hasError ? (
          <p
            id={`${selectId}-error`}
            role="alert"
            className="text-xs font-medium text-destructive mt-0.5"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={`${selectId}-hint`}
            className="text-xs text-muted-foreground mt-0.5"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
