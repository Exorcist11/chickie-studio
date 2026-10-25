"use client";

import * as React from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Button, DateRangeField, SizeSelector } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ProductVariant } from "@/types/product";
import {
  BusinessPillar,
  PILLAR_CONFIGS,
} from "../product-pillar.config";
import { SizeGuideModal } from "../SizeGuideModal";
import { AvailabilityCalendar } from "../AvailabilityCalendar";

export interface BookingFormProps {
  productId: number;
  slug?: string;
  productName: string;
  rentalPrice: number;
  depositPrice: number;
  variants?: ProductVariant[];
  pillar?: BusinessPillar;
  className?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  productId: _productId,
  slug,
  productName,
  rentalPrice,
  depositPrice,
  variants = [],
  pillar = "COSTUME",
  className,
}) => {
  const activePillar = pillar || "COSTUME";
  const pillarConfig = PILLAR_CONFIGS[activePillar].booking;

  // Sizes & Colors extraction from variants
  const availableSizes = React.useMemo(() => {
    if (variants.length === 0) {
      return activePillar === "CAMERA"
        ? ["Bộ Kit Tiêu Chuẩn"]
        : activePillar === "PHOTOGRAPHY"
        ? ["Gói Tiêu Chuẩn"]
        : ["S", "M", "L"];
    }
    const unique = Array.from(new Set(variants.map((v) => v.size)));
    return unique.length > 0
      ? unique
      : activePillar === "CAMERA"
      ? ["Bộ Kit Tiêu Chuẩn"]
      : activePillar === "PHOTOGRAPHY"
      ? ["Gói Tiêu Chuẩn"]
      : ["S", "M", "L"];
  }, [variants, activePillar]);

  const availableColors = React.useMemo(() => {
    if (variants.length === 0) return [];
    return Array.from(new Set(variants.map((v) => v.color)));
  }, [variants]);

  // Form states
  const [selectedSize, setSelectedSize] = React.useState<string>(
    availableSizes[0] || "S"
  );
  const [selectedColor, setSelectedColor] = React.useState<string>(
    availableColors[0] || ""
  );

  // Sync selectedSize if availableSizes changes
  React.useEffect(() => {
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  // Default dates: tomorrow to day after tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const formatDateStr = (d: Date) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = React.useState<string>(formatDateStr(tomorrow));
  const [endDate, setEndDate] = React.useState<string>(formatDateStr(dayAfter));
  const [fullName, setFullName] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [tryAtStudio, setTryAtStudio] = React.useState<boolean>(false);
  const [address, setAddress] = React.useState<string>("");
  const [note, setNote] = React.useState<string>("");

  // Validation & status
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = React.useState<boolean>(false);
  const [showCalendar, setShowCalendar] = React.useState<boolean>(true);

  // Match selected variant object
  const selectedVariantObj = React.useMemo(() => {
    if (!variants || variants.length === 0) return undefined;
    return (
      variants.find(
        (v) =>
          v.size === selectedSize && (!selectedColor || v.color === selectedColor)
      ) || variants[0]
    );
  }, [variants, selectedSize, selectedColor]);

  // Calculate rental duration in days
  const rentalDays = React.useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [startDate, endDate]);

  const totalRentalFee = rentalPrice * rentalDays;
  const totalAmount = totalRentalFee + depositPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!startDate || !endDate) {
      setErrorMsg("Vui lòng chọn ngày nhận đồ và ngày trả đồ.");
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Vui lòng nhập số điện thoại để tiệm liên hệ.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 600);
  };

  const formattedRentalPrice = new Intl.NumberFormat("vi-VN").format(rentalPrice);
  const formattedDepositPrice = new Intl.NumberFormat("vi-VN").format(depositPrice);
  const formattedTotalRentalFee = new Intl.NumberFormat("vi-VN").format(totalRentalFee);
  const formattedTotalAmount = new Intl.NumberFormat("vi-VN").format(totalAmount);

  return (
    <div
      className={cn(
        "rounded-2xl bg-warm-white border border-line p-5 sm:p-7 shadow-card space-y-6",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-line pb-4">
        <div className="flex items-center gap-2 text-burgundy text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-burgundy" />
          <span>{pillarConfig.title}</span>
        </div>
        <p className="text-xs text-ink-muted">
          {pillarConfig.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Size / Variant Selection */}
        {pillarConfig.showSizeGuide ? (
          <div className="space-y-1.5">
            <SizeSelector
              label={pillarConfig.variantLabel}
              sizes={availableSizes}
              value={selectedSize}
              onChange={setSelectedSize}
              sizeGuideAction={
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-burgundy font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5 text-burgundy" />
                  Bảng quy đổi kích cỡ
                </button>
              }
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-ink">
                {pillarConfig.variantLabel}:{" "}
                <strong className="text-burgundy font-semibold">{selectedSize}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-burgundy font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5 text-burgundy" />
                Thông số quy chuẩn
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedSize(v)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-medium border transition-all text-left",
                    selectedSize === v
                      ? "border-burgundy bg-burgundy/10 text-burgundy font-semibold shadow-xs"
                      : "border-line bg-white text-ink hover:border-burgundy/40"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color / Style Selection (if multiple) */}
        {availableColors.length > 1 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-ink">
              {pillarConfig.colorLabel}{" "}
              <strong className="text-burgundy font-semibold">
                {selectedColor || "Mặc định"}
              </strong>
            </span>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                    selectedColor === c
                      ? "border-burgundy bg-burgundy/10 text-burgundy font-semibold"
                      : "border-line bg-white text-ink hover:border-burgundy/40"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rental Dates & Availability Calendar */}
        <div className="space-y-3">
          <DateRangeField
            label={pillarConfig.dateRangeLabel}
            startDate={startDate}
            endDate={endDate}
            minDate={formatDateStr(today)}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            required
          />

          <div className="flex items-center justify-between text-xs text-ink-muted">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-burgundy" />
              <span>
                Thời gian tính:{" "}
                <strong className="text-burgundy font-medium">
                  {rentalDays} {pillarConfig.durationUnitLabel}
                </strong>
                {activePillar !== "PHOTOGRAPHY" && " (24h/ngày)"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-xs font-medium text-burgundy hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-burgundy" />
              {showCalendar ? "Thu gọn lịch" : "Xem lịch trống"}
            </button>
          </div>

          {showCalendar && (
            <div className="pt-1">
              <AvailabilityCalendar
                slug={slug || "product"}
                variantId={selectedVariantObj?.id}
                startDate={startDate}
                endDate={endDate}
                onDateRangeChange={(s, e) => {
                  setStartDate(s);
                  setEndDate(e);
                }}
                pillar={activePillar}
              />
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div className="space-y-3 pt-2 border-t border-line/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="booking-fullname"
                className="block text-xs font-medium text-ink mb-1"
              >
                Họ và tên <span className="text-danger">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-ink-muted pointer-events-none" />
                <input
                  id="booking-fullname"
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Quỳnh Anh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-btn bg-white text-sm border border-line text-ink focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="booking-phone"
                className="block text-xs font-medium text-ink mb-1"
              >
                Số điện thoại liên hệ <span className="text-danger">*</span>
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3 w-4 h-4 text-ink-muted pointer-events-none" />
                <input
                  id="booking-phone"
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-btn bg-white text-sm border border-line text-ink focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
                />
              </div>
            </div>
          </div>

          {/* Studio Option Checkbox */}
          <div className="p-3 rounded-xl bg-ivory/60 border border-line flex items-start gap-2.5">
            <input
              id="try-at-studio"
              type="checkbox"
              checked={tryAtStudio}
              onChange={(e) => setTryAtStudio(e.target.checked)}
              className="mt-0.5 rounded text-burgundy focus:ring-burgundy"
            />
            <label
              htmlFor="try-at-studio"
              className="text-xs text-ink cursor-pointer select-none leading-relaxed"
            >
              <strong className="font-semibold text-burgundy">
                {pillarConfig.studioCheckboxTitle}
              </strong>{" "}
              {pillarConfig.studioCheckboxAddress}
            </label>
          </div>

          {!tryAtStudio && (
            <div>
              <label
                htmlFor="booking-address"
                className="block text-xs font-medium text-ink mb-1"
              >
                {pillarConfig.deliveryAddressLabel}
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 w-4 h-4 text-ink-muted pointer-events-none" />
                <input
                  id="booking-address"
                  type="text"
                  placeholder={pillarConfig.deliveryAddressPlaceholder}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-btn bg-white text-sm border border-line text-ink focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="booking-note"
              className="block text-xs font-medium text-ink mb-1"
            >
              {pillarConfig.noteLabel}
            </label>
            <textarea
              id="booking-note"
              rows={2}
              placeholder={pillarConfig.notePlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 rounded-btn bg-white text-sm border border-line text-ink focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 resize-none"
            />
          </div>
        </div>

        {/* Pricing Summary Card */}
        <div className="rounded-xl bg-ivory/50 border border-line p-4 space-y-2.5 text-sm">
          <div className="flex justify-between items-center text-ink-muted text-xs">
            <span>
              {activePillar === "PHOTOGRAPHY" ? "Chi phí gói:" : "Giá thuê:"}{" "}
              ({formattedRentalPrice}đ x {rentalDays} {pillarConfig.durationUnitLabel}):
            </span>
            <span className="font-medium text-ink">{formattedTotalRentalFee}đ</span>
          </div>

          <div className="flex justify-between items-center text-ink-muted text-xs">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-burgundy" />
              {pillarConfig.depositSummaryLabel}
            </span>
            <span className="font-medium text-ink">{formattedDepositPrice}đ</span>
          </div>

          <div className="pt-2 border-t border-line/60 flex justify-between items-baseline">
            <div>
              <div className="text-xs font-medium text-ink">Tổng thanh toán dự kiến:</div>
              <div className="text-[11px] text-ink-muted">
                {pillarConfig.depositSummaryNote}
              </div>
            </div>
            <div className="text-lg font-bold text-burgundy">{formattedTotalAmount}đ</div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs">
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-center shadow-md font-semibold text-base py-3.5"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang gửi thông tin..." : pillarConfig.submitBtnText}
        </Button>
      </form>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-line space-y-4 text-center">
            <button
              type="button"
              aria-label="Đóng"
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 rounded-full hover:bg-ivory transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 mx-auto rounded-full bg-success/10 text-success flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>

            <div className="space-y-1">
              <h3
                id="success-modal-title"
                className="font-serif text-xl font-semibold text-ink"
              >
                {pillarConfig.successModalTitle}
              </h3>
              <p className="text-xs text-ink-muted">
                {pillarConfig.successModalSubtitle}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-ivory/60 border border-line text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-muted">{pillarConfig.successItemLabel}</span>
                <span className="font-semibold text-ink line-clamp-1">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">{pillarConfig.successVariantLabel}</span>
                <span className="font-medium text-ink">
                  {selectedSize} {selectedColor ? `• ${selectedColor}` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Thời gian:</span>
                <span className="font-medium text-ink">
                  {startDate} đến {endDate} ({rentalDays} {pillarConfig.durationUnitLabel})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Khách hàng:</span>
                <span className="font-medium text-ink">
                  {fullName} - {phone}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-line/50">
                <span className="font-medium text-ink">Tổng dự kiến:</span>
                <span className="font-bold text-burgundy">{formattedTotalAmount}đ</span>
              </div>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              {pillarConfig.successFollowupNote.replace(
                "số điện thoại của bạn",
                `số ${phone}`
              )}
            </p>

            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              {pillarConfig.successContinueBtnText}
            </Button>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        pillar={activePillar}
        onSelectSize={(size) => setSelectedSize(size)}
      />
    </div>
  );
};

