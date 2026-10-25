"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggleItem: (value: string) => void;
  type: AccordionType;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AccordionType;
  collapsible?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = "single",
      collapsible = true,
      value: controlledValue,
      defaultValue,
      onValueChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;

    const [internalExpanded, setInternalExpanded] = React.useState<Set<string>>(() => {
      const initial = controlledValue ?? defaultValue;
      if (!initial) return new Set<string>();
      if (Array.isArray(initial)) return new Set(initial);
      return new Set([initial]);
    });

    const expandedItems = React.useMemo(() => {
      if (!isControlled) return internalExpanded;
      if (!controlledValue) return new Set<string>();
      if (Array.isArray(controlledValue)) return new Set(controlledValue);
      return new Set([controlledValue]);
    }, [isControlled, controlledValue, internalExpanded]);

    const toggleItem = React.useCallback(
      (itemValue: string) => {
        let next: Set<string>;
        if (type === "single") {
          if (expandedItems.has(itemValue)) {
            next = collapsible ? new Set() : new Set([itemValue]);
          } else {
            next = new Set([itemValue]);
          }
        } else {
          next = new Set(expandedItems);
          if (next.has(itemValue)) {
            next.delete(itemValue);
          } else {
            next.add(itemValue);
          }
        }

        if (!isControlled) {
          setInternalExpanded(next);
        }

        if (onValueChange) {
          if (type === "single") {
            const arr = Array.from(next);
            onValueChange(arr.length > 0 ? arr[0] : "");
          } else {
            onValueChange(Array.from(next));
          }
        }
      },
      [collapsible, expandedItems, isControlled, onValueChange, type]
    );

    return (
      <AccordionContext.Provider value={{ expandedItems, toggleItem, type }}>
        <div ref={ref} className={cn("divide-y divide-line/60 rounded-card", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

interface AccordionItemContextValue {
  value: string;
  isExpanded: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    const rootCtx = React.useContext(AccordionContext);
    if (!rootCtx) {
      throw new Error("AccordionItem must be used within an Accordion");
    }

    const isExpanded = rootCtx.expandedItems.has(value);
    const triggerId = React.useId();
    const contentId = React.useId();

    return (
      <AccordionItemContext.Provider value={{ value, isExpanded, disabled, triggerId, contentId }}>
        <div
          ref={ref}
          data-state={isExpanded ? "open" : "closed"}
          data-disabled={disabled ? "" : undefined}
          className={cn("py-1", disabled && "opacity-50", className)}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, disabled: triggerDisabled, children, ...props }, ref) => {
    const rootCtx = React.useContext(AccordionContext);
    const itemCtx = React.useContext(AccordionItemContext);

    if (!rootCtx || !itemCtx) {
      throw new Error("AccordionTrigger must be used within an AccordionItem");
    }

    const { isExpanded, triggerId, contentId, value, disabled: itemDisabled } = itemCtx;
    const isDisabled = triggerDisabled || itemDisabled;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e);
      if (!e.defaultPrevented && !isDisabled) {
        rootCtx.toggleItem(value);
      }
    };

    return (
      <h3 className="flex font-normal">
        <button
          ref={ref}
          id={triggerId}
          type="button"
          disabled={isDisabled}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          data-state={isExpanded ? "open" : "closed"}
          onClick={handleClick}
          className={cn(
            "flex flex-1 items-center justify-between py-4 text-left font-serif text-base md:text-lg font-medium text-ink transition-all hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 rounded-sm cursor-pointer select-none disabled:cursor-not-allowed disabled:hover:text-ink",
            className
          )}
          {...props}
        >
          <span>{children}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 ease-out ml-4",
              isExpanded && "rotate-180 text-burgundy"
            )}
          />
        </button>
      </h3>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const itemCtx = React.useContext(AccordionItemContext);

    if (!itemCtx) {
      throw new Error("AccordionContent must be used within an AccordionItem");
    }

    const { isExpanded, contentId, triggerId } = itemCtx;

    if (!isExpanded) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        data-state="open"
        className={cn(
          "pb-4 pt-1 text-sm md:text-base leading-relaxed text-ink-muted animate-in fade-in-50 duration-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";
