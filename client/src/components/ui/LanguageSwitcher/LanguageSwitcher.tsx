"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, Link, Locale } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export interface LanguageSwitcherProps {
  variant?: "pill" | "compact" | "icon";
  className?: string;
  onLocaleChange?: (locale: Locale) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "pill",
  className,
  onLocaleChange,
}) => {
  const currentLocale = (useLocale() || "vi") as Locale;
  const pathname = usePathname() || "/";

  if (variant === "icon") {
    const isVi = currentLocale === "vi";
    const targetLocale: Locale = isVi ? "en" : "vi";
    const targetLabel = isVi ? "Switch to English" : "Chuyển sang Tiếng Việt";

    return (
      <div
        role="radiogroup"
        aria-label="Chọn ngôn ngữ"
        className={cn("inline-flex items-center", className)}
      >
        <Link
          href={pathname}
          locale={targetLocale}
          role="radio"
          aria-checked={false}
          onClick={() => onLocaleChange?.(targetLocale)}
          aria-label={targetLabel}
          title={isVi ? "Chuyển sang English (EN)" : "Switch to Tiếng Việt (VI)"}
          className="relative flex items-center justify-center w-11 h-11 rounded-full text-ink hover:bg-ivory hover:text-burgundy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy group"
        >
          <Globe className="w-5 h-5 stroke-[1.75]" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute bottom-1.5 right-1 px-1 py-0.2 rounded bg-ivory text-burgundy font-bold text-[9px] border border-line leading-none tracking-tighter uppercase group-hover:bg-burgundy group-hover:text-warm-white transition-colors"
          >
            {currentLocale}
          </span>
        </Link>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        role="radiogroup"
        aria-label="Chọn ngôn ngữ"
        className={cn("inline-flex items-center gap-1.5 text-xs", className)}
      >
        <Link
          href={pathname}
          locale="vi"
          role="radio"
          aria-checked={currentLocale === "vi"}
          onClick={() => onLocaleChange?.("vi")}
          className={cn(
            "transition-colors font-medium px-1.5 py-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-burgundy",
            currentLocale === "vi"
              ? "text-burgundy font-bold underline underline-offset-4"
              : "text-ink-muted hover:text-ink"
          )}
          aria-label="Tiếng Việt"
        >
          VI
        </Link>
        <span className="text-ink-muted/50 select-none">|</span>
        <Link
          href={pathname}
          locale="en"
          role="radio"
          aria-checked={currentLocale === "en"}
          onClick={() => onLocaleChange?.("en")}
          className={cn(
            "transition-colors font-medium px-1.5 py-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-burgundy",
            currentLocale === "en"
              ? "text-burgundy font-bold underline underline-offset-4"
              : "text-ink-muted hover:text-ink"
          )}
          aria-label="English"
        >
          EN
        </Link>
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Chọn ngôn ngữ"
      className={cn(
        "inline-flex items-center bg-ivory/80 p-0.5 rounded-full border border-line text-xs shadow-xs",
        className
      )}
    >
      <Link
        href={pathname}
        locale="vi"
        role="radio"
        aria-checked={currentLocale === "vi"}
        onClick={() => onLocaleChange?.("vi")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-200 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy",
          currentLocale === "vi"
            ? "bg-burgundy text-warm-white font-semibold shadow-xs"
            : "text-ink-muted hover:text-ink hover:bg-rose/15"
        )}
        aria-label="Chuyển sang Tiếng Việt"
      >
        <span aria-hidden="true" className="text-xs">🇻🇳</span>
        <span>VI</span>
      </Link>

      <Link
        href={pathname}
        locale="en"
        role="radio"
        aria-checked={currentLocale === "en"}
        onClick={() => onLocaleChange?.("en")}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-200 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy",
          currentLocale === "en"
            ? "bg-burgundy text-warm-white font-semibold shadow-xs"
            : "text-ink-muted hover:text-ink hover:bg-rose/15"
        )}
        aria-label="Switch to English"
      >
        <span aria-hidden="true" className="text-xs">🇬🇧</span>
        <span>EN</span>
      </Link>
    </div>
  );
};
