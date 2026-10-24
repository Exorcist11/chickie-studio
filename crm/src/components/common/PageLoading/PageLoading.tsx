import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/cn";
import "./PageLoading.scss";

export interface PageLoadingProps {
  tip?: string;
  className?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ tip, className }) => {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "py-16 px-6 flex flex-col items-center justify-center min-h-[240px] gap-3 text-center",
        className
      )}
    >
      <div className="w-9 h-9 border-3 border-burgundy border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-medium text-ink-muted">
        {tip || t("common.loading")}
      </span>
    </div>
  );
};

