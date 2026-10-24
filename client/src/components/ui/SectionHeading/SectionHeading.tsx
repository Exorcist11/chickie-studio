import * as React from "react";
import { cn } from "@/lib/cn";

export interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  level?: "h1" | "h2" | "h3";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
  action,
  level = "h2",
  className,
}) => {
  const HeadingTag = level;

  const sizeClass = {
    h1: "text-3xl md:text-4xl",
    h2: "text-2xl md:text-3xl",
    h3: "text-xl md:text-2xl",
  }[level];

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 text-left mb-6 md:mb-8",
        className
      )}
    >
      <div className="flex flex-col gap-1 max-w-2xl">
        <HeadingTag
          className={cn(
            "font-serif font-medium text-ink tracking-tight",
            sizeClass
          )}
        >
          {title}
        </HeadingTag>
        {description && (
          <p className="text-sm md:text-base text-ink-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 pt-2 sm:pt-0">{action}</div>}
    </div>
  );
};
