import React from "react";
import { cn } from "../../../lib/cn";

type TabsVariant = "pills" | "underline";
type TabsOrientation = "horizontal" | "vertical";

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
  variant: TabsVariant;
  orientation: TabsOrientation;
  baseId: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  children: React.ReactNode;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      variant = "pills",
      orientation = "horizontal",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : internalValue;
    const baseId = React.useId();

    const handleValueChange = React.useCallback(
      (val: string) => {
        if (!isControlled) {
          setInternalValue(val);
        }
        onValueChange?.(val);
      },
      [isControlled, onValueChange]
    );

    return (
      <TabsContext.Provider
        value={{
          value: activeValue,
          onValueChange: handleValueChange,
          variant,
          orientation,
          baseId,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "vertical" ? "flex-row gap-6" : "flex-col gap-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    if (!ctx) throw new Error("TabsList must be used within Tabs");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const tabs = Array.from(
        e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
      );
      const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = -1;
      const isHorizontal = ctx.orientation === "horizontal";

      if ((isHorizontal && e.key === "ArrowRight") || (!isHorizontal && e.key === "ArrowDown")) {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (
        (isHorizontal && e.key === "ArrowLeft") ||
        (!isHorizontal && e.key === "ArrowUp")
      ) {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== -1) {
        e.preventDefault();
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    };

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={ctx.orientation}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center",
          ctx.variant === "pills" &&
            "p-1 bg-stone-100 rounded-btn border border-line/60 gap-1",
          ctx.variant === "underline" &&
            "border-b border-line gap-6 w-full",
          ctx.orientation === "vertical" && "flex-col items-stretch",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, icon, className, children, disabled, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

    const isSelected = ctx.value === value;
    const triggerId = `${ctx.baseId}-trigger-${value}`;
    const contentId = `${ctx.baseId}-content-${value}`;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={triggerId}
        aria-selected={isSelected}
        aria-controls={contentId}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        onClick={() => ctx.onValueChange(value)}
        className={cn(
          "inline-flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 outline-none select-none disabled:opacity-40 disabled:pointer-events-none",
          ctx.variant === "pills" && [
            "px-4 py-2 rounded-md",
            isSelected
              ? "bg-white text-burgundy shadow-xs font-semibold"
              : "text-ink-muted hover:text-ink hover:bg-stone-200/50",
          ],
          ctx.variant === "underline" && [
            "py-2.5 border-b-2 -mb-px",
            isSelected
              ? "border-burgundy text-burgundy font-semibold"
              : "border-transparent text-ink-muted hover:text-ink hover:border-line",
          ],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    if (!ctx) throw new Error("TabsContent must be used within Tabs");

    const isSelected = ctx.value === value;
    const triggerId = `${ctx.baseId}-trigger-${value}`;
    const contentId = `${ctx.baseId}-content-${value}`;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={contentId}
        aria-labelledby={triggerId}
        tabIndex={0}
        className={cn("outline-none", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";
