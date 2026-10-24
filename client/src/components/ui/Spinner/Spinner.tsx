import * as React from "react";
import { cn } from "@/lib/cn";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "primary" | "secondary" | "current" | "white";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Kích cỡ vòng quay: xs (12px), sm (16px), md (24px - mặc định), lg (32px), xl (48px) */
  size?: SpinnerSize;
  /** Biến thể màu sắc: primary (Burgundy), secondary, current (theo màu chữ hiện tại), white */
  variant?: SpinnerVariant;
  /** Nhãn mô tả trạng thái dành cho trình đọc màn hình (mặc định: "Đang tải...") */
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const variantClasses: Record<SpinnerVariant, string> = {
  primary: "text-primary",
  secondary: "text-muted-foreground",
  current: "text-current",
  white: "text-white",
};

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      size = "md",
      variant = "primary",
      label = "Đang tải...",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "inline-flex items-center justify-center shrink-0",
          className
        )}
        {...props}
      >
        <svg
          className={cn("animate-spin", sizeClasses[size], variantClasses[variant])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="sr-only">{label}</span>
      </span>
    );
  }
);

Spinner.displayName = "Spinner";
