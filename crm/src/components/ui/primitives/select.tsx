import * as React from "react";
import { cn } from "@/lib/cn";

export interface SelectPrimitiveProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const SelectPrimitive = React.forwardRef<
  HTMLSelectElement,
  SelectPrimitiveProps
>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

SelectPrimitive.displayName = "PrimitiveSelect";
