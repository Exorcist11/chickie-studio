import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface LogoProps {
  variant?: "horizontal" | "vertical" | "mono";
  href?: string;
  showTagline?: boolean;
  className?: string;
}

/**
 * Placeholder SVG Logo cho Chickie Studio (Monogram CS + typography).
 * Có thể thay bằng file logo SVG chính thức từ brand guideline khi hoàn thiện thiết kế.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = "horizontal",
  href = "/",
  showTagline = true,
  className,
}) => {
  const isMono = variant === "mono";
  const isVertical = variant === "vertical";

  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        isVertical ? "flex-col text-center" : "flex-row",
        className
      )}
      aria-label="Chickie Studio - More than just a dress"
    >
      {/* Monogram CS SVG */}
      <svg
        className={cn(
          "shrink-0",
          isVertical ? "w-12 h-12" : "w-9 h-9",
          isMono ? "text-warm-white" : "text-burgundy"
        )}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          width="40"
          height="40"
          rx="10"
          fill="currentColor"
          fillOpacity={isMono ? "0.15" : "0.08"}
        />
        <path
          d="M26 14C24.5 12.5 22 12 19 12C14.5 12 12 15 12 20C12 25 14.5 28 19 28C22.5 28 25 27 26.5 25"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M27 19C25 18 21 17.5 21 20C21 22.5 26.5 22 26.5 25C26.5 27.5 23 28 20 28"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography */}
      <div className={cn("flex flex-col", isVertical ? "items-center" : "items-start")}>
        <span
          className={cn(
            "font-serif tracking-[0.18em] font-medium leading-none uppercase",
            isVertical ? "text-lg mt-1" : "text-base",
            isMono ? "text-warm-white" : "text-ink"
          )}
        >
          Chickie Studio
        </span>
        {showTagline && (
          <span
            className={cn(
              "font-serif italic text-[11px] leading-tight tracking-normal mt-0.5",
              isMono ? "text-rose/80" : "text-burgundy"
            )}
          >
            More than just a dress
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy rounded-btn">
        {content}
      </Link>
    );
  }

  return content;
};
