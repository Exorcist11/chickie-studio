import React from "react";
import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/cn";
import "./EmptyState.scss";

export interface EmptyStateProps {
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  description,
  actionText,
  onAction,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "py-12 px-6 flex flex-col items-center justify-center text-center",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-ivory flex items-center justify-center text-stone-400 mb-4">
        <Inbox className="w-8 h-8 stroke-[1.5]" />
      </div>

      <p className="text-sm text-ink-muted max-w-sm mb-4">
        {description || t("common.empty")}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium text-white bg-burgundy hover:bg-burgundy-dark rounded-btn transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

