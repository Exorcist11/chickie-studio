import * as React from "react";
import { Button as PrimitiveButton } from "../../primitives/button";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "md" | "sm";

const variantMap = {
  primary: "default",
  secondary: "outline",
  tertiary: "ghost",
} as const;

export type ButtonProps = Omit<
  React.ComponentProps<typeof PrimitiveButton>,
  "variant" | "size"
> & {
  /**
   * Biến thể hiển thị theo Design System Chickie:
   * - primary: Nút chính màu đỏ Burgundy
   * - secondary: Nút viền mỏng tinh tế
   * - tertiary: Nút dạng văn bản / ghost
   */
  variant?: ButtonVariant;
  /** Kích thước: md (chuẩn 44px touch target) hoặc sm (36px gọn gàng) */
  size?: ButtonSize;
  /** Trạng thái đang tải dữ liệu (tự động hiện spinner và vô hiệu hóa nút) */
  loading?: boolean;
  /** Alias cho loading để tương thích thuận tiện */
  isLoading?: boolean;
  /** Icon hiển thị bên trái nội dung */
  leftIcon?: React.ReactNode;
  /** Icon hiển thị bên phải nội dung */
  rightIcon?: React.ReactNode;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading,
      isLoading,
      disabled,
      className,
      children,
      leftIcon,
      rightIcon,
      ...rest
    },
    ref
  ) => {
    const isBusy = Boolean(loading || isLoading);
    const isDisabled = Boolean(disabled || isBusy);

    const sizeClasses =
      size === "md"
        ? "h-11 px-5 text-sm font-medium rounded-btn gap-2"
        : "h-9 px-3 text-xs font-medium rounded-btn gap-1.5";

    return (
      <PrimitiveButton
        ref={ref}
        variant={variantMap[variant]}
        disabled={isDisabled}
        aria-busy={isBusy || undefined}
        className={cn(sizeClasses, className)}
        {...rest}
      >
        {isBusy ? (
          <svg
            className="animate-spin -ml-0.5 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            data-testid="button-spinner"
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
        ) : leftIcon ? (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}

        {children && <span>{children}</span>}

        {!isBusy && rightIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </PrimitiveButton>
    );
  }
);

Button.displayName = "Button";
