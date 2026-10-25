import React from "react";
import { cn } from "../../../lib/cn";

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onToggle"> {
  selected?: boolean;
  onToggle?: (selected: boolean) => void;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      selected = false,
      onToggle,
      onClick,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      onToggle?.(!selected);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={selected}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2",
          "disabled:opacity-40 disabled:pointer-events-none cursor-pointer",
          selected
            ? "bg-burgundy text-warm-white shadow-xs font-semibold"
            : "bg-rose/40 text-ink hover:bg-rose/60 active:bg-rose/80",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Chip.displayName = "Chip";

export interface ChipGroupProps<T extends string | number> {
  options: { label: React.ReactNode; value: T; disabled?: boolean }[];
  value?: T | T[];
  onChange?: (val: any) => void;
  multiple?: boolean;
  className?: string;
}

export const ChipGroup = <T extends string | number>({
  options,
  value,
  onChange,
  multiple = false,
  className,
}: ChipGroupProps<T>) => {
  const isSelected = (val: T) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(val);
    }
    return value === val;
  };

  const handleToggle = (val: T) => {
    if (multiple) {
      const arr = Array.isArray(value) ? [...value] : [];
      const idx = arr.indexOf(val);
      if (idx > -1) {
        arr.splice(idx, 1);
      } else {
        arr.push(val);
      }
      onChange?.(arr);
    } else {
      onChange?.(val);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2 items-center", className)}>
      {options.map((opt) => (
        <Chip
          key={String(opt.value)}
          selected={isSelected(opt.value)}
          disabled={opt.disabled}
          onToggle={() => handleToggle(opt.value)}
        >
          {opt.label}
        </Chip>
      ))}
    </div>
  );
};
