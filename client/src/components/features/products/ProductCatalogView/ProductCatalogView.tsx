"use client";

import * as React from "react";
import {
  ArrowDownUp,
  Filter,
  RotateCcw,
  Search,
  Shirt,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ProductListItem } from "@/types/product";
import { Category } from "@/types/category";
import { formatImageUrl } from "@/lib/api/product";

export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export interface ColorOption {
  name: string;
  hex: string;
}

const AVAILABLE_COLORS: ColorOption[] = [
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Đỏ Burgundy", hex: "#641D2B" },
  { name: "Hồng Nude", hex: "#DCC8BD" },
  { name: "Đen Dạ Tiệc", hex: "#212121" },
  { name: "Be Sáng", hex: "#EED9C4" },
  { name: "Vàng Gold", hex: "#D4AF37" },
];

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL"];

export interface ProductCatalogViewProps {
  products: ProductListItem[];
  categories: Category[];
  initialCategorySlug?: string;
  initialSearch?: string;
  className?: string;
}

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  products = [],
  categories = [],
  initialCategorySlug = "",
  initialSearch = "",
  className,
}) => {
  // Filter states
  const [selectedCategorySlug, setSelectedCategorySlug] =
    React.useState<string>(initialCategorySlug);
  const [searchKeyword, setSearchKeyword] = React.useState<string>(initialSearch);
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [selectedColor, setSelectedColor] = React.useState<string>("");
  const [priceRange, setPriceRange] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("default");

  // Mobile drawer filter toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState<boolean>(false);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategorySlug("");
    setSearchKeyword("");
    setSelectedSize("");
    setSelectedColor("");
    setPriceRange("all");
    setSortBy("default");
  };

  const hasActiveFilters =
    Boolean(selectedCategorySlug) ||
    Boolean(searchKeyword) ||
    Boolean(selectedSize) ||
    Boolean(selectedColor) ||
    priceRange !== "all" ||
    sortBy !== "default";

  // Filter & Sort logic
  const filteredAndSortedProducts = React.useMemo(() => {
    let result = [...products];

    // 1. Filter by Category
    if (selectedCategorySlug) {
      const cat = categories.find((c) => c.slug === selectedCategorySlug);
      if (cat) {
        result = result.filter(
          (p) =>
            p.categoryId === cat.id ||
            p.categoryName?.toLowerCase() === cat.name.toLowerCase()
        );
      }
    }

    // 2. Filter by Search Keyword
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.productCode?.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    // 3. Filter by Price Range
    if (priceRange === "under-200") {
      result = result.filter((p) => p.rentalPrice < 200000);
    } else if (priceRange === "200-300") {
      result = result.filter(
        (p) => p.rentalPrice >= 200000 && p.rentalPrice <= 300000
      );
    } else if (priceRange === "above-300") {
      result = result.filter((p) => p.rentalPrice > 300000);
    }

    // 4. Sort Products
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.rentalPrice - b.rentalPrice);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.rentalPrice - a.rentalPrice);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name, "vi"));
    }

    return result;
  }, [
    products,
    categories,
    selectedCategorySlug,
    searchKeyword,
    priceRange,
    sortBy,
  ]);

  // Sidebar Filter Content (Shared between Desktop & Mobile)
  const FilterContent = (
    <div className="space-y-6 text-left">
      {/* Categories Filter */}
      <div className="space-y-3 pb-5 border-b border-line">
        <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">
          Danh mục
        </h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2.5 text-xs text-ink cursor-pointer hover:text-burgundy transition-colors">
            <input
              type="radio"
              name="catalog-category"
              checked={!selectedCategorySlug}
              onChange={() => setSelectedCategorySlug("")}
              className="accent-burgundy w-3.5 h-3.5 cursor-pointer"
            />
            <span className={!selectedCategorySlug ? "font-semibold text-burgundy" : ""}>
              Tất cả danh mục ({products.length})
            </span>
          </label>

          {categories.map((cat) => {
            const isChecked = selectedCategorySlug === cat.slug;
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2.5 text-xs text-ink cursor-pointer hover:text-burgundy transition-colors"
              >
                <input
                  type="radio"
                  name="catalog-category"
                  checked={isChecked}
                  onChange={() => setSelectedCategorySlug(cat.slug)}
                  className="accent-burgundy w-3.5 h-3.5 cursor-pointer"
                />
                <span className={isChecked ? "font-semibold text-burgundy" : ""}>
                  {cat.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3 pb-5 border-b border-line">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">
            Kích cỡ (Size)
          </h3>
          {selectedSize && (
            <button
              type="button"
              onClick={() => setSelectedSize("")}
              className="text-[11px] text-ink-muted hover:text-burgundy underline"
            >
              Bỏ chọn
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(isSelected ? "" : size)}
                className={cn(
                  "w-9 h-9 rounded-btn text-xs font-medium transition-all select-none border",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy",
                  isSelected
                    ? "bg-burgundy text-warm-white border-burgundy shadow-xs font-semibold"
                    : "bg-white text-ink border-line hover:border-burgundy/50 hover:bg-ivory"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3 pb-5 border-b border-line">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">
            Màu sắc
          </h3>
          {selectedColor && (
            <button
              type="button"
              onClick={() => setSelectedColor("")}
              className="text-[11px] text-ink-muted hover:text-burgundy underline"
            >
              Bỏ chọn
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_COLORS.map((c) => {
            const isSelected = selectedColor === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(isSelected ? "" : c.name)}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs text-left transition-all",
                  isSelected
                    ? "border-burgundy bg-burgundy/10 text-burgundy font-medium"
                    : "border-line bg-white text-ink hover:border-burgundy/40"
                )}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-line shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="truncate">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 pb-5 border-b border-line">
        <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">
          Mức giá thuê / ngày
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { value: "all", label: "Tất cả mức giá" },
            { value: "under-200", label: "Dưới 200.000đ" },
            { value: "200-300", label: "200.000đ - 300.000đ" },
            { value: "above-300", label: "Trên 300.000đ" },
          ].map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2.5 text-xs text-ink cursor-pointer hover:text-burgundy transition-colors"
            >
              <input
                type="radio"
                name="catalog-price-range"
                value={item.value}
                checked={priceRange === item.value}
                onChange={(e) => setPriceRange(e.target.value)}
                className="accent-burgundy w-3.5 h-3.5 cursor-pointer"
              />
              <span className={priceRange === item.value ? "font-semibold text-burgundy" : ""}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Filters button */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleClearFilters}
          className="w-full justify-center text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Xóa tất cả bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Category Pills Navigation (Matching E2E Test & Mobile Flow) */}
      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-sm border-b border-line pb-4"
        role="navigation"
        aria-label="Lọc theo danh mục"
      >
        <button
          type="button"
          onClick={() => setSelectedCategorySlug("")}
          className={cn(
            "px-4 py-2 rounded-full whitespace-nowrap text-xs font-medium transition-all cursor-pointer select-none",
            !selectedCategorySlug
              ? "bg-burgundy text-warm-white shadow-xs font-semibold"
              : "bg-white text-ink border border-line hover:border-burgundy/40 hover:bg-ivory"
          )}
        >
          Tất cả ({products.length})
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategorySlug === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={cn(
                "px-4 py-2 rounded-full whitespace-nowrap text-xs font-medium transition-all cursor-pointer select-none",
                isActive
                  ? "bg-burgundy text-warm-white shadow-xs font-semibold"
                  : "bg-white text-ink border border-line hover:border-burgundy/40 hover:bg-ivory"
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Top Toolbar: Search + Count + Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-line shadow-xs">
        {/* Left: Search input & Mobile filter toggle */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Mở bộ lọc"
            className="lg:hidden flex items-center justify-center gap-1.5 px-3 py-2 rounded-btn bg-ivory text-ink text-xs font-medium border border-line shrink-0"
          >
            <Filter className="w-3.5 h-3.5 text-burgundy" />
            <span>Bộ lọc</span>
          </button>

          {/* Search Box */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên váy, mã sản phẩm..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-btn bg-warm-white border border-line text-ink focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Count & Sort Price Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs text-ink-muted whitespace-nowrap">
            Hiển thị <strong className="text-ink font-semibold">{filteredAndSortedProducts.length}</strong> sản phẩm
          </span>

          {/* Sort Dropdown Component */}
          <div className="w-48 sm:w-56">
            <label htmlFor="product-sort-select" className="sr-only">
              Sắp xếp sản phẩm
            </label>
            <Select
              id="product-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              options={[
                { label: "Mới nhất", value: "default" },
                { label: "Giá: Thấp đến cao", value: "price-asc" },
                { label: "Giá: Cao đến thấp", value: "price-desc" },
                { label: "Tên: A - Z", value: "name-asc" },
                { label: "Tên: Z - A", value: "name-desc" },
              ]}
              className="py-1.5 text-xs min-h-[38px] bg-warm-white"
            />
          </div>
        </div>
      </div>

      {/* Main Catalog Layout (2 Columns: Sidebar + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Left Sidebar (3/12 cols) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 rounded-2xl bg-white border border-line p-5 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <SlidersHorizontal className="w-4 h-4 text-burgundy" />
              <span>Bộ lọc tìm kiếm</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-burgundy hover:underline font-medium"
              >
                Đặt lại
              </button>
            )}
          </div>

          {FilterContent}
        </aside>

        {/* Right Products Grid (9/12 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {filteredAndSortedProducts.length === 0 ? (
            <EmptyState
              icon={<Shirt className="w-7 h-7 stroke-[1.5]" />}
              title="Chưa tìm thấy sản phẩm phù hợp"
              description="Không có mẫu trang phục nào khớp với bộ lọc hoặc từ khóa hiện tại. Vui lòng thử lại với các tiêu chí khác."
              action={
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Xóa tất cả bộ lọc
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  imageUrl={formatImageUrl(p.thumbnailUrl)}
                  price={p.rentalPrice}
                  rating={5.0}
                  reviewCount={24}
                  colors={[
                    { name: "Màu chuẩn", hex: "#641D2B" },
                    { name: "Trắng", hex: "#FFFFFF" },
                  ]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      {isMobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filter-title"
          className="fixed inset-0 z-50 flex justify-end bg-ink/50 backdrop-blur-xs lg:hidden animate-in fade-in"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="w-full max-w-xs h-full bg-warm-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h2 id="mobile-filter-title" className="text-base font-semibold text-ink">
                  Bộ lọc sản phẩm
                </h2>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-label="Đóng bộ lọc"
                  className="p-1 rounded-full text-ink-muted hover:text-ink hover:bg-ivory"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {FilterContent}
            </div>

            <div className="pt-4 border-t border-line mt-6">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full justify-center"
              >
                Áp dụng bộ lọc ({filteredAndSortedProducts.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
