"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MapPin,
  Phone,
  QrCode,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
  X,
} from "lucide-react";
import { Button, DateRangeField, SizeSelector } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ProductVariant } from "@/types/product";
import { BookingResponse, BookingDeliveryMethod } from "@/types/booking";
import { createBooking } from "@/lib/api/booking";
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
  const router = useRouter();
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
  const { todayStr, defaultStartStr, defaultEndStr } = React.useMemo(() => {
    const d = new Date();
    const t = new Date(d);
    t.setDate(d.getDate() + 1);
    const a = new Date(d);
    a.setDate(d.getDate() + 2);
    const fmt = (date: Date) => date.toISOString().split("T")[0];
    return {
      todayStr: fmt(d),
      defaultStartStr: fmt(t),
      defaultEndStr: fmt(a),
    };
  }, []);

  const [startDate, setStartDate] = React.useState<string>(defaultStartStr);
  const [endDate, setEndDate] = React.useState<string>(defaultEndStr);
  const [fullName, setFullName] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [deliveryMethod, setDeliveryMethod] =
    React.useState<BookingDeliveryMethod>("PICKUP_STORE");
  const [address, setAddress] = React.useState<string>("");
  const [note, setNote] = React.useState<string>("");

  // Touched state for inline validation on blur
  const [touched, setTouched] = React.useState<{
    fullName?: boolean;
    phone?: boolean;
    address?: boolean;
    dates?: boolean;
  }>({});

  // Status & UI states
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = React.useState<BookingResponse | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = React.useState<boolean>(false);
  const [showCalendar, setShowCalendar] = React.useState<boolean>(true);
  const [copiedCode, setCopiedCode] = React.useState<boolean>(false);

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

  // Field validation rules
  const fullNameError = React.useMemo(() => {
    if (!touched.fullName) return "";
    if (!fullName.trim()) return "Vui lòng nhập họ và tên của bạn";
    if (fullName.trim().length < 2) return "Họ và tên tối thiểu 2 ký tự";
    return "";
  }, [fullName, touched.fullName]);

  const phoneError = React.useMemo(() => {
    if (!touched.phone) return "";
    if (!phone.trim()) return "Vui lòng nhập số điện thoại để tiệm liên hệ";
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(phone.trim().replace(/\s+/g, ""))) {
      return "Số điện thoại không hợp lệ (Ví dụ: 0912345678 hoặc +84912345678)";
    }
    return "";
  }, [phone, touched.phone]);

  const addressError = React.useMemo(() => {
    if (deliveryMethod !== "SHIP_TO_ADDRESS") return "";
    if (!touched.address) return "";
    if (!address.trim()) return "Vui lòng nhập địa chỉ giao hàng";
    if (address.trim().length < 5) return "Địa chỉ quá ngắn, vui lòng nhập rõ số nhà, tên đường";
    return "";
  }, [address, deliveryMethod, touched.address]);

  const datesError = React.useMemo(() => {
    if (!touched.dates) return "";
    if (!startDate || !endDate) return "Vui lòng chọn ngày nhận đồ và ngày trả đồ";
    if (startDate < todayStr) return "Ngày nhận đồ không thể ở quá khứ";
    if (endDate < startDate) return "Ngày trả đồ không thể trước ngày nhận đồ";
    return "";
  }, [startDate, endDate, touched.dates, todayStr]);

  const handleBlur = (field: "fullName" | "phone" | "address" | "dates") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Mark all as touched for immediate validation feedback
    setTouched({
      fullName: true,
      phone: true,
      address: true,
      dates: true,
    });

    const cleanPhone = phone.trim().replace(/\s+/g, "");
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

    if (!startDate || !endDate || startDate < todayStr || endDate < startDate) {
      setErrorMsg("Vui lòng chọn khoảng thời gian thuê hợp lệ.");
      return;
    }
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg("Vui lòng nhập đầy đủ họ và tên người thuê.");
      return;
    }
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      setErrorMsg("Số điện thoại không đúng định dạng Việt Nam.");
      return;
    }
    if (deliveryMethod === "SHIP_TO_ADDRESS" && (!address.trim() || address.trim().length < 5)) {
      setErrorMsg("Vui lòng cung cấp địa chỉ giao hàng chi tiết.");
      return;
    }

    const variantIdToBook = selectedVariantObj?.id || 1;

    setIsSubmitting(true);
    try {
      const response = await createBooking({
        customerName: fullName.trim(),
        customerPhone: cleanPhone,
        deliveryMethod,
        deliveryAddress:
          deliveryMethod === "SHIP_TO_ADDRESS" ? address.trim() : undefined,
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        variantId: variantIdToBook,
        note: note.trim() || undefined,
      });

      setCreatedBooking(response);
      setIsSuccessModalOpen(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Đã xảy ra sự cố khi gửi đơn đặt thuê. Vui lòng thử lại!");
      }
    } finally {
      setIsSubmitting(false);
    }
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
            minDate={todayStr}
            onStartDateChange={(val) => {
              setStartDate(val);
              handleBlur("dates");
            }}
            onEndDateChange={(val) => {
              setEndDate(val);
              handleBlur("dates");
            }}
            required
          />

          {datesError && (
            <p id="dates-error" className="text-xs text-danger flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{datesError}</span>
            </p>
          )}

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
                  handleBlur("dates");
                }}
                pillar={activePillar}
              />
            </div>
          )}
        </div>

        {/* Customer Information Form Fields */}
        <div className="space-y-4 pt-2 border-t border-line/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="booking-fullname"
                className="block text-xs font-medium text-ink mb-1"
              >
                Họ và tên người thuê <span className="text-danger">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-ink-muted pointer-events-none" />
                <input
                  id="booking-fullname"
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Quỳnh Anh"
                  value={fullName}
                  aria-invalid={!!fullNameError}
                  aria-describedby={fullNameError ? "fullname-error" : undefined}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  className={cn(
                    "w-full min-h-[42px] pl-9 pr-3 py-2 rounded-btn bg-white text-sm border text-ink transition-colors",
                    fullNameError
                      ? "border-danger focus:ring-danger/20"
                      : "border-line focus:border-burgundy focus:ring-burgundy/20"
                  )}
                />
              </div>
              {fullNameError && (
                <p id="fullname-error" className="text-xs text-danger flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{fullNameError}</span>
                </p>
              )}
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
                  aria-invalid={!!phoneError}
                  aria-describedby={phoneError ? "phone-error" : undefined}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={cn(
                    "w-full min-h-[42px] pl-9 pr-3 py-2 rounded-btn bg-white text-sm border text-ink transition-colors",
                    phoneError
                      ? "border-danger focus:ring-danger/20"
                      : "border-line focus:border-burgundy focus:ring-burgundy/20"
                  )}
                />
              </div>
              {phoneError && (
                <p id="phone-error" className="text-xs text-danger flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{phoneError}</span>
                </p>
              )}
            </div>
          </div>

          {/* Delivery Method Selector */}
          <div className="space-y-2">
            <span className="block text-xs font-medium text-ink">
              Hình thức nhận đồ:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDeliveryMethod("PICKUP_STORE")}
                className={cn(
                  "p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all",
                  deliveryMethod === "PICKUP_STORE"
                    ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy shadow-xs"
                    : "border-line bg-white hover:border-burgundy/40"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0",
                    deliveryMethod === "PICKUP_STORE"
                      ? "border-burgundy bg-burgundy text-white"
                      : "border-ink-muted"
                  )}
                >
                  {deliveryMethod === "PICKUP_STORE" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-ink flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-burgundy" />
                    <span>Nhận tại tiệm (Miễn phí)</span>
                  </div>
                  <p className="text-[11px] text-ink-muted leading-relaxed">
                    18 Ngõ 120 Hoàng Hoa Thám, Ba Đình, HN. Thử váy và chỉnh size vừa vặn trước khi nhận.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod("SHIP_TO_ADDRESS")}
                className={cn(
                  "p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all",
                  deliveryMethod === "SHIP_TO_ADDRESS"
                    ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy shadow-xs"
                    : "border-line bg-white hover:border-burgundy/40"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0",
                    deliveryMethod === "SHIP_TO_ADDRESS"
                      ? "border-burgundy bg-burgundy text-white"
                      : "border-ink-muted"
                  )}
                >
                  {deliveryMethod === "SHIP_TO_ADDRESS" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-ink flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-burgundy" />
                    <span>Giao hàng tận nơi</span>
                  </div>
                  <p className="text-[11px] text-ink-muted leading-relaxed">
                    Giao hỏa tốc nội thành Hà Nội. Shipper mang đồ tận tay trong khung giờ bạn chọn.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Delivery Address Input */}
          {deliveryMethod === "SHIP_TO_ADDRESS" && (
            <div className="animate-in fade-in duration-200">
              <label
                htmlFor="booking-address"
                className="block text-xs font-medium text-ink mb-1"
              >
                Địa chỉ giao đồ chi tiết <span className="text-danger">*</span>
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 w-4 h-4 text-ink-muted pointer-events-none" />
                <input
                  id="booking-address"
                  type="text"
                  required
                  placeholder="Số nhà, tên đường, ngõ ngách, phường/xã, quận..."
                  value={address}
                  aria-invalid={!!addressError}
                  aria-describedby={addressError ? "address-error" : undefined}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => handleBlur("address")}
                  className={cn(
                    "w-full min-h-[42px] pl-9 pr-3 py-2 rounded-btn bg-white text-sm border text-ink transition-colors",
                    addressError
                      ? "border-danger focus:ring-danger/20"
                      : "border-line focus:border-burgundy focus:ring-burgundy/20"
                  )}
                />
              </div>
              {addressError && (
                <p id="address-error" className="text-xs text-danger flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{addressError}</span>
                </p>
              )}
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
          <div
            role="alert"
            tabIndex={-1}
            className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-start gap-2 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-danger" />
            <div className="space-y-0.5">
              <div className="font-semibold">Chưa thể gửi đơn:</div>
              <div>{errorMsg}</div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-center shadow-md font-semibold text-base py-3.5"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang gửi thông tin đơn...
            </span>
          ) : (
            pillarConfig.submitBtnText
          )}
        </Button>
      </form>

      {/* Success Modal */}
      {isSuccessModalOpen && createdBooking && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-line space-y-5 my-6">
            <button
              type="button"
              aria-label="Đóng"
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1.5 rounded-full hover:bg-ivory transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Icon & Title */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-success/10 text-success flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>

              <div className="space-y-1">
                <h3
                  id="success-modal-title"
                  className="font-serif text-xl sm:text-2xl font-bold text-ink"
                >
                  {pillarConfig.successModalTitle}
                </h3>
                <p className="text-xs text-ink-muted">
                  {pillarConfig.successModalSubtitle}
                </p>
              </div>

              {/* Booking Code Banner */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-burgundy/10 border border-burgundy/20 text-burgundy text-xs font-semibold">
                <span>Mã đơn: <strong>{createdBooking.bookingCode}</strong></span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(createdBooking.bookingCode)}
                  className="text-burgundy hover:text-burgundy-dark cursor-pointer inline-flex items-center gap-1 text-[11px]"
                  title="Sao chép mã đơn"
                >
                  {copiedCode ? (
                    <span className="flex items-center gap-0.5 text-success">
                      <Check className="w-3.5 h-3.5" /> Đã sao chép
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5">
                      <Copy className="w-3.5 h-3.5" /> Sao chép
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Order Details Bento Box */}
            <div className="p-4 rounded-xl bg-ivory/60 border border-line text-xs space-y-2.5">
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
                <span className="text-ink-muted">Thời gian thuê:</span>
                <span className="font-medium text-ink">
                  {startDate} đến {endDate} ({rentalDays} {pillarConfig.durationUnitLabel})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Hình thức nhận:</span>
                <span className="font-medium text-ink">
                  {deliveryMethod === "PICKUP_STORE"
                    ? "Nhận tại tiệm (18 Ngõ 120 Hoàng Hoa Thám)"
                    : `Giao tận nơi (${address})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Người đặt:</span>
                <span className="font-medium text-ink">
                  {fullName} - {phone}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-line/50">
                <span className="font-medium text-ink">Tổng thanh toán dự kiến:</span>
                <span className="font-bold text-burgundy text-sm">
                  {new Intl.NumberFormat("vi-VN").format(createdBooking.totalAmount)}đ
                </span>
              </div>
            </div>

            {/* Bank Transfer Instructions Card */}
            <div className="p-4 rounded-xl bg-white border border-burgundy/20 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-burgundy">
                <QrCode className="w-4 h-4 text-burgundy" />
                <span>Hướng Dẫn Chuyển Khoản Đặt Cọc</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink-muted block text-[11px]">Ngân hàng:</span>
                  <strong className="text-ink font-semibold">MB Bank (Quân Đội)</strong>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">Số tài khoản:</span>
                  <strong className="text-burgundy font-mono font-bold text-sm">
                    9999 8888 6666
                  </strong>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">Chủ tài khoản:</span>
                  <strong className="text-ink font-semibold">CHICKIE STUDIO</strong>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">Nội dung CK:</span>
                  <strong className="text-burgundy font-mono font-bold">
                    {createdBooking.bookingCode} {phone}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-burgundy/5 text-[11px] text-ink-muted flex items-start gap-1.5 leading-relaxed">
                <Clock className="w-3.5 h-3.5 text-burgundy shrink-0 mt-0.5" />
                <span>
                  Tiệm giữ đồ an toàn trong vòng <strong>60 phút</strong>. Sau khi chuyển khoản, tiệm sẽ liên hệ xác nhận đơn ngay qua Zalo!
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button
                variant="primary"
                size="md"
                className="w-full sm:flex-1 justify-center inline-flex items-center gap-1.5"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  router.push(`/booking/success/${createdBooking.bookingCode}`);
                }}
              >
                <span>Xem hóa đơn chi tiết</span>
                <ExternalLink className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                size="md"
                className="w-full sm:w-auto justify-center"
                onClick={() => setIsSuccessModalOpen(false)}
              >
                Tiếp tục xem đồ
              </Button>
            </div>
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
