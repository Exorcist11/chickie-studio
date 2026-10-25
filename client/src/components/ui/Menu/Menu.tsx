"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface MenuProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export interface MenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export interface MenuHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface MenuDividerProps {
  className?: string;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({ children, className }) => (
  <div className={cn("px-3 py-1.5 text-xs font-medium text-ink-muted select-none", className)}>
    {children}
  </div>
);

export const MenuDivider: React.FC<MenuDividerProps> = ({ className }) => (
  <div role="separator" className={cn("my-1 border-t border-line/60", className)} />
);

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  icon,
  danger = false,
  disabled = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      aria-disabled={disabled}
      tabIndex={-1}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
      }}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left rounded-btn transition-colors outline-none select-none",
        "focus-visible:ring-1 focus-visible:ring-burgundy",
        disabled
          ? "opacity-50 cursor-not-allowed text-ink-muted"
          : danger
          ? "text-danger hover:bg-danger/10 focus:bg-danger/10"
          : "text-ink hover:bg-ivory focus:bg-ivory",
        className
      )}
    >
      {icon && <span className="shrink-0 w-4 h-4 text-current flex items-center justify-center">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
};

export const Menu: React.FC<MenuProps> = ({
  trigger,
  children,
  align = "left",
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuId = React.useId();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Click outside to close
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (!menuRef.current) return;

      const items = Array.from(
        menuRef.current.querySelectorAll<HTMLButtonElement>(
          'button[role="menuitem"]:not([disabled])'
        )
      );

      if (items.length === 0) return;

      const activeIndex = items.findIndex((item) => item === document.activeElement);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
        items[nextIndex].focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
        items[prevIndex].focus();
      } else if (event.key === "Home") {
        event.preventDefault();
        items[0].focus();
      } else if (event.key === "End") {
        event.preventDefault();
        items[items.length - 1].focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    // Initial focus on first non-disabled item
    const timer = setTimeout(() => {
      if (menuRef.current) {
        const first = menuRef.current.querySelector<HTMLButtonElement>(
          'button[role="menuitem"]:not([disabled])'
        );
        first?.focus();
      }
    }, 30);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen]);

  const clonedTrigger = React.cloneElement(trigger, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      // Preserve any existing ref on trigger
      const originalRef = (trigger as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof originalRef === "function") {
        originalRef(node);
      } else if (originalRef && "current" in (originalRef as object)) {
        (originalRef as { current: HTMLElement | null }).current = node;
      }
    },
    "aria-haspopup": "menu",
    "aria-expanded": isOpen,
    "aria-controls": isOpen ? menuId : undefined,
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
          id={menuId}
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
          onClick={(e) => {
            // Close menu if a menuitem was clicked
            const target = (e.target as HTMLElement).closest('button[role="menuitem"]');
            if (target && !target.hasAttribute("disabled")) {
              setIsOpen(false);
            }
          }}
          className={cn(
            "absolute z-40 mt-1.5 min-w-[180px] p-1.5 bg-warm-white rounded-card border border-line shadow-raised animate-in fade-in zoom-in-95 duration-100",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
