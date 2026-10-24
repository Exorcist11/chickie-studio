import React, { useState } from "react";
import { Search, RotateCcw, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../lib/cn";
import "./FilterBar.scss";

export interface FilterSelectOption {
  label: string;
  value: string | number;
}

export interface FilterValues {
  search?: string;
  selectValue?: string | number;
  startDate?: string;
  endDate?: string;
}

export interface FilterBarProps {
  searchPlaceholder?: string;
  selectPlaceholder?: string;
  selectOptions?: FilterSelectOption[];
  onFilterChange: (filters: FilterValues) => void;
  onReset?: () => void;
  extraActions?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder,
  selectPlaceholder,
  selectOptions,
  onFilterChange,
  onReset,
  extraActions,
  className,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectValue, setSelectValue] = useState<string | number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApplyFilter = (
    newSearch = search,
    newSelect = selectValue,
    newStart = startDate,
    newEnd = endDate
  ) => {
    onFilterChange({
      search: newSearch || undefined,
      selectValue: newSelect !== "" ? newSelect : undefined,
      startDate: newStart || undefined,
      endDate: newEnd || undefined,
    });
  };

  const handleReset = () => {
    setSearch("");
    setSelectValue("");
    setStartDate("");
    setEndDate("");
    onReset?.();
    onFilterChange({});
  };

  return (
    <div
      className={cn(
        "bg-white p-4 rounded-card border border-line mb-4 flex flex-wrap items-center justify-between gap-3 shadow-card",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            placeholder={searchPlaceholder || t("common.search")}
            onChange={(e) => {
              setSearch(e.target.value);
              handleApplyFilter(e.target.value, selectValue, startDate, endDate);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-warm-white border border-line rounded-btn text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-burgundy transition-all"
          />
        </div>

        {/* Select Dropdown */}
        {selectOptions && selectOptions.length > 0 && (
          <select
            value={selectValue}
            onChange={(e) => {
              const val = e.target.value;
              setSelectValue(val);
              handleApplyFilter(search, val, startDate, endDate);
            }}
            aria-label={selectPlaceholder || t("common.status")}
            className="px-3 py-2 text-xs md:text-sm bg-warm-white border border-line rounded-btn text-ink focus:outline-none focus:ring-2 focus:ring-burgundy transition-all cursor-pointer"
          >
            <option value="">{selectPlaceholder || t("common.all")}</option>
            {selectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Date Range Inputs */}
        <div className="flex items-center gap-1.5 bg-warm-white border border-line rounded-btn px-2.5 py-1 text-xs text-ink-muted">
          <Calendar className="w-3.5 h-3.5 text-ink-muted shrink-0" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              handleApplyFilter(search, selectValue, e.target.value, endDate);
            }}
            aria-label="Từ ngày"
            className="bg-transparent border-0 text-ink focus:outline-none text-xs"
          />
          <span>-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              handleApplyFilter(search, selectValue, startDate, e.target.value);
            }}
            aria-label="Đến ngày"
            className="bg-transparent border-0 text-ink focus:outline-none text-xs"
          />
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-ink-muted hover:text-ink bg-warm-white hover:bg-ivory border border-line rounded-btn transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t("common.reset")}
        </button>
      </div>

      {extraActions && <div className="flex items-center gap-2">{extraActions}</div>}
    </div>
  );
};

