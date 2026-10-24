import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { SelectPrimitive } from "../primitives/select";
import { Label as PrimitiveLabel } from "../primitives/label";
import { cn } from "@/lib/cn";
import styles from "./Select.module.scss";

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

    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const hiddenSelectRef = React.useRef<HTMLSelectElement | null>(null);

    // Current selected value state (sync with controlled or defaultValue)
    const [internalValue, setInternalValue] = React.useState<string>(() => {
      if (value !== undefined) return String(value);
      if (defaultValue !== undefined) return String(defaultValue);
      return "";
    });

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(String(value));
      }
    }, [value]);

    // Close when clicking outside
    React.useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Close on Escape key
    React.useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const handleSelectOption = (optVal: string | number) => {
      const stringVal = String(optVal);
      setInternalValue(stringVal);
      setIsOpen(false);
      onValueChange?.(stringVal);

      // Trigger change on native select if present
      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = stringVal;
        const event = new Event("change", { bubbles: true });
        hiddenSelectRef.current.dispatchEvent(event);
      }
    };

    const handleNativeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newVal = e.target.value;
      setInternalValue(newVal);
      onValueChange?.(newVal);
      onChange?.(e);
    };

    // Find label for current value
    const selectedOption = options?.find((opt) => String(opt.value) === String(internalValue));
    const displayLabel = selectedOption
      ? selectedOption.label
      : internalValue || (placeholder ? "" : "");

    return (
      <div ref={containerRef} className={cn(styles.select, className)}>
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

        {/* Custom Dropdown Trigger */}
        <div className="relative w-full">
          <button
            type="button"
            id={`${selectId}-trigger`}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-describedby={describedBy}
            className={cn(
              styles.select__trigger,
              hasError && styles["select__trigger--error"],
              disabled && styles["select__trigger--disabled"],
              isOpen && styles["select__trigger--open"]
            )}
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
          >
            <span className={cn(!displayLabel && styles.select__placeholder)}>
              {displayLabel || placeholder || "Chọn một mục..."}
            </span>
            <ChevronDown
              className={cn(styles.select__icon, isOpen && styles["select__icon--open"])}
              size={16}
            />
          </button>

          {/* Custom Styled Popover Dropdown */}
          {isOpen && options && options.length > 0 && (
            <div
              className={styles.select__dropdown}
              role="listbox"
              aria-labelledby={label ? selectId : undefined}
            >
              {placeholder && (
                <div
                  className={cn(styles.select__option, styles["select__option--disabled"])}
                  role="option"
                  aria-selected={false}
                  aria-disabled={true}
                >
                  <span className={styles.select__placeholder}>{placeholder}</span>
                </div>
              )}
              {options.map((opt) => {
                const isSelected = String(opt.value) === String(internalValue);
                return (
                  <div
                    key={String(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled}
                    className={cn(
                      styles.select__option,
                      isSelected && styles["select__option--selected"],
                      opt.disabled && styles["select__option--disabled"]
                    )}
                    onClick={() => !opt.disabled && handleSelectOption(opt.value)}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} className={styles.select__checkIcon} />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Visually-hidden native select for full compatibility with tests & accessibility */}
          <SelectPrimitive
            ref={(node) => {
              hiddenSelectRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLSelectElement | null>).current = node;
            }}
            id={selectId}
            required={required}
            disabled={disabled}
            {...(value !== undefined
              ? { value }
              : defaultValue !== undefined
                ? { defaultValue }
                : { value: internalValue })}
            onChange={handleNativeChange}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            className={styles.select__nativeSelect}
            tabIndex={-1}
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
