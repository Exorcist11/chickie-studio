import * as React from "react";
import { SkeletonPrimitive } from "../../primitives/skeleton";
import { cn } from "../../lib/cn";

export type SkeletonShape = "text" | "circular" | "rectangular" | "card";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Kiểu hình dạng dựng sẵn: text (thanh văn bản), circular (hình tròn avatar), rectangular (khối), card (thẻ lớn) */
  shape?: SkeletonShape;
  /** Nhãn trợ năng cho trình đọc màn hình */
  label?: string;
}

const shapeStyles: Record<SkeletonShape, string> = {
  text: "h-4 w-full rounded-md",
  circular: "rounded-full",
  rectangular: "rounded-md",
  card: "h-48 w-full rounded-2xl",
};

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      shape = "text",
      label = "Đang tải dữ liệu...",
      "aria-hidden": ariaHidden,
      ...props
    },
    ref
  ) => {
    return (
      <SkeletonPrimitive
        ref={ref}
        role={ariaHidden ? undefined : "status"}
        aria-live={ariaHidden ? undefined : "polite"}
        aria-hidden={ariaHidden}
        className={cn(shapeStyles[shape], className)}
        {...props}
      >
        {!ariaHidden && label && <span className="sr-only">{label}</span>}
      </SkeletonPrimitive>
    );
  }
);

Skeleton.displayName = "Skeleton";
