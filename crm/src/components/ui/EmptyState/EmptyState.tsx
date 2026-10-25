import React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "../../../lib/cn";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Không có dữ liệu",
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-card border border-line/60 shadow-xs",
        className
      )}
    >
      <div
        className="w-14 h-14 rounded-full bg-stone-100 text-ink-muted flex items-center justify-center mb-3.5 shadow-2xs"
        aria-hidden="true"
      >
        {icon || <FolderOpen className="w-7 h-7 stroke-[1.5]" />}
      </div>
      <h3 className="font-playfair text-lg font-semibold text-ink">{title}</h3>
      {description && (
        <p className="text-sm text-ink-muted max-w-sm mt-1 mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
