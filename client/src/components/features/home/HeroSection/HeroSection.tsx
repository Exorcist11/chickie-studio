"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button, Container } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface HeroSlide {
  id: number;
  imageUrl: string;
  alt: string;
  caption?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop",
    alt: "Người mẫu mặc váy cưới thiết kế cầm hoa thanh lịch Chickie Studio",
    caption: "Váy cưới thiết kế & Maxi chụp ngoại cảnh",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop",
    alt: "Áo dài cách tân hoa sen kỷ yếu thướt tha",
    caption: "Áo dài kỷ yếu & sự kiện truyền thống",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&auto=format&fit=crop",
    alt: "Đầm dạ hội satin sang trọng tiệc tối",
    caption: "Đầm dạ hội cao cấp sang trọng",
  },
];

export interface HeroSectionProps {
  slides?: HeroSlide[];
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  slides = DEFAULT_SLIDES,
  className,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // Format slide number to 2 digits (e.g. "01", "02")
  const formatIndex = (index: number) => String(index + 1).padStart(2, "0");

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-ivory/70 via-ivory/30 to-warm-white py-12 md:py-20 border-b border-line",
        className
      )}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Brand Typography & Call to Action */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-burgundy" />
              <span>Chickie Studio • More than just a dress</span>
            </div>

            {/* Main Headline (Lora Serif Artistic) */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal text-ink leading-[1.08] tracking-tight">
              <span className="block font-normal">More than</span>
              <span className="italic text-burgundy font-light">just a dress</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-ink-muted max-w-xl leading-relaxed">
              Cho thuê trang phục, máy ảnh và dịch vụ chụp ảnh chuyên nghiệp, giúp bạn lưu giữ những khoảnh khắc đẹp nhất theo cách riêng.
            </p>

            {/* Action Button: Single Elegant CTA */}
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-burgundy hover:bg-burgundy/90 text-warm-white text-sm sm:text-base font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Khám phá bộ sưu tập <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mini Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-ink-muted border-t border-line/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-burgundy inline-block" />
                <span>200+ mẫu váy thiết kế</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-burgundy inline-block" />
                <span>Giặt ủi thơm tho</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-burgundy inline-block" />
                <span>Đổi size linh hoạt</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Fashion Frame with Slider */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden bg-ivory border border-line shadow-raised group">
              {/* Slide Image */}
              <Image
                src={currentSlide.imageUrl}
                alt={currentSlide.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle Gradient Shadow Overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent pointer-events-none" />

              {/* Caption Tag */}
              {currentSlide.caption && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-warm-white/90 backdrop-blur-sm border border-line/60 text-xs font-medium text-ink shadow-xs">
                  {currentSlide.caption}
                </div>
              )}

              {/* Slider Control Bar (Bottom-Right matching Mockup) */}
              <div className="absolute bottom-5 right-5 z-10 flex items-center gap-3 px-3.5 py-2 rounded-full bg-warm-white/95 backdrop-blur-md border border-line shadow-md text-ink">
                <span className="text-xs font-mono font-medium tracking-wider">
                  <strong className="text-burgundy font-bold">{formatIndex(currentSlideIndex)}</strong> / {formatIndex(totalSlides - 1)}
                </span>

                <div className="flex items-center gap-1 border-l border-line pl-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Slide trước"
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-ivory text-ink hover:text-burgundy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Slide kế tiếp"
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-ivory text-ink hover:text-burgundy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
