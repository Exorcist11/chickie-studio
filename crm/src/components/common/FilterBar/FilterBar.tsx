import React, { useState } from "react";
import { Search, RotateCcw, Calendar, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/Button/Button";
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
  showDateRange?: boolean;
  onFilterChange: (filters: FilterValues) => void;
  onReset?: () => void;
  extraActions?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder,
  selectPlaceholder,
  selectOptions,
  showDateRange = true,
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
    <div className={cn("crm-filter-bar", className)}>
      <div className="crm-filter-bar__content">
        {/* Search Input */}
        <div className="crm-filter-bar__search-wrapper">
          <Search className="crm-filter-bar__search-icon" />
          <input
            type="text"
            value={search}
            placeholder={searchPlaceholder || t("common.search")}
            onChange={(e) => {
              setSearch(e.target.value);
              handleApplyFilter(e.target.value, selectValue, startDate, endDate);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApplyFilter(search, selectValue, startDate, endDate);
              }
            }}
            className="crm-filter-bar__search-input"
          />
        </div>

        {/* Select Dropdown */}
        {selectOptions && selectOptions.length > 0 && (
          <div className="crm-filter-bar__select-wrapper">
            <select
              value={selectValue}
              onChange={(e) => {
                const val = e.target.value;
                setSelectValue(val);
                handleApplyFilter(search, val, startDate, endDate);
              }}
              aria-label={selectPlaceholder || t("common.status")}
              className="crm-filter-bar__select"
            >
              <option value="">{selectPlaceholder || t("common.all")}</option>
              {selectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="crm-filter-bar__select-icon" />
          </div>
        )}

        {/* Date Range Inputs */}
        {showDateRange && (
          <div className="crm-filter-bar__date-range">
            <Calendar className="w-3.5 h-3.5 text-ink-muted shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                handleApplyFilter(search, selectValue, e.target.value, endDate);
              }}
              aria-label="Từ ngày"
              className="crm-filter-bar__date-input"
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
              className="crm-filter-bar__date-input"
            />
          </div>
        )}

        {/* Search Action Button */}
        <Button
          type="button"
          variant="primary"
          onClick={() => handleApplyFilter(search, selectValue, startDate, endDate)}
          aria-label={t("common.searchButton", "Tìm kiếm")}
          className="h-10 px-4 text-sm font-medium gap-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">{t("common.searchButton", "Tìm kiếm")}</span>
        </Button>

        {/* Reset Button */}
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          className="h-10 px-3.5 text-sm font-medium gap-1.5 shrink-0 text-ink-muted hover:text-ink"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t("common.reset")}</span>
        </Button>
      </div>

      {extraActions && <div className="crm-filter-bar__extra-actions">{extraActions}</div>}
    </div>
  );
};
