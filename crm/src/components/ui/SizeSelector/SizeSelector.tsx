import React from "react";
import { cn } from "../../../lib/cn";

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
        {normalizedSizes.map((size) => {
          const isSelected = value === size.value;
          return (
            <button
              key={size.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={size.disabled}
              onClick={() => onChange?.(size.value)}
              className={cn(
                "h-10 min-w-[40px] px-3.5 rounded-btn border text-sm font-medium transition-colors select-none flex items-center justify-center",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2",
                size.disabled &&
                  "opacity-40 cursor-not-allowed bg-ivory/50 border-line/40 text-ink-muted line-through",
                !size.disabled &&
                  !isSelected &&
                  "bg-warm-white border-line text-ink hover:border-burgundy/60 hover:bg-rose/20 active:bg-rose/40 cursor-pointer",
                !size.disabled &&
                  isSelected &&
                  "bg-burgundy text-warm-white border-burgundy shadow-xs font-semibold cursor-pointer"
              )}
            >
              {size.label || size.value}
            </button>
          );
        })}
      </div>
    </div>
  );
};
