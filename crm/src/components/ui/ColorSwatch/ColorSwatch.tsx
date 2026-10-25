import React from "react";
import { cn } from "../../../lib/cn";

export interface ColorItem {
  name: string;
  hex: string;
}

export interface ColorSwatchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: string;
  name: string;
  selected?: boolean;
  size?: "sm" | "md" | "lg";
  onSelectColor?: () => void;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export const ColorSwatch = React.forwardRef<HTMLButtonElement, ColorSwatchProps>(
  (
    {
      className,
      color,
      name,
      selected = false,
      size = "md",
      onSelectColor,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      onSelectColor?.();
    };

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={`Màu ${name}`}
        disabled={disabled}
        onClick={handleClick}
        title={name}
        className={cn(
          "rounded-full transition-transform focus-visible:outline-none relative border border-line/80 shadow-xs cursor-pointer bg-[var(--swatch-color)]",
          sizeClasses[size],
          selected && "ring-2 ring-burgundy ring-offset-2 scale-110",
          disabled && "opacity-40 cursor-not-allowed",
          className
        )}
        style={{ "--swatch-color": color } as React.CSSProperties}
        {...props}
      />
    );
  }
);

ColorSwatch.displayName = "ColorSwatch";

export interface ColorSwatchGroupProps {
  colors: ColorItem[];
  selectedColor?: string;
  onSelectColor?: (colorHex: string) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  showName?: boolean;
}

export const ColorSwatchGroup: React.FC<ColorSwatchGroupProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  size = "md",
  className,
  showName = false,
}) => {
  const activeColorItem = colors.find((c) => c.hex === selectedColor);

  return (
    <div className={cn("flex flex-col gap-1.5 text-left", className)}>
      {showName && activeColorItem && (
        <span className="text-xs text-ink-muted">
          Màu: <strong className="text-ink font-medium">{activeColorItem.name}</strong>
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2" role="radiogroup">
        {colors.map((c) => (
          <ColorSwatch
            key={c.hex}
            color={c.hex}
            name={c.name}
            size={size}
            selected={selectedColor === c.hex}
            onSelectColor={() => onSelectColor?.(c.hex)}
          />
        ))}
      </div>
    </div>
  );
};
