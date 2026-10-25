import * as React from "react";
import { Eye, Edit3 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Rating } from "../Rating";
import { ColorSwatch, type ColorItem } from "../ColorSwatch";

export type { ColorItem as ProductColor };

export interface ProductCardProps {
  id: string | number;
  name: string;
  code?: string;
  category?: string;
  imageUrl: string;
  imageAlt?: string;
  price: number;
  perDayLabel?: string;
  statusBadge?: React.ReactNode;
  rating?: number;
  reviewCount?: number;
  colors?: ColorItem[];
  onSelect?: () => void;
  onEdit?: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  code,
  category,
  imageUrl,
  imageAlt,
  price,
  perDayLabel = "/ngày",
  statusBadge,
  rating,
  reviewCount,
  colors = [],
  onSelect,
  onEdit,
  className,
}) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price);

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white rounded-card overflow-hidden border border-line shadow-card transition-all duration-200 hover:shadow-raised hover:-translate-y-0.5",
        className
      )}
    >
      {/* Image frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={imageUrl}
          alt={imageAlt || name}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
          {category && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-stone-900/80 text-white backdrop-blur-xs shadow-xs">
              {category}
            </span>
          )}
          {statusBadge && <div className="pointer-events-auto">{statusBadge}</div>}
        </div>

        {/* Hover action buttons */}
        <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onSelect && (
            <button
              type="button"
              onClick={onSelect}
              aria-label={`Xem chi tiết ${name}`}
              className="p-2 rounded-full bg-white/90 text-stone-900 hover:bg-white shadow-xs transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Chỉnh sửa ${name}`}
              className="p-2 rounded-full bg-white/90 text-stone-900 hover:bg-white shadow-xs transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 gap-2 text-left">
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5" aria-label="Màu sắc trang phục">
            {colors.map((c) => (
              <ColorSwatch
                key={c.name}
                name={c.name}
                color={c.hex}
                size="sm"
              />
            ))}
          </div>
        )}

        <div className="flex flex-col">
          {code && <span className="text-[11px] font-mono text-stone-400">{code}</span>}
          <h3 className="text-sm font-medium text-stone-900 line-clamp-1 group-hover:text-[#641D2B] transition-colors">
            {name}
          </h3>
        </div>

        {rating !== undefined && (
          <Rating score={rating} reviewCount={reviewCount} size="sm" />
        )}

        <div className="mt-auto pt-2 border-t border-stone-100 flex items-baseline gap-1">
          <span className="font-serif text-base font-bold text-[#641D2B]">
            {formattedPrice}₫
          </span>
          <span className="text-xs text-stone-400">{perDayLabel}</span>
        </div>
      </div>
    </div>
  );
};
