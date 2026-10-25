import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn";

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

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const rootCtx = React.useContext(AccordionContext);
    const itemCtx = React.useContext(AccordionItemContext);

    if (!rootCtx || !itemCtx) {
      throw new Error("AccordionTrigger must be used within AccordionItem");
    }

    return (
      <h3 className="flex">
        <button
          ref={ref}
          type="button"
          id={itemCtx.triggerId}
          aria-expanded={itemCtx.isExpanded}
          aria-controls={itemCtx.contentId}
          disabled={itemCtx.disabled}
          onClick={() => rootCtx.toggleItem(itemCtx.value)}
          className={cn(
            "flex flex-1 items-center justify-between py-3.5 text-left text-sm font-medium text-ink transition-all hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy rounded-sm group",
            className
          )}
          {...props}
        >
          <span>{children}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 group-hover:text-burgundy",
              itemCtx.isExpanded && "rotate-180 text-burgundy"
            )}
            aria-hidden="true"
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
      throw new Error("AccordionContent must be used within AccordionItem");
    }

    if (!itemCtx.isExpanded) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={itemCtx.contentId}
        role="region"
        aria-labelledby={itemCtx.triggerId}
        className={cn("pb-4 pt-1 text-sm text-ink-muted leading-relaxed", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";
