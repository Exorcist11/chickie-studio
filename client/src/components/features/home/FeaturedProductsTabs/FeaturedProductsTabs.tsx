"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { ProductListItem } from "@/types/product";
import { formatImageUrl } from "@/lib/api/product";

export interface CategoryFilterItem {
  key: string;
  label: string;
  categoryKeyword?: string;
}

const FILTER_TABS: CategoryFilterItem[] = [
  { key: "all", label: "Tất cả" },
  { key: "trang-phuc", label: "Trang phục", categoryKeyword: "trang-phuc" },
  { key: "may-anh", label: "Máy ảnh du lịch", categoryKeyword: "may-anh" },
  { key: "dich-vu-chup", label: "Dịch vụ chụp", categoryKeyword: "dich-vu" },
  { key: "ao-dai", label: "Áo dài", categoryKeyword: "áo dài" },
  { key: "dam-da-hoi", label: "Đầm dạ hội", categoryKeyword: "dạ hội" },
];

export interface FeaturedProductsTabsProps {
  products: ProductListItem[];
  className?: string;
}

export const FeaturedProductsTabs: React.FC<FeaturedProductsTabsProps> = ({
  products = [],
  className,
}) => {
  const [activeTab, setActiveTab] = React.useState<string>("all");

  const filteredProducts = React.useMemo(() => {
    if (activeTab === "all") return products.slice(0, 8);

    if (activeTab === "may-anh") {
      const cameras = products.filter(
        (p) =>
          p.type?.toUpperCase() === "CAMERA" ||
          p.categoryId === 4 ||
          p.categoryName?.toLowerCase().includes("máy ảnh") ||
          p.slug.includes("sony") ||
          p.slug.includes("canon") ||
          p.slug.includes("fujifilm")
      );
      return cameras.length > 0 ? cameras.slice(0, 8) : products.slice(0, 8);
    }

    if (activeTab === "dich-vu-chup") {
      const services = products.filter(
        (p) =>
          p.type?.toUpperCase() === "PHOTOGRAPHY" ||
          p.categoryId === 6 ||
          p.categoryId === 7 ||
          p.categoryName?.toLowerCase().includes("chụp") ||
          p.productCode.startsWith("DV")
      );
      return services.length > 0 ? services.slice(0, 8) : products.slice(0, 8);
    }

    if (activeTab === "trang-phuc") {
      const costumes = products.filter(
        (p) =>
          p.type?.toUpperCase() === "COSTUME" ||
          (!p.type &&
            p.categoryId !== 4 &&
            p.categoryId !== 6 &&
            p.categoryId !== 7 &&
            !p.productCode.startsWith("MA") &&
            !p.productCode.startsWith("DV"))
      );
      return costumes.length > 0 ? costumes.slice(0, 8) : products.slice(0, 8);
    }

    const selected = FILTER_TABS.find((t) => t.key === activeTab);
    if (!selected || !selected.categoryKeyword) return products.slice(0, 8);

    const kw = selected.categoryKeyword.toLowerCase();
    const matched = products.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(kw))
    );

    return matched.length > 0 ? matched.slice(0, 8) : products.slice(0, 8);
  }, [products, activeTab]);

  return (
    <section className={cn("py-12 md:py-16 bg-warm-white border-b border-line", className)}>
      <Container className="space-y-8">
        {/* Section Header with Tabs and View All Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-line/60">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-burgundy uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-burgundy" />
              <span>Thiết Kế Được Yêu Thích</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-ink">
              Sản phẩm nổi bật
            </h2>
          </div>

          {/* Filter Tabs Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            {FILTER_TABS.map((tab) => {
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy",
                    isSelected
                      ? "bg-burgundy text-warm-white shadow-xs font-semibold"
                      : "bg-white text-ink border border-line hover:border-burgundy/40 hover:bg-ivory"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* View All Link (matching mockup) */}
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-1 text-xs font-medium text-ink hover:text-burgundy transition-colors shrink-0"
          >
            Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Generous Product Grid (Spacious & Premium) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-7">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              slug={p.slug}
              imageUrl={formatImageUrl(p.thumbnailUrl)}
              price={p.rentalPrice}
              rating={5.0}
              reviewCount={28}
              colors={[
                { name: "Tiêu chuẩn", hex: "#641D2B" },
                { name: "Trắng", hex: "#FFFFFF" },
              ]}
            />
          ))}
        </div>

        {/* Mobile View All button */}
        <div className="pt-2 text-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-burgundy hover:underline"
          >
            Xem tất cả sản phẩm <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
};
