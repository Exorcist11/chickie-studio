import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface CheckboxPrimitiveProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const CheckboxPrimitive = React.forwardRef<
  HTMLInputElement,
  CheckboxPrimitiveProps
>(({ className, checked, defaultChecked, onCheckedChange, onChange, disabled, id, ...props }, ref) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(Boolean(defaultChecked));
  const isChecked = isControlled ? Boolean(checked) : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalChecked(e.target.checked);
    }
    onCheckedChange?.(e.target.checked);
    onChange?.(e.target.checked as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        className="peer sr-only"
        {...props}
      />
      <div
        className={cn(
          "h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex items-center justify-center",
          isChecked ? "bg-primary text-primary-foreground" : "bg-background",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        aria-hidden="true"
      >
        {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </div>
    </div>
  );
});

CheckboxPrimitive.displayName = "PrimitiveCheckbox";
