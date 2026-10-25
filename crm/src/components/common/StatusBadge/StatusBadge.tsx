import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/cn";
import "./StatusBadge.scss";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DEPOSITED"
  | "DELIVERED"
  | "RETURNED"
  | "COMPLETED"
  | "CANCELLED"
  | "OVERDUE";

export type ItemStatus =
  | "AVAILABLE"
  | "RENTED"
  | "CLEANING"
  | "REPAIRING"
  | "INACTIVE";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors whitespace-nowrap shrink-0",
  {
    variants: {
      size: {
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-xs",
      },
      tone: {
        amber: "bg-amber-50 text-amber-800 border-amber-200",
        blue: "bg-blue-50 text-blue-800 border-blue-200",
        emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
        rose: "bg-rose-50 text-rose-800 border-rose-200",
        purple: "bg-purple-50 text-purple-800 border-purple-200",
        gray: "bg-stone-100 text-stone-700 border-stone-200",
        red: "bg-red-50 text-red-800 border-red-200",
        burgundy: "bg-[#641D2B]/10 text-burgundy border-burgundy/20",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "gray",
    },
  }
);

export interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  type: "order" | "item";
  status: OrderStatus | ItemStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  status,
  size = "md",
  className,
}) => {
  const { t } = useTranslation();

  const getTone = (): VariantProps<typeof badgeVariants>["tone"] => {
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

  const labelKey = type === "order" ? `orderStatus.${status}` : `itemStatus.${status}`;

  return (
    <span className={cn(badgeVariants({ tone: getTone(), size }), className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />
      {t(labelKey)}
    </span>
  );
};

