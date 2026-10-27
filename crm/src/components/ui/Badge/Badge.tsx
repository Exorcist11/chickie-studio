import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DEPOSITED"
  | "DELIVERED"
  | "RETURNED"
  | "COMPLETED"
  | "CANCELLED"
  | "OVERDUE";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-tag text-xs font-medium border select-none",
  {
    variants: {
      status: {
        PENDING: "bg-warning/10 text-warning border-warning/20",
        CONFIRMED: "bg-info/10 text-info border-info/20",
        DEPOSITED: "bg-info/10 text-info border-info/20",
        DELIVERED: "bg-burgundy/10 text-burgundy border-burgundy/20",
        RETURNED: "bg-rose/40 text-ink border-rose",
        COMPLETED: "bg-success/10 text-success border-success/20",
        CANCELLED: "bg-danger/10 text-danger border-danger/20",
        OVERDUE: "bg-danger/15 text-danger font-semibold border-danger/30",
      },
    },
    defaultVariants: {
      status: "PENDING",
    },
  }
);

export const dotColors: Record<OrderStatus, string> = {
  PENDING: "bg-warning",
  CONFIRMED: "bg-info",
  DEPOSITED: "bg-info",
  DELIVERED: "bg-burgundy",
  RETURNED: "bg-ink-muted",
  COMPLETED: "bg-success",
  CANCELLED: "bg-danger",
  OVERDUE: "bg-danger animate-pulse",
};

export const defaultStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  DEPOSITED: "Đã đặt cọc",
  DELIVERED: "Đang cho thuê",
  RETURNED: "Đã trả đồ",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  OVERDUE: "Quá hạn trả",
};

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "destructive"
  | "outline";

const variantStyles: Record<BadgeVariant, string> = {
  default: "border-transparent bg-burgundy text-warm-white shadow-xs",
  primary: "border-transparent bg-burgundy text-warm-white shadow-xs",
  secondary: "border border-line bg-ivory text-ink",
  accent: "bg-gold text-ink font-semibold border-transparent",
  success: "border border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border border-amber-200 bg-amber-50 text-amber-800",
  destructive: "border-transparent bg-destructive text-white shadow-xs",
  outline: "border border-line text-ink bg-transparent",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: OrderStatus;
  variant?: BadgeVariant;
  label?: string;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  status,
  variant = status ? undefined : "default",
  label,
  showDot,
  children,
  ...props
}) => {
  const isStatus = Boolean(status);
  const shouldShowDot = showDot ?? isStatus;
  const content = children || label || (status ? defaultStatusLabels[status] || status : null);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-tag text-xs font-medium border select-none whitespace-nowrap shrink-0",
        status && badgeVariants({ status }),
        variant && variantStyles[variant],
        className
      )}
      {...props}
    >
      {shouldShowDot && status && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full inline-block", dotColors[status])}
          aria-hidden="true"
        />
      )}
      {content}
    </span>
  );
};
