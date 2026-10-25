import React from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "../../../lib/cn";

export interface GalleryItem {
  id?: string | number;
  src: string;
  alt?: string;
  caption?: string;
}

export interface GalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  aspectRatio?: "3/4" | "4/3" | "16/9" | "1/1";
  showThumbnails?: boolean;
  enableLightbox?: boolean;
}

export const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
  (
    {
      items = [],
      aspectRatio = "4/3",
      showThumbnails = true,
      enableLightbox = true,
      className,
      ...props
    },
    ref
  ) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

    if (items.length === 0) return null;

    const currentItem = items[activeIndex] || items[0];

    const handlePrev = () => {
      setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };

    const handleNext = () => {
      setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    const aspectClasses = {
      "3/4": "aspect-[3/4]",
      "4/3": "aspect-[4/3]",
      "16/9": "aspect-video",
      "1/1": "aspect-square",
    };

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Thư viện ảnh"
        onKeyDown={handleKeyDown}
        className={cn("flex flex-col gap-3 focus:outline-none", className)}
        {...props}
      >
        {/* Main Display Frame */}
        <div
          className={cn(
            "relative w-full rounded-2xl overflow-hidden bg-stone-100 border border-line/60 shadow-xs group flex items-center justify-center",
            aspectClasses[aspectRatio]
          )}
        >
          <img
            src={currentItem.src}
            alt={currentItem.alt || `Ảnh ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          />

          {/* Badges / Image Counter */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-medium select-none">
            {activeIndex + 1} / {items.length}
          </div>

          {/* Fullscreen Zoom Trigger */}
          {enableLightbox && (
            <button
              type="button"
              aria-label="Phóng to ảnh"
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-ink shadow-xs flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}

          {/* Prev / Next Controls */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Ảnh trước"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-ink shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Ảnh tiếp theo"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-ink shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {showThumbnails && items.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {items.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={`${item.src}-${idx}`}
                  type="button"
                  aria-label={`Xem ảnh ${idx + 1}`}
                  aria-current={isSelected ? "true" : undefined}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all outline-none",
                    isSelected
                      ? "border-burgundy ring-2 ring-burgundy/20 scale-102"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img
                    src={item.src}
                    alt={`${item.alt || `Ảnh ${idx + 1}`} (thu nhỏ)`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Lightbox Modal */}
        {enableLightbox && isLightboxOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh phóng to"
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              type="button"
              aria-label="Đóng phóng to"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-w-4xl max-h-[85vh] w-full h-[80vh] flex items-center justify-center">
              <img
                src={currentItem.src}
                alt={currentItem.alt || "Ảnh phóng to"}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Ảnh trước"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  type="button"
                  aria-label="Ảnh tiếp theo"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);
Gallery.displayName = "Gallery";
