"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/Spinner";

export interface NavigationProgressContextValue {
  /** Bắt đầu hiệu ứng loading thanh tiến trình chuyển trang */
  start: () => void;
  /** Hoàn thành hiệu ứng chuyển trang */
  done: () => void;
  /** Trạng thái hiện tại có đang trong quá trình chuyển trang hay không */
  isLoading: boolean;
}

const NavigationProgressContext = React.createContext<NavigationProgressContextValue>({
  start: () => {},
  done: () => {},
  isLoading: false,
});

/** Hook tiện ích để điều khiển thanh tiến trình chuyển trang theo nhu cầu */
export const useNavigationProgress = (): NavigationProgressContextValue => {
  return React.useContext(NavigationProgressContext);
};

export type NavigationStatus = "idle" | "loading" | "completing";

export interface NavigationProgressBarProps {
  /** Nội dung con nếu dùng dưới dạng bọc layout */
  children?: React.ReactNode;
  /** Có hiển thị micro indicator góc phải khi đang chuyển trang không (mặc định: true) */
  showIndicator?: boolean;
  className?: string;
}

export const NavigationProgressBar: React.FC<NavigationProgressBarProps> = ({
  children,
  showIndicator = true,
  className,
}) => {
  const tNav = useTranslations("navigation");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = React.useState<NavigationStatus>("idle");
  const finishTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const activeUrlRef = React.useRef<string>("");

  const clearTimers = React.useCallback(() => {
    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  const start = React.useCallback(() => {
    clearTimers();
    setStatus("loading");

    // Safety fallback: Tự động kết thúc nếu không nhận được phản hồi sau 8 giây
    safetyTimeoutRef.current = setTimeout(() => {
      setStatus("completing");
      finishTimeoutRef.current = setTimeout(() => {
        setStatus("idle");
      }, 300);
    }, 8000);
  }, [clearTimers]);

  const done = React.useCallback(() => {
    clearTimers();
    setStatus((prev) => {
      if (prev === "loading") {
        finishTimeoutRef.current = setTimeout(() => {
          setStatus("idle");
        }, 300);
        return "completing";
      }
      return "idle";
    });
  }, [clearTimers]);

  // Hoàn thành tiến trình khi URL hoặc SearchParams thay đổi
  React.useEffect(() => {
    const currentFullUrl = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    if (activeUrlRef.current && activeUrlRef.current !== currentFullUrl) {
      done();
    }
    activeUrlRef.current = currentFullUrl;
  }, [pathname, searchParams, done]);

  // Lắng nghe sự kiện click trên các thẻ liên kết nội bộ
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Bỏ qua nếu sự kiện đã bị chặn hoặc không phải click chuột trái
      if (e.defaultPrevented || e.button !== 0) return;
      // Bỏ qua nếu người dùng bấm kèm phím bổ trợ (mở tab mới / cửa sổ mới)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a");
      if (!anchor) return;

      // Bỏ qua liên kết có target khác _self, download, hoặc giao thức ngoài
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const rawHref = anchor.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Bỏ qua nếu là liên kết ngoài tên miền hiện tại
        if (targetUrl.origin !== currentUrl.origin) return;

        // Bỏ qua nếu cùng trang và chỉ khác hash fragment
        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search &&
          targetUrl.hash !== currentUrl.hash
        ) {
          return;
        }

        // Bỏ qua nếu bấm lại đúng trang hiện tại
        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search
        ) {
          return;
        }

        // Khởi động thanh tiến trình lập tức (0ms feedback)
        start();
      } catch {
        // Bỏ qua nếu URL không hợp lệ
      }
    };

    const handlePopState = () => {
      start();
    };

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, [start, clearTimers]);

  const value = React.useMemo<NavigationProgressContextValue>(
    () => ({
      start,
      done,
      isLoading: status === "loading",
    }),
    [start, done, status]
  );

  const valueNow = status === "loading" ? 65 : status === "completing" ? 100 : 0;

  return (
    <NavigationProgressContext.Provider value={value}>
      {/* Thanh tiến trình viền trên cùng (Hardware-accelerated) */}
      <div
        role="progressbar"
        aria-label={tNav("progressBarLabel")}
        aria-busy={status === "loading"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={valueNow}
        className={cn(
          "chickie-nav-progress",
          status === "idle" && "chickie-nav-progress--idle",
          status === "loading" && "chickie-nav-progress--loading",
          status === "completing" && "chickie-nav-progress--completing",
          className
        )}
      >
        <span className="chickie-nav-progress-peg" aria-hidden="true" />
      </div>

      {/* Micro indicator góc phải trên cùng (Brand indicator) */}
      {showIndicator && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "chickie-nav-indicator",
            status === "loading"
              ? "chickie-nav-indicator--visible"
              : "chickie-nav-indicator--hidden"
          )}
        >
          <Spinner size="xs" variant="primary" aria-hidden="true" />
          <span>{tNav("navigating")}</span>
        </div>
      )}

      {children}
    </NavigationProgressContext.Provider>
  );
};
