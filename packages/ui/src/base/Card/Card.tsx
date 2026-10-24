import * as React from "react";
import {
  CardPrimitive,
  CardHeaderPrimitive,
  CardDescriptionPrimitive,
  CardContentPrimitive,
  CardFooterPrimitive,
} from "../../primitives/card";
import { cn } from "../../lib/cn";

export type CardVariant = "default" | "elevated" | "outline" | "ghost";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Biến thể hiển thị thẻ: default (viền nhẹ + bóng mờ), elevated (bóng nổi), outline (chỉ viền), ghost (phẳng) */
  variant?: CardVariant;
  /** Hiệu ứng hover cho thẻ có tương tác (tăng bóng, nâng nhẹ) */
  interactive?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-card text-card-foreground border border-border shadow-xs",
  elevated: "bg-card text-card-foreground border border-border/60 shadow-md",
  outline: "bg-card text-card-foreground border border-border shadow-none",
  ghost: "bg-transparent text-card-foreground border-transparent shadow-none",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", interactive = false, ...props }, ref) => {
    return (
      <CardPrimitive
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-200",
          variantStyles[variant],
          interactive &&
            "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <CardHeaderPrimitive
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Thẻ heading ngữ nghĩa: h1-h6 (mặc định h3) */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = "h3", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "text-lg font-semibold leading-tight tracking-tight text-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <CardDescriptionPrimitive
      ref={ref}
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <CardContentPrimitive
        ref={ref}
        className={cn("p-6 pt-0", className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <CardFooterPrimitive
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";
