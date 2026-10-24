import * as React from "react";
import { Search, X } from "lucide-react";
import { TextField, type TextFieldProps } from "./TextField";

export interface SearchFieldProps extends Omit<TextFieldProps, "type" | "startIcon"> {
  /** Callback khi bấm nút xóa nội dung tìm kiếm */
  onClear?: () => void;
  /** Nhãn trợ năng cho nút xóa */
  clearLabel?: string;
}

export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      onClear,
      clearLabel = "Xóa nội dung tìm kiếm",
      value,
      endIcon,
      placeholder = "Tìm kiếm...",
      ...props
    },
    ref
  ) => {
    const hasValue = value !== undefined && String(value).length > 0;

    const clearButton = onClear && hasValue ? (
      <button
        type="button"
        onClick={onClear}
        className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm p-1 transition-colors"
        aria-label={clearLabel}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    ) : (
      endIcon
    );

    return (
      <TextField
        ref={ref}
        type="search"
        value={value}
        placeholder={placeholder}
        startIcon={<Search className="h-4 w-4" aria-hidden="true" />}
        endIcon={clearButton}
        {...props}
      />
    );
  }
);

SearchField.displayName = "SearchField";
