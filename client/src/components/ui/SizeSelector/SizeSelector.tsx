import * as React from "react";
import { cn } from "@/lib/cn";

export interface SizeOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface SizeSelectorProps {
  sizes?: (string | SizeOption)[];
  value?: string;
  onChange?: (size: string) => void;
  label?: string;
  sizeGuideAction?: React.ReactNode;
  className?: string;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes = ["XS", "S", "M", "L", "XL"],
  value,
  onChange,
  label = "Kích cỡ",
  sizeGuideAction,
  className,
}) => {
  const normalizedSizes: SizeOption[] = sizes.map((s) =>
    typeof s === "string" ? { value: s, label: s, disabled: false } : s
  );

  return (
    <div className={cn("flex flex-col gap-2 text-left", className)}>
      <div className="flex items-center justify-between">
        {label && (
          <span className="text-sm font-medium text-ink select-none">
            {label}: {value && <strong className="text-burgundy font-semibold">{value}</strong>}
          </span>
        )}
        {sizeGuideAction && (
          <div className="text-xs text-burgundy hover:underline cursor-pointer">
            {sizeGuideAction}
          </div>
        )}
      </div>

      <div
        className="flex flex-wrap gap-2 items-center"
        role="radiogroup"
        aria-label={label}
      >
        {normalizedSizes.map((s) => {
          const isSelected = value === s.value;
          return (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={s.disabled}
              onClick={() => onChange?.(s.value)}
              className={cn(
                "min-w-[44px] h-[44px] px-3.5 rounded-btn text-sm font-medium transition-colors select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2",
                isSelected
                  ? "bg-burgundy text-warm-white shadow-sm border border-burgundy"
                  : "bg-warm-white text-ink border border-line hover:border-burgundy hover:bg-ivory",
                s.disabled &&
                  "opacity-40 cursor-not-allowed line-through hover:border-line hover:bg-warm-white text-ink-muted"
              )}
            >
              {s.label || s.value}
            </button>
          );
        })}
      </div>
    </div>
  );
};
