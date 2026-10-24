import * as React from "react";
import { cn } from "@/lib/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "warm-white" | "ivory";
  spacing?: "normal" | "compact" | "none";
}

export const Section: React.FC<SectionProps> = ({
  variant = "warm-white",
  spacing = "normal",
  className,
  children,
  ...props
}) => {
  const bgClass = variant === "ivory" ? "bg-ivory" : "bg-warm-white";

  const spacingClass = {
    normal: "py-16 md:py-24", // 64px mobile, 96px desktop
    compact: "py-10 md:py-16",
    none: "py-0",
  }[spacing];

  return (
    <section className={cn("w-full", bgClass, spacingClass, className)} {...props}>
      {children}
    </section>
  );
};
