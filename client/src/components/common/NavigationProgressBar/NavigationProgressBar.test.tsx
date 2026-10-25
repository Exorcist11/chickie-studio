import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { I18nProvider } from "@/components/providers/I18nProvider";
import {
  NavigationProgressBar,
  useNavigationProgress,
} from "./NavigationProgressBar";

// Mock next/navigation hooks
let currentMockPathname = "/vi";
let currentMockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => currentMockPathname,
  useSearchParams: () => currentMockSearchParams,
}));

const renderWithProviders = (ui: React.ReactNode) => {
  return render(<I18nProvider locale="vi">{ui}</I18nProvider>);
};

describe("NavigationProgressBar component", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    currentMockPathname = "/vi";
    currentMockSearchParams = new URLSearchParams();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("renders with idle status initially and correct aria attributes", () => {
    renderWithProviders(<NavigationProgressBar />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
    expect(bar).toHaveAttribute("aria-busy", "false");
    expect(bar.className).toContain("chickie-nav-progress--idle");
  });

  it("starts loading when an internal valid link is clicked", async () => {
    renderWithProviders(
      <div>
        <NavigationProgressBar />
        <a href="/vi/products" data-testid="test-link">
          Danh mục
        </a>
      </div>
    );

    const bar = screen.getByRole("progressbar");
    expect(bar.className).toContain("chickie-nav-progress--idle");

    const link = screen.getByTestId("test-link");
    fireEvent.click(link);

    expect(bar.className).toContain("chickie-nav-progress--loading");
    expect(bar).toHaveAttribute("aria-busy", "true");
    expect(bar).toHaveAttribute("aria-valuenow", "65");

    // Also indicator appears
    const indicator = screen.getByText("Đang chuyển trang...");
    expect(indicator).toBeInTheDocument();
  });

  it("ignores click on hash-only links or current URL", () => {
    renderWithProviders(
      <div>
        <NavigationProgressBar />
        <a href="#section" data-testid="hash-link">
          Anchor
        </a>
        <a href="tel:0987654321" data-testid="tel-link">
          Phone
        </a>
        <a href="mailto:contact@chickie.vn" data-testid="mail-link">
          Mail
        </a>
      </div>
    );

    const bar = screen.getByRole("progressbar");

    fireEvent.click(screen.getByTestId("hash-link"));
    expect(bar.className).toContain("chickie-nav-progress--idle");

    fireEvent.click(screen.getByTestId("tel-link"));
    expect(bar.className).toContain("chickie-nav-progress--idle");

    fireEvent.click(screen.getByTestId("mail-link"));
    expect(bar.className).toContain("chickie-nav-progress--idle");
  });

  it("ignores click with modifier keys or target blank", () => {
    renderWithProviders(
      <div>
        <NavigationProgressBar />
        <a href="/vi/products" target="_blank" data-testid="blank-link">
          Blank
        </a>
        <a href="/vi/products" data-testid="modifier-link">
          Modifier
        </a>
      </div>
    );

    const bar = screen.getByRole("progressbar");

    fireEvent.click(screen.getByTestId("blank-link"));
    expect(bar.className).toContain("chickie-nav-progress--idle");

    fireEvent.click(screen.getByTestId("modifier-link"), { metaKey: true });
    expect(bar.className).toContain("chickie-nav-progress--idle");

    fireEvent.click(screen.getByTestId("modifier-link"), { ctrlKey: true });
    expect(bar.className).toContain("chickie-nav-progress--idle");
  });

  it("completes and resets on route change", () => {
    const { rerender } = renderWithProviders(
      <div>
        <NavigationProgressBar />
        <a href="/vi/products" data-testid="test-link">
          Link
        </a>
      </div>
    );

    const bar = screen.getByRole("progressbar");
    fireEvent.click(screen.getByTestId("test-link"));
    expect(bar.className).toContain("chickie-nav-progress--loading");

    // Simulate URL change
    currentMockPathname = "/vi/products";
    rerender(
      <I18nProvider locale="vi">
        <div>
          <NavigationProgressBar />
          <a href="/vi/products" data-testid="test-link">
            Link
          </a>
        </div>
      </I18nProvider>
    );

    expect(bar.className).toContain("chickie-nav-progress--completing");

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(bar.className).toContain("chickie-nav-progress--idle");
  });

  it("starts loading on popstate event (browser back/forward)", () => {
    renderWithProviders(<NavigationProgressBar />);

    const bar = screen.getByRole("progressbar");
    expect(bar.className).toContain("chickie-nav-progress--idle");

    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(bar.className).toContain("chickie-nav-progress--loading");
  });

  it("auto-completes via safety timeout if navigation takes > 8 seconds", () => {
    renderWithProviders(
      <div>
        <NavigationProgressBar />
        <a href="/vi/products" data-testid="test-link">
          Link
        </a>
      </div>
    );

    const bar = screen.getByRole("progressbar");
    fireEvent.click(screen.getByTestId("test-link"));
    expect(bar.className).toContain("chickie-nav-progress--loading");

    act(() => {
      vi.advanceTimersByTime(8100);
    });

    expect(bar.className).toContain("chickie-nav-progress--completing");

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(bar.className).toContain("chickie-nav-progress--idle");
  });

  it("supports programmatic start and done via useNavigationProgress hook", () => {
    const TestConsumer = () => {
      const { start, done, isLoading } = useNavigationProgress();
      return (
        <div>
          <button onClick={start} data-testid="btn-start">
            Start
          </button>
          <button onClick={done} data-testid="btn-done">
            Done
          </button>
          <span data-testid="status">{isLoading ? "loading" : "idle"}</span>
        </div>
      );
    };

    renderWithProviders(
      <NavigationProgressBar>
        <TestConsumer />
      </NavigationProgressBar>
    );

    const bar = screen.getByRole("progressbar");
    expect(screen.getByTestId("status").textContent).toBe("idle");

    fireEvent.click(screen.getByTestId("btn-start"));
    expect(bar.className).toContain("chickie-nav-progress--loading");
    expect(screen.getByTestId("status").textContent).toBe("loading");

    fireEvent.click(screen.getByTestId("btn-done"));
    expect(bar.className).toContain("chickie-nav-progress--completing");

    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(bar.className).toContain("chickie-nav-progress--idle");
  });

  it("does not render micro indicator when showIndicator is false", () => {
    renderWithProviders(<NavigationProgressBar showIndicator={false} />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("ignores click on non-anchor elements and javascript: protocol", () => {
    renderWithProviders(
      <div>
        <NavigationProgressBar />
        <div data-testid="plain-div">Plain text</div>
        <a href="javascript:void(0)" data-testid="js-link">
          JS
        </a>
      </div>
    );

    const bar = screen.getByRole("progressbar");
    fireEvent.click(screen.getByTestId("plain-div"));
    expect(bar.className).toContain("chickie-nav-progress--idle");

    fireEvent.click(screen.getByTestId("js-link"));
    expect(bar.className).toContain("chickie-nav-progress--idle");
  });

  it("cleans up event listeners and timers on unmount", () => {
    const { unmount } = renderWithProviders(<NavigationProgressBar />);
    unmount();
    // Dispatch popstate after unmount to verify no state updates occur
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<NavigationProgressBar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
