import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Rating } from "../Rating";

export interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
  rating?: number;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  authorName,
  authorRole = "Khách hàng thân thiết",
  avatarUrl,
  rating = 5,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6 bg-warm-white rounded-card border border-line shadow-card text-left transition-all duration-200 hover:shadow-raised",
        className
      )}
    >
      {/* Quote */}
      <blockquote className="font-serif italic text-base md:text-lg text-ink leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author and Rating */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-line/60">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-rose/40 shrink-0 border border-line">
              <Image
                src={avatarUrl}
                alt={authorName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full bg-rose/50 text-ink font-serif font-semibold flex items-center justify-center shrink-0 border border-line">
              {authorName.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-sm text-ink">{authorName}</span>
            <span className="text-xs text-ink-muted">{authorRole}</span>
          </div>
        </div>

        <Rating score={rating} showCount={false} size="sm" />
      </div>
    </div>
  );
};
