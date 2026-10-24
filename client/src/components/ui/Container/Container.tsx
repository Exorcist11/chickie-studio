import * as React from "react";
import { cn } from "@/lib/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  as: Component = "div",
  className,
  children,
  ...props
}) => {
  return (
    <Component
      className={cn(
        "w-full max-w-container mx-auto px-4 sm:px-6 md:px-8",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
