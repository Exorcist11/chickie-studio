import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../../lib/cn";
import "./PageHeader.scss";

export interface BreadcrumbItem {
  title: React.ReactNode;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}) => {
  return (
    <div className={cn("mb-6 flex flex-col gap-2", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-muted">
          {breadcrumbs.map((b, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {b.href && !isLast ? (
                  <a href={b.href} className="hover:text-burgundy transition-colors">
                    {b.title}
                  </a>
                ) : (
                  <span className={cn(isLast ? "font-medium text-ink" : "")}>{b.title}</span>
                )}
                {!isLast && <ChevronRight className="w-3.5 h-3.5 text-stone-400" />}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-ink leading-tight">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
};

