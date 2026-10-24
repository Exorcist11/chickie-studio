import * as React from "react";
import { cn } from "@/lib/cn";

export interface RadioPrimitiveProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const RadioPrimitive = React.forwardRef<
  HTMLInputElement,
  RadioPrimitiveProps
>(({ className, disabled, checked, id, ...props }, ref) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      <input
        ref={ref}
        id={id}
        type="radio"
        checked={checked}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <div
        className={cn(
          "aspect-square h-5 w-5 rounded-full border border-primary text-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex items-center justify-center",
          checked ? "border-primary" : "border-muted-foreground/50",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        aria-hidden="true"
      >
        {checked && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </div>
    </div>
  );
});

RadioPrimitive.displayName = "PrimitiveRadio";
