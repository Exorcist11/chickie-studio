import * as React from "react";
import { Container, Section, Skeleton, Spinner } from "@/components/ui";

export default function ProductsLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Đang tải danh sách sản phẩm..."
      className="min-h-screen bg-warm-white text-ink flex flex-col justify-between"
      data-testid="products-loading-skeleton"
    >
      <div>
        {/* Banner Skeleton */}
        <section className="relative overflow-hidden bg-gradient-to-b from-ivory/80 via-ivory/40 to-warm-white py-10 md:py-14 border-b border-line">
          <Container className="text-center max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold">
              <Spinner size="xs" variant="primary" label="Đang tải..." />
              <span>Chickie Studio Catalog</span>
            </div>

            <Skeleton shape="text" className="h-9 md:h-12 w-3/4 max-w-md mx-auto" />
            <Skeleton shape="text" className="h-4 w-2/3 max-w-lg mx-auto opacity-75" />
          </Container>
        </section>

        {/* Catalog Skeleton */}
        <Section className="py-8 md:py-12">
          <Container>
            {/* Filter Bar Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line mb-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Skeleton shape="rectangular" className="h-9 w-24 rounded-full" />
                <Skeleton shape="rectangular" className="h-9 w-28 rounded-full" />
                <Skeleton shape="rectangular" className="h-9 w-28 rounded-full" />
                <Skeleton shape="rectangular" className="h-9 w-24 rounded-full" />
              </div>

              <div className="flex items-center gap-3">
                <Skeleton shape="rectangular" className="h-9 w-48 rounded-btn" />
                <Skeleton shape="rectangular" className="h-9 w-36 rounded-btn" />
              </div>
            </div>

            {/* Product Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-warm-white rounded-card overflow-hidden border border-line shadow-card p-0 flex flex-col"
                >
                  <Skeleton shape="card" className="h-72 w-full rounded-none" />
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Skeleton shape="text" className="h-3 w-1/3" />
                      <Skeleton shape="text" className="h-5 w-5/6" />
                    </div>
                    <div className="pt-2 flex justify-between items-center border-t border-line/60">
                      <Skeleton shape="text" className="h-5 w-1/2" />
                      <Skeleton shape="circular" className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </div>
    </div>
  );
}
