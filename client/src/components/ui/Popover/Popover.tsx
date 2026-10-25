"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface PopoverProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  title?: string;
  ariaLabel?: string;
  placement?: "bottom" | "top" | "left" | "right";
  align?: "start" | "center" | "end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  title,
  ariaLabel = "Hộp thông tin",
  placement = "bottom",
  align = "start",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  closeOnClickOutside = true,
  closeOnEsc = true,
  className,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const popoverId = React.useId();

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const handleToggle = () => {
    setOpen(!isOpen);
  };

  const handleClose = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [setOpen]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnClickOutside, closeOnEsc, setOpen, handleClose]);

  const placementClasses: Record<string, string> = {
    "bottom-start": "top-full left-0 mt-2",
    "bottom-center": "top-full left-1/2 -translate-x-1/2 mt-2",
    "bottom-end": "top-full right-0 mt-2",
    "top-start": "bottom-full left-0 mb-2",
    "top-center": "bottom-full left-1/2 -translate-x-1/2 mb-2",
    "top-end": "bottom-full right-0 mb-2",
    "left-start": "right-full top-0 mr-2",
    "left-center": "right-full top-1/2 -translate-y-1/2 mr-2",
    "left-end": "right-full bottom-0 mr-2",
    "right-start": "left-full top-0 ml-2",
    "right-center": "left-full top-1/2 -translate-y-1/2 ml-2",
    "right-end": "left-full bottom-0 ml-2",
  };

  const key = `${placement}-${align}`;
  const positionClass = placementClasses[key] || placementClasses["bottom-start"];

  const clonedTrigger = React.cloneElement(trigger, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      const originalRef = (trigger as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof originalRef === "function") {
        originalRef(node);
      } else if (originalRef && "current" in (originalRef as object)) {
        (originalRef as { current: HTMLElement | null }).current = node;
      }
    },
    "aria-haspopup": "dialog",
    "aria-expanded": isOpen,
    "aria-controls": isOpen ? popoverId : undefined,
    onClick: (e: React.MouseEvent) => {
      trigger.props.onClick?.(e);
      handleToggle();
    },
  });

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {clonedTrigger}

      {isOpen && (
        <div
          id={popoverId}
          role="dialog"
          aria-label={ariaLabel}
          aria-modal="false"
          tabIndex={-1}
          className={cn(
            "absolute z-40 p-4 bg-warm-white rounded-card border border-line shadow-raised min-w-[240px] animate-in fade-in duration-150",
            positionClass,
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
