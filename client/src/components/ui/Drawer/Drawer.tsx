"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  placement?: "right" | "left" | "bottom" | "top";
  size?: "sm" | "md" | "lg" | "full";
  closeOnBackdrop?: boolean;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  placement = "right",
  size = "md",
  closeOnBackdrop = true,
  className,
}) => {
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  const descId = React.useId();

  // Focus trap, restore focus, body scroll lock, Escape handler
  React.useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const timer = setTimeout(() => {
      if (drawerRef.current) {
        const focusable = drawerRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === "function") {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizePlacementClasses: Record<string, string> = {
    "right-sm": "top-0 right-0 h-full w-full max-w-sm border-l",
    "right-md": "top-0 right-0 h-full w-full max-w-md border-l",
    "right-lg": "top-0 right-0 h-full w-full max-w-xl border-l",
    "right-full": "top-0 right-0 h-full w-full border-l",
    "left-sm": "top-0 left-0 h-full w-full max-w-sm border-r",
    "left-md": "top-0 left-0 h-full w-full max-w-md border-r",
    "left-lg": "top-0 left-0 h-full w-full max-w-xl border-r",
    "left-full": "top-0 left-0 h-full w-full border-r",
    "bottom-sm": "bottom-0 left-0 right-0 max-h-[40vh] border-t rounded-t-card",
    "bottom-md": "bottom-0 left-0 right-0 max-h-[60vh] border-t rounded-t-card",
    "bottom-lg": "bottom-0 left-0 right-0 max-h-[85vh] border-t rounded-t-card",
    "bottom-full": "bottom-0 left-0 right-0 h-full border-t",
    "top-sm": "top-0 left-0 right-0 max-h-[40vh] border-b rounded-b-card",
    "top-md": "top-0 left-0 right-0 max-h-[60vh] border-b rounded-b-card",
    "top-lg": "top-0 left-0 right-0 max-h-[85vh] border-b rounded-b-card",
    "top-full": "top-0 left-0 right-0 h-full border-b",
  };

  const key = `${placement}-${size}`;
  const layoutClass = sizePlacementClasses[key] || sizePlacementClasses["right-md"];

  return (
    <div
      className="fixed inset-0 z-50 flex bg-ink/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={closeOnBackdrop ? onClose : undefined}
      data-testid="drawer-backdrop"
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "fixed bg-warm-white border-line shadow-raised flex flex-col text-left transition-transform duration-200 ease-out",
          layoutClass,
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-center justify-between p-5 border-b border-line/60 shrink-0">
            <div>
              {title && (
                <h3 id={titleId} className="font-serif text-lg font-medium text-ink">
                  {title}
                </h3>
              )}
              {description && (
                <p id={descId} className="text-xs text-ink-muted mt-0.5">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng ngăn kéo"
              className="text-ink-muted hover:text-ink p-1.5 rounded-btn transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {!title && !description && (
          <div className="flex justify-end p-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng ngăn kéo"
              className="text-ink-muted hover:text-ink p-1.5 rounded-btn transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 text-ink">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-line/60 bg-ivory/40 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
