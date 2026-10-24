"use client";

import * as React from "react";
import {
  Camera,
  Filter,
  RotateCcw,
  Search,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  X,
  CheckCircle2,
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
  className: string;
}

const AVAILABLE_COLORS: ColorOption[] = [
  { name: "Trắng", className: "bg-white" },
  { name: "Đỏ Burgundy", className: "bg-[#641D2B]" },
  { name: "Hồng Nude", className: "bg-[#DCC8BD]" },
  { name: "Đen Dạ Tiệc", className: "bg-[#212121]" },
  { name: "Be Sáng", className: "bg-[#EED9C4]" },
  { name: "Vàng Gold", className: "bg-[#D4AF37]" },
];

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL"];

export interface ProductCatalogViewProps {
  products: ProductListItem[];
  categories: Category[];
  initialCategorySlug?: string;
  initialType?: string;
  initialSearch?: string;
  className?: string;
}

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  products = [],
  categories = [],
  initialCategorySlug = "",
  initialType = "",
  initialSearch = "",
  className,
}) => {
  // Resolve initial business type (Pillar)
  const resolvedInitialType = React.useMemo(() => {
    if (initialType) {
      return initialType.toLowerCase();
    }
    if (initialCategorySlug === "may-anh-du-lich") {
      return "camera";
    }
    if (
      initialCategorySlug === "chup-anh-ngoai-canh" ||
      initialCategorySlug === "chup-anh-studio"
    ) {
      return "photography";
    }
    return "";
  }, [initialType, initialCategorySlug]);

  // Filter states
  const [selectedType, setSelectedType] = React.useState<string>(resolvedInitialType);
  const [selectedCategorySlug, setSelectedCategorySlug] =
    React.useState<string>(initialCategorySlug);
  const [searchKeyword, setSearchKeyword] = React.useState<string>(initialSearch);
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [selectedColor, setSelectedColor] = React.useState<string>("");
  const [priceRange, setPriceRange] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("default");

  // Mobile drawer filter toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState<boolean>(false);

  // Sync state if props change (e.g. Header navigation)
  React.useEffect(() => {
    setSelectedType(resolvedInitialType || "");
  }, [resolvedInitialType]);

  React.useEffect(() => {
    setSelectedCategorySlug(initialCategorySlug || "");
  }, [initialCategorySlug]);

  React.useEffect(() => {
    setSearchKeyword(initialSearch || "");
  }, [initialSearch]);

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

  // Categories belonging to currently selected pillar
  const visibleCategories = React.useMemo(() => {
    if (!selectedType) {
      return categories;
    }
    if (selectedType === "camera") {
      return categories.filter(
        (c) => c.type?.toUpperCase() === "CAMERA" || c.slug === "may-anh-du-lich"
      );
    }
    if (selectedType === "photography") {
      return categories.filter(
        (c) =>
          c.type?.toUpperCase() === "PHOTOGRAPHY" ||
          c.slug === "chup-anh-ngoai-canh" ||
          c.slug === "chup-anh-studio"
      );
    }
    if (selectedType === "costume") {
      return categories.filter(
        (c) =>
          c.type?.toUpperCase() === "COSTUME" ||
          (!c.type &&
            c.slug !== "may-anh-du-lich" &&
            c.slug !== "chup-anh-ngoai-canh" &&
            c.slug !== "chup-anh-studio")
      );
    }
    return categories;
  }, [categories, selectedType]);

  // Filter & Sort logic
  const filteredAndSortedProducts = React.useMemo(() => {
    let result = [...products];

    // 0. Filter by Business Pillar (type)
    if (selectedType) {
      if (selectedType === "camera") {
        result = result.filter(
          (p) =>
            p.type?.toUpperCase() === "CAMERA" ||
            p.categoryId === 4 ||
            p.categoryName?.toLowerCase().includes("máy ảnh") ||
            p.slug.includes("sony") ||
            p.slug.includes("canon") ||
            p.slug.includes("fujifilm")
        );
      } else if (selectedType === "photography") {
        result = result.filter(
          (p) =>
            p.type?.toUpperCase() === "PHOTOGRAPHY" ||
            p.categoryId === 6 ||
            p.categoryId === 7 ||
            p.categoryName?.toLowerCase().includes("chụp") ||
            p.productCode.startsWith("DV")
        );
      } else if (selectedType === "costume") {
        result = result.filter(
          (p) =>
            p.type?.toUpperCase() === "COSTUME" ||
            (!p.type &&
              p.categoryId !== 4 &&
              p.categoryId !== 6 &&
              p.categoryId !== 7 &&
              !p.productCode.startsWith("MA") &&
              !p.productCode.startsWith("DV")) ||
            p.categoryName?.toLowerCase().includes("váy") ||
            p.categoryName?.toLowerCase().includes("áo dài") ||
            p.categoryName?.toLowerCase().includes("đầm")
        );
      }
    }

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
    selectedType,
    selectedCategorySlug,
    searchKeyword,
    priceRange,
    sortBy,
  ]);

  // Helper badge & label resolver
  const getProductPillarInfo = (product: ProductListItem) => {
    if (
      product.type?.toUpperCase() === "CAMERA" ||
      product.categoryId === 4 ||
      product.productCode.startsWith("MA") ||
      product.categoryName?.toLowerCase().includes("máy ảnh")
    ) {
      return {
        badge: "Máy ảnh & Thiết bị",
        perDayLabel: "/ngày",
      };
    }
    if (
      product.type?.toUpperCase() === "PHOTOGRAPHY" ||
      product.categoryId === 6 ||
      product.categoryId === 7 ||
      product.productCode.startsWith("DV") ||
      product.categoryName?.toLowerCase().includes("chụp")
    ) {
      return {
        badge: "Gói dịch vụ chụp",
        perDayLabel: "/gói",
      };
    }
    return {
      badge: "Trang phục thiết kế",
      perDayLabel: "/ngày",
    };
  };

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
              Tất cả danh mục ({visibleCategories.length})
            </span>
          </label>

          {visibleCategories.map((cat) => {
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

      {/* Conditional: Size Filter for Costumes */}
      {selectedType !== "camera" && selectedType !== "photography" && (
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
      )}

      {/* Conditional: Color Filter for Costumes */}
      {selectedType !== "camera" && selectedType !== "photography" && (
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
                    className={cn(
                      "w-3.5 h-3.5 rounded-full border border-line shrink-0",
                      c.className
                    )}
                  />
                  <span className="truncate">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Special Highlights for Camera Rental */}
      {selectedType === "camera" && (
        <div className="p-3.5 rounded-xl bg-ivory/60 border border-line/80 space-y-2.5 text-xs text-ink-muted">
          <div className="flex items-center gap-2 font-semibold text-ink">
            <Camera className="w-4 h-4 text-burgundy" />
            <span>Tiện ích thuê máy ảnh</span>
          </div>
          <ul className="space-y-1.5 text-[11px] leading-relaxed">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-burgundy shrink-0 mt-0.5" />
              <span>Tặng kèm thẻ nhớ 64GB + 2 Pin + Túi chống sốc.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-burgundy shrink-0 mt-0.5" />
              <span>Hỗ trợ cài đặt thông số chụp và giả lập màu film.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-burgundy shrink-0 mt-0.5" />
              <span>Thủ tục cọc linh hoạt, kiểm tra máy tại quầy.</span>
            </li>
          </ul>
        </div>
      )}

      {/* Special Highlights for Photography Packages */}
      {selectedType === "photography" && (
        <div className="p-3.5 rounded-xl bg-ivory/60 border border-line/80 space-y-2.5 text-xs text-ink-muted">
          <div className="flex items-center gap-2 font-semibold text-ink">
            <Sparkles className="w-4 h-4 text-burgundy" />
            <span>Ưu đãi gói chụp</span>
          </div>
          <ul className="space-y-1.5 text-[11px] leading-relaxed">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-burgundy shrink-0 mt-0.5" />
              <span>Photographer chuyên nghiệp hướng dẫn tạo dáng.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-burgundy shrink-0 mt-0.5" />
              <span>Bàn giao toàn bộ 100% file ảnh gốc ngay sau buổi chụp.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-burgundy shrink-0 mt-0.5" />
              <span>Retouch da và tone màu nghệ thuật chuyên sâu.</span>
            </li>
          </ul>
        </div>
      )}

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
            Hiển thị <strong className="text-ink font-semibold">{filteredAndSortedProducts.length}</strong> sản phẩm & dịch vụ
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

      {/* 4. Main Catalog Layout (2 Columns: Sidebar + Products Grid) */}
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
              icon={
                selectedType === "camera" ? (
                  <Camera className="w-7 h-7 stroke-[1.5]" />
                ) : selectedType === "photography" ? (
                  <Sparkles className="w-7 h-7 stroke-[1.5]" />
                ) : (
                  <Shirt className="w-7 h-7 stroke-[1.5]" />
                )
              }
              title={
                selectedType === "camera"
                  ? "Chưa tìm thấy máy ảnh phù hợp"
                  : selectedType === "photography"
                  ? "Chưa tìm thấy gói chụp ảnh phù hợp"
                  : "Chưa tìm thấy sản phẩm phù hợp"
              }
              description={
                selectedType === "camera"
                  ? "Không có máy ảnh nào khớp với bộ lọc hoặc từ khóa hiện tại. Vui lòng thử lại với các tiêu chí khác."
                  : selectedType === "photography"
                  ? "Không có gói dịch vụ chụp ảnh nào khớp với bộ lọc hiện tại. Vui lòng thử lại."
                  : "Không có mẫu trang phục nào khớp với bộ lọc hoặc từ khóa hiện tại."
              }
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
              {filteredAndSortedProducts.map((p) => {
                const pillarInfo = getProductPillarInfo(p);
                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    badge={pillarInfo.badge}
                    perDayLabel={pillarInfo.perDayLabel}
                    imageUrl={formatImageUrl(p.thumbnailUrl)}
                    price={p.rentalPrice}
                    rating={5.0}
                    reviewCount={24}
                    colors={[
                      { name: "Màu chuẩn", hex: "#641D2B" },
                      { name: "Trắng", hex: "#FFFFFF" },
                    ]}
                  />
                );
              })}
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
