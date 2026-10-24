import React, { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/cn";
import "./ConfirmModal.scss";

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLoading?: boolean;
  okText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  className?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmLoading = false,
  okText,
  cancelText,
  isDestructive = true,
  className,
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !confirmLoading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, confirmLoading, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fadeIn"
    >
      <div
        ref={modalRef}
        className={cn(
          "relative w-full max-w-md bg-white rounded-card border border-line shadow-raised p-6 flex flex-col gap-4 animate-scaleUp",
          className
        )}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={confirmLoading}
          aria-label="Đóng"
          className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 rounded-btn transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              isDestructive ? "bg-red-50 text-danger" : "bg-amber-50 text-warning"
            )}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div>
            <h3 id="confirm-modal-title" className="font-serif text-lg font-semibold text-ink">
              {title || t("common.confirm")}
            </h3>
            <div className="mt-1.5 text-sm text-ink-muted leading-relaxed">
              {content}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-2 pt-3 border-t border-line/60">
          <button
            type="button"
            onClick={onCancel}
            disabled={confirmLoading}
            className="px-4 py-2 text-sm font-medium text-ink bg-warm-white hover:bg-ivory border border-line rounded-btn transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy disabled:opacity-50"
          >
            {cancelText || t("common.cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmLoading}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white rounded-btn transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50",
              isDestructive
                ? "bg-danger hover:bg-danger/90 focus:ring-danger"
                : "bg-burgundy hover:bg-burgundy-dark focus:ring-burgundy"
            )}
          >
            {confirmLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {okText || t("common.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

