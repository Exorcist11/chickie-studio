import * as React from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

export interface DataTableColumn<T> {
  key: string;
  title: React.ReactNode;
  dataIndex?: keyof T | string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface DataTableProps<T = any>
  extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataTableColumn<T>[];
  data?: T[];
  loading?: boolean;
  rowKey?: keyof T | ((record: T) => string) | string;
  emptyText?: string;
  caption?: string;
}

export function DataTable<T extends object = Record<string, any>>({
  columns,
  data = [],
  loading = false,
  rowKey = "id",
  emptyText = "Không có dữ liệu",
  caption,
  className,
  ...props
}: DataTableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === "function") return rowKey(record);
    const val = (record as Record<string, any>)[rowKey as string];
    return val !== undefined && val !== null ? String(val) : String(index);
  };

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-card border border-line/60 bg-warm-white shadow-xs",
        className
      )}
      {...props}
    >
      <table className="w-full text-left text-xs md:text-sm border-collapse">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-line/80 bg-sand/40 text-ink-muted uppercase tracking-wider font-semibold text-[11px] md:text-xs">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "py-3.5 px-4 md:px-5 font-semibold",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.className
                )}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/40">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-ink-muted">
                  <Spinner size="md" />
                  <span className="text-xs">Đang tải dữ liệu...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4">
                <EmptyState title={emptyText} className="border-0 shadow-none bg-transparent" />
              </td>
            </tr>
          ) : (
            data.map((record, rowIdx) => {
              const key = getRowKey(record, rowIdx);
              return (
                <tr
                  key={key}
                  className="hover:bg-sand/20 transition-colors group"
                >
                  {columns.map((col, colIdx) => {
                    const rawValue = col.dataIndex ? (record as any)[col.dataIndex] : undefined;
                    const content = col.render ? col.render(rawValue, record, rowIdx) : rawValue;

                    return (
                      <td
                        key={`${key}-${col.key || colIdx}`}
                        className={cn(
                          "py-3.5 px-4 md:px-5 text-ink text-xs md:text-sm",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                          col.className
                        )}
                      >
                        {content}
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
  );
}
