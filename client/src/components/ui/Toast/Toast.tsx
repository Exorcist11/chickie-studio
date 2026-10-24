import * as React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type ToastVariant = "success" | "warning" | "danger" | "info";

export interface ToastProps {
  id?: string;
  variant?: ToastVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
  danger: <AlertCircle className="w-5 h-5 text-danger shrink-0" />,
  info: <Info className="w-5 h-5 text-info shrink-0" />,
};

const borderClasses: Record<ToastVariant, string> = {
  success: "border-success/30",
  warning: "border-warning/30",
  danger: "border-danger/30",
  info: "border-info/30",
};

export const Toast: React.FC<ToastProps> = ({
  variant = "info",
  title,
  message,
  onClose,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 p-4 bg-warm-white rounded-card border shadow-raised max-w-md w-full text-left transition-all",
        borderClasses[variant],
        className
      )}
    >
      <div className="mt-0.5">{icons[variant]}</div>
      <div className="flex-1 text-sm">
        {title && <h4 className="font-medium text-ink mb-0.5">{title}</h4>}
        <p className="text-ink-muted leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng thông báo"
          className="text-ink-muted hover:text-ink p-1 rounded-btn transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
