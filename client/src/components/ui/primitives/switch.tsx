import * as React from "react";
import { cn } from "@/lib/cn";

export interface SwitchPrimitiveProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const SwitchPrimitive = React.forwardRef<
  HTMLButtonElement,
  SwitchPrimitiveProps
>(({ className, checked, defaultChecked, onCheckedChange, disabled, id, onClick, ...props }, ref) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(Boolean(defaultChecked));
  const isChecked = isControlled ? Boolean(checked) : internalChecked;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onCheckedChange?.(next);
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="switch"
      aria-checked={isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        isChecked
          ? "bg-burgundy data-[state=checked]:bg-burgundy"
          : "bg-stone-300 data-[state=unchecked]:bg-stone-300",
        className
      )}
      {...props}
    >
      <span
        data-state={isChecked ? "checked" : "unchecked"}
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200",
          isChecked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
});

SwitchPrimitive.displayName = "PrimitiveSwitch";
