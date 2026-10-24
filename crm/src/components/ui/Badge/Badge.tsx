import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-burgundy text-warm-white shadow-xs",
        secondary:
          "border border-line bg-ivory text-ink",
        destructive:
          "border-transparent bg-destructive text-white shadow-xs",
        outline:
          "border border-line text-ink bg-transparent",
        success:
          "border border-emerald-200 bg-emerald-50 text-emerald-800",
        warning:
          "border border-amber-200 bg-amber-50 text-amber-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
