import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "../../../lib/cn";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onRetry?: () => void;
  retryText?: string;
  action?: React.ReactNode;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Đã xảy ra lỗi kết nối",
  description = "Không thể tải dữ liệu vào lúc này. Vui lòng kiểm tra kết nối mạng hoặc thử lại.",
  icon,
  onRetry,
  retryText = "Thử lại",
  action,
  className,
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-card border border-red-200 shadow-xs",
        className
      )}
    >
      <div
        className="w-14 h-14 rounded-full bg-red-50 text-danger flex items-center justify-center mb-3.5 shadow-2xs"
        aria-hidden="true"
      >
        {icon || <AlertCircle className="w-7 h-7 stroke-[1.5]" />}
      </div>
      <h3 className="font-playfair text-lg font-semibold text-ink">{title}</h3>
      {description && (
        <p className="text-sm text-ink-muted max-w-sm mt-1.5 mb-5 leading-relaxed">
          {description}
        </p>
      )}

      {action ? (
        <div className="mt-2">{action}</div>
      ) : onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-medium text-white bg-burgundy hover:bg-burgundy/90 active:scale-98 rounded-btn transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{retryText}</span>
        </button>
      ) : null}
    </div>
  );
};
