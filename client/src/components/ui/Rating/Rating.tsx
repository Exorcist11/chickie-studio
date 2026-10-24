import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  score?: number;
  maxScore?: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: "sm" | "md";
  reviewLabel?: string;
}

export const Rating: React.FC<RatingProps> = ({
  score = 5,
  maxScore = 5,
  reviewCount,
  showCount = true,
  size = "sm",
  reviewLabel = "đánh giá",
  className,
  ...props
}) => {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div
      role="img"
      className={cn("inline-flex items-center gap-1.5 select-none", className)}
      aria-label={`Đánh giá ${score} trên ${maxScore} sao${reviewCount ? ` với ${reviewCount} ${reviewLabel}` : ""}`}
      {...props}
    >
      <div className="flex items-center text-gold" aria-hidden="true">
        {Array.from({ length: maxScore }).map((_, idx) => {
          const filled = idx + 1 <= Math.round(score);
          return (
            <Star
              key={idx}
              className={cn(
                iconSize,
                filled ? "fill-gold text-gold" : "text-line fill-transparent"
              )}
            />
          );
        })}
      </div>
      <span className={cn("font-medium text-ink", textSize)} aria-hidden="true">
        {score.toFixed(1)}
      </span>
      {showCount && typeof reviewCount === "number" && (
        <span className={cn("text-ink-muted", textSize)} aria-hidden="true">
          ({reviewCount} {reviewLabel})
        </span>
      )}
    </div>
  );
};
