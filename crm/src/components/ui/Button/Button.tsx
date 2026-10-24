import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-btn transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-burgundy text-warm-white hover:bg-burgundy-light active:bg-burgundy-dark shadow-xs",
        secondary:
          "border border-line text-ink bg-white hover:bg-ivory active:bg-ivory/80 shadow-xs",
        outline:
          "border border-burgundy text-burgundy bg-transparent hover:bg-ivory active:bg-rose/20",
        ghost:
          "text-ink bg-transparent hover:bg-ivory active:bg-line/40",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/80 shadow-xs focus-visible:ring-destructive",
        tertiary:
          "text-burgundy bg-transparent hover:underline underline-offset-4 p-0 h-auto",
      },
      size: {
        default: "min-h-[40px] px-4 py-2 text-sm",
        md: "min-h-[40px] px-4 py-2 text-sm",
        sm: "min-h-[32px] px-3 py-1 text-xs",
        lg: "min-h-[48px] px-6 py-2.5 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      href,
      isLoading = false,
      loading,
      disabled,
      children,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const isBusy = Boolean(isLoading || loading);
    const isDisabled = disabled || isBusy;

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            data-testid="button-spinner"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && (
          <span className="mr-2 inline-flex shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">{children}</span>
        {!isLoading && rightIcon && (
          <span className="ml-2 inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </>
    );

    if (href && !isDisabled) {
      return (
        <a
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
