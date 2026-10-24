import * as React from "react";
import { cn } from "@/lib/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "tag" | "btn" | "card" | "full" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = "btn",
  ...props
}) => {
  const roundedClass = {
    tag: "rounded-tag",
    btn: "rounded-btn",
    card: "rounded-card",
    full: "rounded-full",
    none: "rounded-none",
  }[rounded];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-rose/25 animate-pulse",
        roundedClass,
        className
      )}
      {...props}
    />
  );
};
