"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, Maximize2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { ProductImage } from "@/types/product";
import { formatImageUrl } from "@/lib/api/product";

export interface LookbookGalleryProps {
  images?: ProductImage[];
  productName: string;
  className?: string;
}

export const LookbookGallery: React.FC<LookbookGalleryProps> = ({
  images = [],
  productName,
  className,
}) => {
  const displayImages =
    images.length > 0
      ? images
      : [
          {
            id: 0,
            imageUrl:
              "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
            isThumbnail: true,
            displayOrder: 1,
          },
        ];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeImage = displayImages[activeIndex] || displayImages[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Main Image Frame - 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-ivory border border-line shadow-card group">
        <Image
          src={formatImageUrl(activeImage.imageUrl)}
          alt={`${productName} - Ảnh ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Studio Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-white/90 backdrop-blur-sm border border-line/60 shadow-xs text-xs font-medium text-burgundy">
          <Sparkles className="w-3.5 h-3.5 text-burgundy" />
          <span>Lookbook Chickie Studio</span>
        </div>

        {/* Counter Badge */}
        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-ink/70 backdrop-blur-sm text-[11px] font-mono text-warm-white">
          {activeIndex + 1} / {displayImages.length}
        </div>

        {/* Prev / Next Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Ảnh trước"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-warm-white/90 text-ink shadow-md flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-warm-white hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
            >
              <ChevronLeft className="w-5 h-5 text-ink" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Ảnh kế tiếp"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-warm-white/90 text-ink shadow-md flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-warm-white hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
            >
              <ChevronRight className="w-5 h-5 text-ink" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div
          className="grid grid-cols-4 sm:grid-cols-5 gap-3"
          role="tablist"
          aria-label="Danh sách ảnh chi tiết"
        >
          {displayImages.map((img, index) => {
            const isSelected = index === activeIndex;
            return (
              <button
                key={img.id || index}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Xem ảnh ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-200 bg-ivory",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy",
                  isSelected
                    ? "border-burgundy shadow-sm ring-1 ring-burgundy/40"
                    : "border-transparent opacity-70 hover:opacity-100 hover:border-burgundy/50"
                )}
              >
                <Image
                  src={formatImageUrl(img.imageUrl)}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover object-top"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
