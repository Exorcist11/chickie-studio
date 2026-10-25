import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import type { OrderStatus } from "../Badge/Badge";

export type { OrderStatus };

export type ItemStatus =
  | "AVAILABLE"
  | "RENTED"
  | "CLEANING"
  | "REPAIRING"
  | "INACTIVE";

export const defaultOrderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  DEPOSITED: "Đã đặt cọc",
  DELIVERED: "Đang cho thuê",
  RETURNED: "Đã trả đồ",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  OVERDUE: "Quá hạn trả",
};

export const defaultItemStatusLabels: Record<ItemStatus, string> = {
  AVAILABLE: "Có sẵn",
  RENTED: "Đang được thuê",
  CLEANING: "Đang giặt hấp",
  REPAIRING: "Bảo dưỡng / Sửa",
  INACTIVE: "Ngừng cung cấp",
};

export const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors select-none whitespace-nowrap shrink-0",
  {
    variants: {
      size: {
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-xs",
      },
      tone: {
        amber: "bg-warning/10 text-warning border-warning/20",
        blue: "bg-info/10 text-info border-info/20",
        emerald: "bg-success/10 text-success border-success/20",
        purple: "bg-purple-50 text-purple-800 border-purple-200",
        gray: "bg-ink/5 text-ink-muted border-line",
        red: "bg-danger/10 text-danger border-danger/20",
        burgundy: "bg-burgundy/10 text-burgundy border-burgundy/20",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "gray",
    },
  }
);

export interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  type: "order" | "item";
  status: OrderStatus | ItemStatus;
  label?: string;
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  status,
  size = "md",
  label,
  showDot = true,
  className,
}) => {
  const getTone = (): VariantProps<typeof statusBadgeVariants>["tone"] => {
    switch (status) {
      case "PENDING":
        return "amber";
      case "CONFIRMED":
        return "blue";
      case "DEPOSITED":
      case "AVAILABLE":
        return "emerald";
      case "DELIVERED":
      case "RENTED":
        return "burgundy";
      case "RETURNED":
      case "CLEANING":
        return "purple";
      case "COMPLETED":
        return "emerald";
      case "CANCELLED":
      case "INACTIVE":
        return "gray";
      case "OVERDUE":
      case "REPAIRING":
        return "red";
      default:
        return "gray";
    }
  };

  const displayText =
    label ||
    (type === "order"
      ? defaultOrderStatusLabels[status as OrderStatus] || status
      : defaultItemStatusLabels[status as ItemStatus] || status);

  return (
    <span
      role="status"
      className={cn(statusBadgeVariants({ tone: getTone(), size }), className)}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current opacity-80"
          aria-hidden="true"
        />
      )}
      <span>{displayText}</span>
    </span>
  );
};
