import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "../../../lib/cn";
import "./Modal.scss";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "modal" | "drawer";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  closeButtonAriaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  icon,
  headerExtra,
  children,
  footer,
  variant = "modal",
  maxWidth = "md",
  className,
  bodyClassName,
  headerClassName,
  footerClassName,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  closeButtonAriaLabel = "close-modal",
  ariaLabelledBy = "crm-modal-title",
  ariaDescribedBy,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEsc, onClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  const hasHeader = Boolean(title || icon || headerExtra || showCloseButton);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? ariaLabelledBy : undefined}
      aria-describedby={ariaDescribedBy}
      className={cn("crm-modal", variant === "drawer" && "crm-modal--drawer")}
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={cardRef}
        className={cn(
          "crm-modal__card",
          `crm-modal__card--${maxWidth}`,
          variant === "drawer" && "crm-modal__card--drawer",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {hasHeader && (
          <div className={cn("crm-modal__header", headerClassName)}>
            <div className="crm-modal__header-content">
              {icon && <div className="crm-modal__header-icon">{icon}</div>}
              {(title || subtitle) && (
                <div className="crm-modal__title-group">
                  {title && (
                    <h3 id={ariaLabelledBy} className="crm-modal__title">
                      {title}
                    </h3>
                  )}
                  {subtitle && <p className="crm-modal__subtitle">{subtitle}</p>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {headerExtra}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="crm-modal__close-btn"
                  aria-label={closeButtonAriaLabel}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className={cn("crm-modal__body", bodyClassName)}>{children}</div>

        {footer && (
          <div className={cn("crm-modal__footer", footerClassName)}>{footer}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
