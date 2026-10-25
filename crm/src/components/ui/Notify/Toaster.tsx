import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../../lib/cn";
import { notify, ToastItem, NotifyVariant } from "./notify";

export interface ToasterProps {
  position?: "top-right" | "bottom-right" | "top-center" | "bottom-center";
  className?: string;
}

const icons: Record<NotifyVariant, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-danger shrink-0" />,
  info: <Info className="w-5 h-5 text-info shrink-0" />,
};

const borderClasses: Record<NotifyVariant, string> = {
  success: "border-success/30",
  warning: "border-warning/30",
  error: "border-danger/30",
  info: "border-info/30",
};

interface ToastToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastElement: React.FC<ToastToastProps> = ({ toast, onDismiss }) => {
  const [isPaused, setIsPaused] = useState(false);
  const remainingTimeRef = useRef(toast.duration);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (toast.duration <= 0) return;

    if (!isPaused) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onDismiss(toast.id);
      }, remainingTimeRef.current);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, toast.duration, toast.id, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "flex items-start gap-3 p-4 bg-warm-white rounded-card border shadow-raised max-w-sm w-full text-left transition-all animate-in fade-in slide-in-from-top-2 duration-200",
        borderClasses[toast.variant]
      )}
    >
      <div className="mt-0.5">{icons[toast.variant]}</div>
      <div className="flex-1 min-w-0 text-sm">
        {toast.title && <h4 className="font-medium text-ink mb-0.5 truncate">{toast.title}</h4>}
        <p className="text-ink-muted leading-relaxed break-words">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Đóng thông báo"
        className="text-ink-muted hover:text-ink p-1 rounded-btn transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const Toaster: React.FC<ToasterProps> = ({
  position = "top-right",
  className,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = notify.subscribe((currentToasts) => {
      setToasts(currentToasts);
    });
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  const positionClasses: Record<string, string> = {
    "top-right": "top-4 right-4 items-end",
    "bottom-right": "bottom-4 right-4 items-end",
    "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  };

  return (
    <div
      aria-label="Khu vực thông báo CRM"
      className={cn(
        "fixed z-50 flex flex-col gap-2 pointer-events-none p-4",
        positionClasses[position] || positionClasses["top-right"],
        className
      )}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastElement
            toast={toast}
            onDismiss={(id) => notify.dismiss(id)}
          />
        </div>
      ))}
    </div>
  );
};
