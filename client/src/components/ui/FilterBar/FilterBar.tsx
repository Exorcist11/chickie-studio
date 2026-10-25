"use client";

import * as React from "react";
import { Search, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "../Button";

export interface FilterCategory {
  label: string;
  value: string;
}

export interface FilterSortOption {
  label: string;
  value: string;
}

export interface FilterBarProps {
  search?: string;
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
  categories?: FilterCategory[];
  selectedCategory?: string;
  onCategoryChange?: (cat: string) => void;
  sortOptions?: FilterSortOption[];
  selectedSort?: string;
  onSortChange?: (sort: string) => void;
  onReset?: () => void;
  extraActions?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search = "",
  searchPlaceholder = "Tìm kiếm trang phục, mã đầm...",
  onSearchChange,
  categories = [],
  selectedCategory,
  onCategoryChange,
  sortOptions = [],
  selectedSort,
  onSortChange,
  onReset,
  extraActions,
  className,
}) => {
  const [internalSearch, setInternalSearch] = React.useState(search);

  React.useEffect(() => {
    setInternalSearch(search);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalSearch(val);
    onSearchChange?.(val);
  };

  const handleClearSearch = () => {
    setInternalSearch("");
    onSearchChange?.("");
  };

  const hasActiveFilters = Boolean(
    internalSearch ||
      (selectedCategory && selectedCategory !== "all" && selectedCategory !== "") ||
      (selectedSort && selectedSort !== "")
  );

  return (
    <div
      role="search"
      aria-label="Bộ lọc tìm kiếm và sắp xếp"
      className={cn(
        "flex flex-col gap-3.5 p-4 bg-warm-white rounded-card border border-line shadow-card",
        className
      )}
    >
      {/* Top row: Search input + Sort + Extra */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <label htmlFor="chickie-filter-search" className="sr-only">
            {searchPlaceholder}
          </label>
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="chickie-filter-search"
            type="text"
            value={internalSearch}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full h-10 pl-10 pr-9 bg-ivory/60 border border-line rounded-input text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy transition-colors"
          />
          {internalSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Xóa nội dung tìm kiếm"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-burgundy"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        {sortOptions.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="chickie-filter-sort" className="sr-only">
              Sắp xếp theo
            </label>
            <div className="relative">
              <SlidersHorizontal
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="chickie-filter-sort"
                value={selectedSort || ""}
                onChange={(e) => onSortChange?.(e.target.value)}
                className="h-10 pl-8 pr-8 bg-ivory/60 border border-line rounded-input text-sm text-ink focus:outline-none focus:border-burgundy transition-colors cursor-pointer appearance-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Reset button */}
        {hasActiveFilters && onReset && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="shrink-0"
          >
            Đặt lại
          </Button>
        )}

        {/* Extra actions */}
        {extraActions && <div className="shrink-0">{extraActions}</div>}
      </div>

      {/* Bottom row: Category Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onCategoryChange?.(cat.value)}
                aria-pressed={isSelected}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                  isSelected
                    ? "bg-burgundy text-warm-white border-burgundy shadow-xs"
                    : "bg-ivory/80 text-ink border-line hover:border-burgundy/40"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
