import * as React from "react";
import { BadgePrimitive } from "../../primitives/badge";
import { cn } from "../../lib/cn";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "destructive"
  | "outline";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Biến thể màu sắc ngữ nghĩa của Chickie */
  variant?: BadgeVariant;
  /** Kích thước huy hiệu: sm (gọn) hoặc md (chuẩn) */
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "border-transparent bg-primary text-primary-foreground shadow-xs",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  accent: "border-transparent bg-accent text-accent-foreground font-semibold",
  success: "border-transparent bg-success text-white shadow-xs",
  warning: "border-transparent bg-warning text-white shadow-xs",
  destructive: "border-transparent bg-destructive text-white shadow-xs",
  outline: "border-border text-foreground bg-transparent",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-0.5 text-xs",
};

export function Badge({
  className,
  variant = "primary",
  size = "md",
  ...props
}: BadgeProps) {
  return (
    <BadgePrimitive
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
