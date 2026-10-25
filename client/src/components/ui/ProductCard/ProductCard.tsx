"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { Rating } from "../Rating";
import { ColorSwatch, type ColorItem } from "../ColorSwatch";

export interface ProductCardProps {
  id: string | number;
  name: string;
  slug: string;
  href?: string;
  pillar?: "COSTUME" | "CAMERA" | "PHOTOGRAPHY" | string;
  imageUrl: string;
  imageAlt?: string;
  badge?: string;
  price: number;
  perDayLabel?: string;
  rating?: number;
  reviewCount?: number;
  colors?: ColorItem[];
  isFavorite?: boolean;
  onToggleFavorite?: (favorite: boolean) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id: _id,
  name,
  slug,
  href,
  pillar,
  imageUrl,
  imageAlt,
  badge,
  price,
  perDayLabel = "/ngày",
  rating = 5.0,
  reviewCount,
  colors = [],
  isFavorite = false,
  onToggleFavorite,
  className,
}) => {
  const [favorite, setFavorite] = React.useState(isFavorite);

  const targetHref = React.useMemo(() => {
    if (href) return href;
    const p = (pillar || "").toUpperCase();
    if (p === "CAMERA") return `/thue-may-anh/${slug}`;
    if (p === "PHOTOGRAPHY") return `/dich-vu-chup/${slug}`;
    if (p === "COSTUME") return `/thue-trang-phuc/${slug}`;
    return `/products/${slug}`;
  }, [href, pillar, slug]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !favorite;
    setFavorite(nextState);
    onToggleFavorite?.(nextState);
  };

  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price);

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-warm-white rounded-card overflow-hidden border border-line shadow-card transition-all duration-200 hover:shadow-raised hover:-translate-y-1",
        className
      )}
    >
      {/* Image Container with 3:4 ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory">
        {badge && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-ink/80 text-warm-white backdrop-blur-xs shadow-xs">
            {badge}
          </span>
        )}

        <Link href={targetHref} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={imageAlt || name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-warm-white/90 backdrop-blur-xs flex items-center justify-center text-ink shadow-xs transition-colors hover:bg-warm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              favorite ? "fill-burgundy text-burgundy" : "text-ink/80 hover:text-burgundy"
            )}
          />
        </button>
      </div>

      {/* Content info */}
      <div className="p-3.5 flex flex-col flex-1 gap-2 text-left">
        {/* Colors Swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5" aria-label="Màu sắc sẵn có">
            {colors.slice(0, 4).map((c) => (
              <ColorSwatch
                key={c.hex}
                color={c.hex}
                name={c.name}
                size="sm"
                tabIndex={-1}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-[10px] text-ink-muted font-medium">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Product Title (max 2 lines) */}
        <Link
          href={targetHref}
          className="text-sm font-medium text-ink line-clamp-2 hover:text-burgundy transition-colors min-h-[40px]"
          title={name}
        >
          {name}
        </Link>

        {/* Price and Rating */}
        <div className="mt-auto flex items-baseline justify-between pt-1 border-t border-line/40">
          <div className="flex items-baseline">
            <span className="text-base font-semibold text-burgundy">
              {formattedPrice}đ
            </span>
            <span className="text-xs text-ink-muted ml-0.5">{perDayLabel}</span>
          </div>

          <Rating score={rating} reviewCount={reviewCount} showCount={false} size="sm" />
        </div>
      </div>
    </div>
  );
};
