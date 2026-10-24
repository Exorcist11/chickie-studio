import * as React from "react";
import { cn } from "@/lib/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "burgundy" | "white" | "muted";
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "burgundy",
  label = "Đang tải...",
  className,
  ...props
}) => {
  const sizeClass = {
    sm: "w-4 h-4 border-2",
    md: "w-7 h-7 border-3",
    lg: "w-10 h-10 border-4",
  }[size];

  const colorClass = {
    burgundy: "border-line border-t-burgundy",
    white: "border-white/30 border-t-white",
    muted: "border-line border-t-ink-muted",
  }[variant];

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <div
        className={cn(
          "rounded-full animate-spin",
          sizeClass,
          colorClass
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};
