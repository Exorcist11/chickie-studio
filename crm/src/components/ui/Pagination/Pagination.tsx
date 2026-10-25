import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../../../lib/cn";

export interface PaginationRootProps extends React.ComponentPropsWithoutRef<"nav"> {
  children?: React.ReactNode;
}

export const PaginationRoot = React.forwardRef<HTMLElement, PaginationRootProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
);
PaginationRoot.displayName = "PaginationRoot";

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1.5", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

export interface PaginationLinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({ className, isActive, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-btn text-xs md:text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-burgundy disabled:opacity-40 disabled:pointer-events-none",
      isActive
        ? "bg-burgundy text-white shadow-xs font-semibold"
        : "text-ink-muted hover:text-ink hover:bg-stone-100",
      className
    )}
    {...props}
  />
));
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Trang trước"
    className={cn(
      "inline-flex items-center justify-center gap-1 h-9 px-3 rounded-btn text-xs md:text-sm font-medium text-ink-muted hover:text-ink hover:bg-stone-100 transition-colors disabled:opacity-40 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-burgundy outline-none",
      className
    )}
    {...props}
  >
    <ChevronLeft className="w-4 h-4" />
    <span className="hidden sm:inline">Trước</span>
  </button>
));
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Trang tiếp"
    className={cn(
      "inline-flex items-center justify-center gap-1 h-9 px-3 rounded-btn text-xs md:text-sm font-medium text-ink-muted hover:text-ink hover:bg-stone-100 transition-colors disabled:opacity-40 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-burgundy outline-none",
      className
    )}
    {...props}
  >
    <span className="hidden sm:inline">Tiếp</span>
    <ChevronRight className="w-4 h-4" />
  </button>
));
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis: React.FC<React.ComponentPropsWithoutRef<"span">> = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center text-ink-muted", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Nhiều trang hơn</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export interface PaginationProps extends React.ComponentPropsWithoutRef<"nav"> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showTotal?: boolean;
  totalItems?: number;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showTotal = false,
      totalItems,
      className,
      ...props
    },
    ref
  ) => {
    const pages = React.useMemo(() => {
      const items: (number | "ellipsis")[] = [];

      const leftSibling = Math.max(currentPage - siblingCount, 1);
      const rightSibling = Math.min(currentPage + siblingCount, totalPages);

      const shouldShowLeftDots = leftSibling > 2;
      const shouldShowRightDots = rightSibling < totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount;
        for (let i = 1; i <= Math.min(leftItemCount, totalPages); i++) {
          items.push(i);
        }
        if (leftItemCount < totalPages) {
          items.push("ellipsis");
          items.push(totalPages);
        }
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        items.push(1);
        items.push("ellipsis");
        const rightItemCount = 3 + 2 * siblingCount;
        for (let i = Math.max(totalPages - rightItemCount + 1, 1); i <= totalPages; i++) {
          items.push(i);
        }
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        items.push(1);
        items.push("ellipsis");
        for (let i = leftSibling; i <= rightSibling; i++) {
          items.push(i);
        }
        items.push("ellipsis");
        items.push(totalPages);
      } else {
        for (let i = 1; i <= totalPages; i++) {
          items.push(i);
        }
      }

      return items;
    }, [currentPage, siblingCount, totalPages]);

    if (totalPages <= 1 && !showTotal) return null;

    return (
      <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
        {showTotal && totalItems !== undefined && (
          <span className="text-xs md:text-sm text-ink-muted">
            Tổng cộng: <strong className="text-ink font-semibold">{totalItems}</strong> mục
          </span>
        )}

        <PaginationRoot ref={ref} {...props}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
              />
            </PaginationItem>

            {pages.map((p, idx) => (
              <PaginationItem key={`${p}-${idx}`}>
                {p === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={p === currentPage}
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </PaginationRoot>
      </div>
    );
  }
);
Pagination.displayName = "Pagination";
