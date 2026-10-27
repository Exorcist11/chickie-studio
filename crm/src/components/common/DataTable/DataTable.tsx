import React from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { cn } from "../../../lib/cn";
import "./DataTable.scss";

export interface ColumnType<T> {
  title: React.ReactNode;
  dataIndex?: keyof T | string;
  key: string;
  width?: number | string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface TablePagination {
  current?: number;
  pageSize?: number;
  total?: number;
  pageSizeOptions?: string[];
  onChange?: (page: number, pageSize: number) => void;
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: ColumnType<T>[];
  dataSource?: T[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  pagination?: TablePagination | false;
  onPaginationChange?: (page: number, pageSize: number) => void;
  selectedRowKeys?: React.Key[];
  onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  emptyText?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  dataSource = [],
  loading = false,
  rowKey = "id",
  pagination,
  onPaginationChange,
  selectedRowKeys,
  onSelectionChange,
  emptyText = "Không có dữ liệu",
  className,
}: DataTableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === "function") return rowKey(record);
    return (record[rowKey] as string) || String(index);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      const allKeys = dataSource.map(getRowKey);
      onSelectionChange(allKeys, dataSource);
    } else {
      onSelectionChange([], []);
    }
  };

  const handleSelectRow = (key: string, record: T) => {
    if (!onSelectionChange) return;
    const currentKeys = selectedRowKeys || [];
    const isSelected = currentKeys.includes(key);
    const newKeys = isSelected
      ? currentKeys.filter((k) => k !== key)
      : [...currentKeys, key];
    const newRows = dataSource.filter((item, idx) =>
      newKeys.includes(getRowKey(item, idx))
    );
    onSelectionChange(newKeys, newRows);
  };

  const isAllSelected =
    dataSource.length > 0 &&
    selectedRowKeys &&
    dataSource.every((item, idx) => selectedRowKeys.includes(getRowKey(item, idx)));

  const page = (pagination && pagination.current) || 1;
  const pageSize = (pagination && pagination.pageSize) || 10;
  const total = (pagination && pagination.total) || dataSource.length;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (typeof pagination === "object" && pagination !== null) {
      pagination.onChange?.(newPage, pageSize);
    }
    onPaginationChange?.(newPage, pageSize);
  };

  return (
    <div
      className={cn(
        "w-full bg-white rounded-card border border-line shadow-card overflow-hidden flex flex-col",
        className
      )}
    >
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-ivory/60 border-b border-line text-ink font-medium">
              {onSelectionChange && (
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Chọn tất cả các dòng"
                    className="rounded border-line text-burgundy focus:ring-burgundy w-4 h-4 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={
                    col.width
                      ? ({
                          "--col-width":
                            typeof col.width === "number"
                              ? `${col.width}px`
                              : col.width,
                        } as React.CSSProperties)
                      : undefined
                  }
                  className={cn(
                    "p-3.5 font-medium text-ink text-xs uppercase tracking-wider whitespace-nowrap",
                    col.width && "w-[var(--col-width)] min-w-[var(--col-width)]"
                  )}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-line/60">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                  className="p-12 text-center text-ink-muted"
                >
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-burgundy border-t-transparent" />
                  <p className="mt-2 text-xs">Đang tải dữ liệu...</p>
                </td>
              </tr>
            ) : dataSource.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                  className="p-12 text-center text-ink-muted"
                >
                  <Inbox className="w-10 h-10 mx-auto text-stone-300 stroke-[1.5]" />
                  <p className="mt-2 text-sm">{emptyText}</p>
                </td>
              </tr>
            ) : (
              dataSource.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRowKeys?.includes(key);

                return (
                  <tr
                    key={key}
                    className={cn(
                      "hover:bg-warm-white/70 transition-colors",
                      isSelected && "bg-rose/10"
                    )}
                  >
                    {onSelectionChange && (
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(key, record)}
                          aria-label={`Chọn dòng ${key}`}
                          className="rounded border-line text-burgundy focus:ring-burgundy w-4 h-4 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const val = col.dataIndex ? (record as any)[col.dataIndex] : undefined;
                      return (
                        <td
                          key={col.key}
                          style={
                            col.width
                              ? ({
                                  "--col-width":
                                    typeof col.width === "number"
                                      ? `${col.width}px`
                                      : col.width,
                                } as React.CSSProperties)
                              : undefined
                          }
                          className={cn(
                            "p-3.5 text-ink",
                            col.width && "w-[var(--col-width)] min-w-[var(--col-width)]"
                          )}
                        >
                          {col.render ? col.render(val, record, index) : (val as React.ReactNode)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination !== false && (
        <div className="p-3.5 border-t border-line/60 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted bg-white">
          <div>
            Hiển thị <span className="font-medium text-ink">{dataSource.length}</span> trên{" "}
            <span className="font-medium text-ink">{total}</span> kết quả
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              aria-label="Trang trước"
              className="p-1.5 rounded-btn border border-line hover:bg-ivory disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-ink">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              aria-label="Trang sau"
              className="p-1.5 rounded-btn border border-line hover:bg-ivory disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

