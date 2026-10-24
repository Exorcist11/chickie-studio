import * as React from "react";
import { Textarea as PrimitiveTextarea } from "../../primitives/textarea";
import { Label as PrimitiveLabel } from "../../primitives/label";
import { cn } from "../../lib/cn";

export interface TextAreaProps
  extends React.ComponentProps<typeof PrimitiveTextarea> {
  /** Nhãn hiển thị cho vùng nhập văn bản */
  label?: string;
  /** Văn bản gợi ý / hướng dẫn */
  hint?: string;
  /** Thông báo lỗi hiển thị */
  error?: string;
  /** Bật hiển thị bộ đếm ký tự */
  showCount?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      id,
      label,
      hint,
      error,
      required,
      disabled,
      className,
      showCount,
      maxLength,
      value,
      defaultValue,
      onChange,
      rows = 3,
      ...rest
    },
    ref
  ) => {
    const autoId = React.useId();
    const textareaId = id ?? autoId;
    const hasError = Boolean(error);
    const describedBy = hasError
      ? `${textareaId}-error`
      : hint
        ? `${textareaId}-hint`
        : undefined;

    const [charCount, setCharCount] = React.useState<number>(() => {
      if (typeof value === "string") return value.length;
      if (typeof defaultValue === "string") return defaultValue.length;
      return 0;
    });

    React.useEffect(() => {
      if (typeof value === "string") {
        setCharCount(value.length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <div className="flex items-center justify-between">
          {label && (
            <PrimitiveLabel htmlFor={textareaId} className="cursor-pointer">
              {label}
              {required && (
                <span aria-hidden="true" className="text-destructive ml-1">
                  *
                </span>
              )}
            </PrimitiveLabel>
          )}

          {showCount && (
            <span
              className="text-xs text-muted-foreground ml-auto select-none"
              aria-live="polite"
              data-testid="textarea-count"
            >
              {charCount}
              {maxLength ? `/${maxLength}` : ""}
            </span>
          )}
        </div>

        <PrimitiveTextarea
          ref={ref}
          id={textareaId}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          onChange={handleChange}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          className={cn(
            "min-h-[88px] px-3.5 py-2.5 rounded-btn bg-background text-foreground text-sm",
            "border border-input placeholder:text-muted-foreground transition-colors resize-y",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...rest}
        />

        {hasError ? (
          <p
            id={`${textareaId}-error`}
            role="alert"
            className="text-xs font-medium text-destructive mt-0.5"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            id={`${textareaId}-hint`}
            className="text-xs text-muted-foreground mt-0.5"
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
