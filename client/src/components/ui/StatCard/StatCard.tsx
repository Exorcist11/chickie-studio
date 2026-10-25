import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface StatCardProps {
  title: string;
  value: string | number;
  prefix?: React.ReactNode;
  suffix?: string;
  trend?: {
    value: number;
    isPositive?: boolean;
    description?: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  icon,
  className,
}) => {
  const isPositive = trend?.isPositive !== false;

  return (
    <div
      className={cn(
        "bg-warm-white rounded-card border border-line p-5 shadow-card flex flex-col justify-between transition-all hover:shadow-raised hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-ink-muted">{title}</span>
          <div className="font-serif text-2xl lg:text-3xl font-semibold text-ink mt-2 flex items-baseline">
            {prefix && <span className="mr-1 text-xl">{prefix}</span>}
            <span>{value}</span>
            {suffix && (
              <span className="ml-1 text-sm font-normal text-ink-muted">
                {suffix}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className="w-11 h-11 rounded-card bg-burgundy/10 text-burgundy flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3.5 flex items-center gap-1.5 text-xs text-ink-muted pt-2 border-t border-line/50">
          <span
            className={cn(
              "inline-flex items-center gap-1 font-semibold",
              isPositive ? "text-emerald-700" : "text-danger"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </span>
          {trend.description && <span>{trend.description}</span>}
        </div>
      )}
    </div>
  );
};
