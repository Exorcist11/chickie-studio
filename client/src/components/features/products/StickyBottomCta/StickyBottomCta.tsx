"use client";

import * as React from "react";
import { Sparkles, Calendar, Ruler } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { BusinessPillar, PILLAR_CONFIGS } from "../product-pillar.config";

export interface StickyBottomCtaProps {
  rentalPrice: number;
  depositPrice: number;
  pillar?: BusinessPillar;
  onOpenSizeGuide?: () => void;
  className?: string;
}

export const StickyBottomCta: React.FC<StickyBottomCtaProps> = ({
  rentalPrice,
  depositPrice,
  pillar = "COSTUME",
  onOpenSizeGuide,
  className,
}) => {
  const tProductDetail = useTranslations("productDetail");
  const tProduct = useTranslations("product");
  const pillarConfig = PILLAR_CONFIGS[pillar];
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(rentalPrice);
  const formattedDeposit = new Intl.NumberFormat("vi-VN").format(depositPrice);


  const handleScrollToBooking = () => {
    const el = document.getElementById("booking-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside
      aria-label="Thanh đặt thuê nhanh di động"
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-line px-4 py-3 shadow-2xl transition-all",
        className
      )}
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Price information */}
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-burgundy">{formattedPrice}đ</span>
            <span className="text-xs text-ink-muted">{pillarConfig.priceUnit}</span>
          </div>
          <div className="text-[11px] text-ink-muted">
            Cọc: <span className="font-medium text-ink">{formattedDeposit}đ</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {onOpenSizeGuide && pillar === "COSTUME" && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onOpenSizeGuide}
              className="text-xs h-10 px-2.5 text-ink-muted hover:text-burgundy"
              aria-label="Xem bảng quy đổi kích cỡ"
            >
              <Ruler className="w-4 h-4 mr-1 text-burgundy" />
              Size
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleScrollToBooking}
            className="font-semibold text-xs sm:text-sm px-4 h-10 shadow-md"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Đặt lịch ngay
          </Button>


        </div>
      </div>
    </aside>
  );
};
