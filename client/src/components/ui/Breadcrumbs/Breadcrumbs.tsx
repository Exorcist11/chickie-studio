import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<"nav"> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  homeHref?: string;
  homeLabel?: string;
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      items,
      separator = <ChevronRight className="w-3.5 h-3.5 text-ink-muted/50 shrink-0" aria-hidden="true" />,
      homeHref = "/",
      homeLabel = "Trang chủ",
      className,
      ...props
    },
    ref
  ) => {
    const allItems: BreadcrumbItem[] = [
      { label: homeLabel, href: homeHref },
      ...items,
    ];

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn("flex items-center text-xs md:text-sm text-ink-muted", className)}
        {...props}
      >
        <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {allItems.map((item, idx) => {
            const isLast = idx === allItems.length - 1;

            return (
              <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5 sm:gap-2">
                {idx > 0 && separator}
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={cn(
                      "font-medium",
                      isLast ? "text-ink font-semibold" : "text-ink-muted"
                    )}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-burgundy transition-colors duration-150 underline-offset-4 hover:underline"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";
