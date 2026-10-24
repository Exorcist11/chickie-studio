"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Heart, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "../Logo";
import { Container } from "../Container";

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
  navItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Thuê trang phục", href: "/products?type=costume" },
    { label: "Thuê máy ảnh", href: "/products?type=camera" },
    { label: "Dịch vụ chụp", href: "/products?type=photography" },
    { label: "Lookbook", href: "/products" },
    { label: "Liên hệ", href: "#footer-contact" },
  ],
  activeHref,
  currentType,
  onSearchClick,
  onFavoriteClick,
  onAccountClick,
  favoriteCount = 0,
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const items = React.useMemo(() => {
    return navItems.map((item) => {
      let isActive = item.active;
      if (activeHref !== undefined) {
        isActive = item.href === activeHref;
      } else if (currentType !== undefined) {
        const type = currentType.toLowerCase();
        if (type === "costume" && item.href.includes("type=costume")) isActive = true;
        else if (type === "camera" && item.href.includes("type=camera")) isActive = true;
        else if (type === "photography" && item.href.includes("type=photography")) isActive = true;
        else if (!type && item.href === "/products") isActive = true;
        else isActive = false;
      }
      return {
        ...item,
        active: isActive,
      };
    });
  }, [navItems, activeHref, currentType]);

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
        "sticky top-0 z-40 w-full bg-warm-white/95 backdrop-blur-md border-b border-line shadow-xs transition-colors",
        className
      )}
    >
      <Container className="flex items-center justify-between h-18 md:h-20">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Mở menu di động"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-btn text-ink hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Logo href="/" />
        </div>

        {/* Center: Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8"
          aria-label="Menu chính"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-burgundy py-1 relative",
                item.active
                  ? "text-burgundy font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-burgundy after:rounded-full"
                  : "text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions (Search, Favorite, Account) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {onSearchClick && (
            <button
              type="button"
              onClick={onSearchClick}
              aria-label="Tìm kiếm sản phẩm"
              className="flex items-center justify-center w-11 h-11 rounded-full text-ink hover:bg-ivory hover:text-burgundy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>
          )}

          <button
            type="button"
            onClick={onFavoriteClick}
            aria-label="Danh sách yêu thích"
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
            aria-label="Tài khoản cá nhân"
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
            aria-label="Menu điều hướng di động"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <Logo href="/" showTagline={false} />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Đóng menu di động"
                  className="p-2 text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy rounded-btn"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-3">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-base font-medium py-2 px-3 rounded-btn transition-colors",
                      item.active
                        ? "bg-rose/40 text-burgundy font-semibold"
                        : "text-ink hover:bg-ivory"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
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
