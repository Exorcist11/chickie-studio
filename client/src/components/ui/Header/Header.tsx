"use client";

import * as React from "react";
import { Search, Heart, User, Menu, X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "../Logo";
import { Container } from "../Container";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { useNavigationProgress } from "@/components/common/NavigationProgressBar";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeaderProps {
  navItems?: NavItem[];
  activeHref?: string;
  currentType?: string;
  onSearchClick?: () => void;
  onFavoriteClick?: () => void;
  onAccountClick?: () => void;
  favoriteCount?: number;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  navItems,
  activeHref,
  currentType,
  onSearchClick,
  onFavoriteClick,
  onAccountClick,
  favoriteCount = 0,
  className,
}) => {
  const tNav = useTranslations("navigation");
  const pathname = usePathname() || "/";
  const { start: startProgress } = useNavigationProgress();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [pendingHref, setPendingHref] = React.useState<string | null>(null);

  // Reset pending state when activeHref or currentType or pathname changes
  React.useEffect(() => {
    setPendingHref(null);
  }, [activeHref, currentType, pathname]);

  const defaultNavItems: NavItem[] = React.useMemo(
    () => [
      { label: tNav("costumes"), href: "/thue-trang-phuc" },
      { label: tNav("cameras"), href: "/thue-may-anh" },
      { label: tNav("photography"), href: "/dich-vu-chup" },
      { label: tNav("lookbook"), href: "/lookbook" },
      { label: tNav("tracking"), href: "/tra-cuu-don" },
    ],
    [tNav]
  );

  const defaultMobileNavItems: NavItem[] = React.useMemo(
    () => [
      { label: tNav("home"), href: "/" },
      { label: tNav("costumes"), href: "/thue-trang-phuc" },
      { label: tNav("cameras"), href: "/thue-may-anh" },
      { label: tNav("photography"), href: "/dich-vu-chup" },
      { label: tNav("lookbook"), href: "/lookbook" },
      { label: tNav("tracking"), href: "/tra-cuu-don" },
      { label: tNav("contact"), href: "#footer-contact" },
    ],
    [tNav]
  );

  const resolveActiveItems = React.useCallback(
    (navItemList: NavItem[]) => {
      const normalizedPath = pathname.replace(/^\/(vi|en)/, "") || "/";
      return navItemList.map((item) => {
        let isActive = item.active;
        if (activeHref !== undefined) {
          isActive =
            item.href === activeHref ||
            (activeHref.includes("camera") && item.href === "/thue-may-anh") ||
            (activeHref.includes("costume") && item.href === "/thue-trang-phuc") ||
            (activeHref.includes("photography") && item.href === "/dich-vu-chup");
        } else if (currentType !== undefined) {
          const type = currentType.toLowerCase();
          if (type === "costume" && (item.href === "/thue-trang-phuc" || item.href.includes("costume"))) {
            isActive = true;
          } else if (type === "camera" && (item.href === "/thue-may-anh" || item.href.includes("camera"))) {
            isActive = true;
          } else if (type === "photography" && (item.href === "/dich-vu-chup" || item.href.includes("photography"))) {
            isActive = true;
          } else if ((!type || type === "lookbook") && (item.href === "/lookbook" || item.href === "/products")) {
            isActive = true;
          } else {
            isActive = false;
          }
        } else {
          // Automatic matching based on pathname (Supports dedicated routes and detail sub-paths!)
          if (item.href === "/" && (normalizedPath === "/" || normalizedPath === "")) {
            isActive = true;
          } else if (item.href !== "/") {
            isActive =
              normalizedPath === item.href ||
              normalizedPath.startsWith(item.href + "/");
          }
        }
        return {
          ...item,
          active: Boolean(isActive),
        };
      });
    },
    [activeHref, currentType, pathname]
  );

  const desktopItems = React.useMemo(
    () => resolveActiveItems(navItems || defaultNavItems),
    [resolveActiveItems, navItems, defaultNavItems]
  );

  const mobileItems = React.useMemo(
    () => resolveActiveItems(navItems || defaultMobileNavItems),
    [resolveActiveItems, navItems, defaultMobileNavItems]
  );

  // Close mobile drawer on Esc
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-warm-white border-b border-line shadow-xs transition-colors",
        className
      )}
    >
      <Container className="flex items-center justify-between h-18 md:h-20">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label={tNav("openMenu")}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-btn text-ink hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Logo href="/" />
        </div>

        {/* Center: Desktop Navigation - Core Business Offerings */}
        <nav
          className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-8"
          aria-label={tNav("mainMenu")}
        >
          {desktopItems.map((item) => {
            const isTracking = item.href === "/tra-cuu-don";
            const isPending = pendingHref === item.href;
            return (
              <React.Fragment key={item.href}>
                {isTracking && (
                  <span
                    className="h-4 w-px bg-line/80 mx-1 select-none hidden lg:block"
                    aria-hidden="true"
                  />
                )}
                <Link
                  href={item.href}
                  prefetch={true}
                  onClick={() => {
                    if (!item.active) {
                      setPendingHref(item.href);
                      startProgress();
                    }
                  }}
                  className={cn(
                    "text-sm font-medium whitespace-nowrap transition-colors duration-200 py-1.5 relative group inline-flex items-center gap-1.5",
                    item.active
                      ? "text-burgundy font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-burgundy after:rounded-full"
                      : isPending
                        ? "text-burgundy font-semibold animate-pulse"
                        : "text-ink/80 hover:text-burgundy"
                  )}
                >
                  {isPending && (
                    <Loader2
                      className="w-3 h-3 animate-spin text-burgundy shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span>{item.label}</span>
                  {!item.active && !isPending && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-burgundy/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
                  )}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Right: Actions (Language Switcher, Search, Favorite, Account) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <LanguageSwitcher variant="icon" />

          {onSearchClick && (
            <button
              type="button"
              onClick={onSearchClick}
              aria-label={tNav("search")}
              className="flex items-center justify-center w-11 h-11 rounded-full text-ink hover:bg-ivory hover:text-burgundy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>
          )}

          <button
            type="button"
            onClick={onFavoriteClick}
            aria-label={tNav("favorite")}
            className="relative flex items-center justify-center w-11 h-11 rounded-full text-ink hover:bg-ivory hover:text-burgundy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
          >
            <Heart className="w-5 h-5 stroke-[1.75]" />
            {favoriteCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-burgundy text-warm-white text-[10px] font-bold flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onAccountClick}
            aria-label={tNav("account")}
            className="flex items-center justify-center w-11 h-11 rounded-full text-ink hover:bg-ivory hover:text-burgundy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
          >
            <User className="w-5 h-5 stroke-[1.75]" />
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-ink/50 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="relative w-4/5 max-w-xs h-full bg-warm-white p-6 shadow-raised flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={tNav("mobileDialogTitle")}
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <Logo href="/" showTagline={false} />
                <div className="flex items-center gap-2">
                  <LanguageSwitcher variant="compact" />
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label={tNav("closeMenu")}
                    className="p-2 text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy rounded-btn"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <nav className="flex flex-col gap-3">
                {mobileItems.map((item) => {
                  const isPending = pendingHref === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={() => {
                        if (!item.active) {
                          setPendingHref(item.href);
                          startProgress();
                        }
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "text-base font-medium py-2 px-3 rounded-btn transition-colors flex items-center justify-between",
                        item.active
                          ? "bg-rose/40 text-burgundy font-semibold"
                          : isPending
                            ? "bg-rose/30 text-burgundy font-semibold animate-pulse"
                            : "text-ink hover:bg-ivory"
                      )}
                    >
                      <span>{item.label}</span>
                      {isPending && (
                        <Loader2
                          className="w-4 h-4 animate-spin text-burgundy shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-line text-xs text-ink-muted">
              <p className="font-serif italic text-burgundy mb-1">More than just a dress</p>
              <p>Hotline: 0987.654.321</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
