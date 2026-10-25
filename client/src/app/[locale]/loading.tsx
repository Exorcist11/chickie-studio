import * as React from "react";
import { Container, Skeleton, Spinner } from "@/components/ui";

export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Đang tải trang..."
      className="min-h-screen bg-warm-white text-ink flex flex-col justify-start"
      data-testid="page-loading-skeleton"
    >
      {/* Top Banner Skeleton */}
      <section className="bg-gradient-to-b from-ivory/80 via-ivory/30 to-warm-white py-12 md:py-16 border-b border-line">
        <Container className="flex flex-col items-center justify-center text-center max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <Spinner size="md" variant="primary" label="Đang tải dữ liệu..." />
            <span className="text-xs uppercase tracking-widest font-semibold text-burgundy">
              Chickie Studio
            </span>
          </div>

          <Skeleton shape="text" className="h-8 md:h-10 w-3/4 max-w-md mx-auto" />
          <Skeleton shape="text" className="h-4 w-1/2 max-w-sm mx-auto opacity-75" />
        </Container>
      </section>

      {/* Content Grid Skeleton */}
      <main className="py-10 md:py-14">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-warm-white border border-line rounded-card p-4 space-y-4 shadow-card"
              >
                <Skeleton shape="card" className="h-56 w-full rounded-card" />
                <div className="space-y-2">
                  <Skeleton shape="text" className="h-5 w-3/4" />
                  <Skeleton shape="text" className="h-4 w-1/2" />
                </div>
                <div className="pt-2 flex justify-between items-center border-t border-line/60">
                  <Skeleton shape="text" className="h-4 w-1/3" />
                  <Skeleton shape="rectangular" className="h-7 w-20 rounded-btn" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
}
