import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
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

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  status: OrderStatus;
  label?: string;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  status,
  label,
  showDot = true,
  children,
  ...props
}) => {
  const text = children || label || defaultStatusLabels[status] || status;

  return (
    <span
      className={cn(badgeVariants({ status }), className)}
      {...props}
    >
      {showDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full inline-block", dotColors[status])}
          aria-hidden="true"
        />
      )}
      <span>{text}</span>
    </span>
  );
};
