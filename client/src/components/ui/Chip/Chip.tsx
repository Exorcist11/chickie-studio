import * as React from "react";
import { cn } from "@/lib/cn";

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
            ? "bg-burgundy text-warm-white shadow-sm"
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

export interface ChipGroupProps {
  options: { label: string; value: string | number }[];
  value?: (string | number)[] | string | number;
  onChange?: (value: any) => void;
  multiple?: boolean;
  className?: string;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  options,
  value,
  onChange,
  multiple = false,
  className,
}) => {
  const isSelected = (val: string | number) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(val);
    }
    return value === val;
  };

  const handleToggle = (val: string | number) => {
    if (!onChange) return;
    if (multiple) {
      const current = Array.isArray(value) ? [...value] : [];
      const idx = current.indexOf(val);
      if (idx > -1) {
        current.splice(idx, 1);
      } else {
        current.push(val);
      }
      onChange(current);
    } else {
      onChange(value === val ? "" : val);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2 items-center", className)} role="group">
      {options.map((opt) => (
        <Chip
          key={String(opt.value)}
          selected={isSelected(opt.value)}
          onClick={() => handleToggle(opt.value)}
        >
          {opt.label}
        </Chip>
      ))}
    </div>
  );
};
