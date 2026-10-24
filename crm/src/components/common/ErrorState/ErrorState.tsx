import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/cn";
import "./ErrorState.scss";

export interface ErrorStateProps {
  title?: string;
  subTitle?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  subTitle,
  onRetry,
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
      <div className="w-16 h-16 rounded-full bg-red-50 text-danger flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h3 className="font-playfair text-xl font-semibold text-ink mb-2">
        {title || t("error.title")}
      </h3>

      <p className="text-sm text-ink-muted max-w-sm mb-6">
        {subTitle || t("error.description")}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-burgundy hover:bg-burgundy-dark rounded-btn transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy"
        >
          <RotateCcw className="w-4 h-4" />
          {t("error.retry")}
        </button>
      )}
    </div>
  );
};

