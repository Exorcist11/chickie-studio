"use client";

import * as React from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
} from "lucide-react";
import {
  Button,
  DateRangeField,
  SizeSelector,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui";
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
import { BookingSuccessModal } from "../BookingSuccessModal";
import {
  createBookingSchema,
  BookingFormValues,
} from "./booking.schema";

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

  // Extract Sizes & Colors from variants
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

  // Initialize Zod validation schema
  const bookingSchema = React.useMemo(
    () => createBookingSchema(todayStr),
    [todayStr]
  );

  // Initialize react-hook-form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      size: availableSizes[0] || "S",
      color: availableColors[0] || "",
      rentalStartDate: defaultStartStr,
      rentalEndDate: defaultEndStr,
      fullName: "",
      phone: "",
      deliveryMethod: "PICKUP_STORE",
      address: "",
      note: "",
    },
    mode: "onBlur",
  });

  const {
    watch,
    setValue,
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = form;

  // Watch dynamic form values
  const [
    selectedSize,
    selectedColor,
    startDate,
    endDate,
    deliveryMethod,
    fullName,
    phone,
  ] = watch([
    "size",
    "color",
    "rentalStartDate",
    "rentalEndDate",
    "deliveryMethod",
    "fullName",
    "phone",
  ]);

  // Sync selectedSize if availableSizes changes
  React.useEffect(() => {
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
      setValue("size", availableSizes[0]);
    }
  }, [availableSizes, selectedSize, setValue]);

  // UI modal and auxiliary states
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [createdBooking, setCreatedBooking] = React.useState<BookingResponse | null>(null);
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

  const onInvalid = (fieldErrors: FieldErrors<BookingFormValues>) => {
    if (fieldErrors.fullName) {
      setErrorMsg("Vui lòng nhập đầy đủ họ và tên người thuê.");
    } else if (fieldErrors.phone) {
      setErrorMsg("Số điện thoại không đúng định dạng Việt Nam.");
    } else if (fieldErrors.rentalStartDate || fieldErrors.rentalEndDate) {
      setErrorMsg("Vui lòng chọn khoảng thời gian thuê hợp lệ.");
    } else if (fieldErrors.address) {
      setErrorMsg("Vui lòng cung cấp địa chỉ giao hàng chi tiết.");
    }
  };

  const onSubmit = async (data: BookingFormValues) => {
    setErrorMsg("");
    const cleanPhone = data.phone.trim().replace(/\s+/g, "");
    const variantIdToBook = selectedVariantObj?.id || 1;

    try {
      const response = await createBooking({
        customerName: data.fullName.trim(),
        customerPhone: cleanPhone,
        deliveryMethod: data.deliveryMethod,
        deliveryAddress:
          data.deliveryMethod === "SHIP_TO_ADDRESS"
            ? data.address?.trim()
            : undefined,
        rentalStartDate: data.rentalStartDate,
        rentalEndDate: data.rentalEndDate,
        variantId: variantIdToBook,
        note: data.note?.trim() || undefined,
      });

      setCreatedBooking(response);
      setIsSuccessModalOpen(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Đã xảy ra sự cố khi gửi đơn đặt thuê. Vui lòng thử lại!");
      }
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

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-5">
          {/* Size / Variant Selection */}
          <FormField
            control={control}
            name="size"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                {pillarConfig.showSizeGuide ? (
                  <SizeSelector
                    label={pillarConfig.variantLabel}
                    sizes={availableSizes}
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      trigger("size");
                    }}
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
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-ink">
                        {pillarConfig.variantLabel}:{" "}
                        <strong className="text-burgundy font-semibold">
                          {field.value}
                        </strong>
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
                          onClick={() => {
                            field.onChange(v);
                            trigger("size");
                          }}
                          className={cn(
                            "px-3.5 py-2 rounded-xl text-xs font-medium border transition-all text-left",
                            field.value === v
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color / Style Selection (if multiple) */}
          {availableColors.length > 1 && (
            <FormField
              control={control}
              name="color"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <span className="text-sm font-medium text-ink">
                    {pillarConfig.colorLabel}{" "}
                    <strong className="text-burgundy font-semibold">
                      {field.value || "Mặc định"}
                    </strong>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          field.onChange(c);
                          trigger("color");
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                          field.value === c
                            ? "border-burgundy bg-burgundy/10 text-burgundy font-semibold"
                            : "border-line bg-white text-ink hover:border-burgundy/40"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </FormItem>
              )}
            />
          )}

          {/* Rental Dates & Availability Calendar */}
          <div className="space-y-3">
            <DateRangeField
              label={pillarConfig.dateRangeLabel}
              startDate={startDate}
              endDate={endDate}
              minDate={todayStr}
              onStartDateChange={(val) => {
                setValue("rentalStartDate", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              onEndDateChange={(val) => {
                setValue("rentalEndDate", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              required
            />

            {(errors.rentalStartDate || errors.rentalEndDate) && (
              <p
                id="dates-error"
                role="alert"
                className="text-xs text-danger flex items-center gap-1 mt-1 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>
                  {errors.rentalStartDate?.message ||
                    errors.rentalEndDate?.message ||
                    "Vui lòng chọn khoảng thời gian thuê hợp lệ"}
                </span>
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
                    setValue("rentalStartDate", s, { shouldValidate: true });
                    setValue("rentalEndDate", e, { shouldValidate: true });
                  }}
                  pillar={activePillar}
                />
              </div>
            )}
          </div>

          {/* Customer Information Form Fields */}
          <div className="space-y-4 pt-2 border-t border-line/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormField
                control={control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="booking-fullname">
                      Họ và tên người thuê <span className="text-danger">*</span>
                    </FormLabel>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-4 h-4 text-ink-muted pointer-events-none" />
                      <FormControl>
                        <input
                          id="booking-fullname"
                          type="text"
                          required
                          placeholder="Ví dụ: Nguyễn Quỳnh Anh"
                          {...field}
                          className={cn(
                            "w-full min-h-[42px] pl-9 pr-3 py-2 rounded-btn bg-white text-sm border text-ink transition-colors",
                            errors.fullName
                              ? "border-danger focus:ring-danger/20"
                              : "border-line focus:border-burgundy focus:ring-burgundy/20"
                          )}
                        />
                      </FormControl>
                    </div>
                    <FormMessage id="fullname-error" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="booking-phone">
                      Số điện thoại liên hệ <span className="text-danger">*</span>
                    </FormLabel>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3 w-4 h-4 text-ink-muted pointer-events-none" />
                      <FormControl>
                        <input
                          id="booking-phone"
                          type="tel"
                          required
                          placeholder="Ví dụ: 0912 345 678"
                          {...field}
                          className={cn(
                            "w-full min-h-[42px] pl-9 pr-3 py-2 rounded-btn bg-white text-sm border text-ink transition-colors",
                            errors.phone
                              ? "border-danger focus:ring-danger/20"
                              : "border-line focus:border-burgundy focus:ring-burgundy/20"
                          )}
                        />
                      </FormControl>
                    </div>
                    <FormMessage id="phone-error" />
                  </FormItem>
                )}
              />
            </div>

            {/* Delivery Method Selector */}
            <FormField
              control={control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <span className="block text-xs font-medium text-ink">
                    Hình thức nhận đồ:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange("PICKUP_STORE");
                        trigger("address");
                      }}
                      className={cn(
                        "p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all",
                        field.value === "PICKUP_STORE"
                          ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy shadow-xs"
                          : "border-line bg-white hover:border-burgundy/40"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0",
                          field.value === "PICKUP_STORE"
                            ? "border-burgundy bg-burgundy text-white"
                            : "border-ink-muted"
                        )}
                      >
                        {field.value === "PICKUP_STORE" && (
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
                      onClick={() => {
                        field.onChange("SHIP_TO_ADDRESS");
                        trigger("address");
                      }}
                      className={cn(
                        "p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all",
                        field.value === "SHIP_TO_ADDRESS"
                          ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy shadow-xs"
                          : "border-line bg-white hover:border-burgundy/40"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0",
                          field.value === "SHIP_TO_ADDRESS"
                            ? "border-burgundy bg-burgundy text-white"
                            : "border-ink-muted"
                        )}
                      >
                        {field.value === "SHIP_TO_ADDRESS" && (
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
                </FormItem>
              )}
            />

            {/* Conditional Delivery Address Input */}
            {deliveryMethod === "SHIP_TO_ADDRESS" && (
              <FormField
                control={control}
                name="address"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in duration-200">
                    <FormLabel htmlFor="booking-address">
                      Địa chỉ giao đồ chi tiết <span className="text-danger">*</span>
                    </FormLabel>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-3 w-4 h-4 text-ink-muted pointer-events-none" />
                      <FormControl>
                        <input
                          id="booking-address"
                          type="text"
                          required
                          placeholder="Số nhà, tên đường, ngõ ngách, phường/xã, quận..."
                          {...field}
                          className={cn(
                            "w-full min-h-[42px] pl-9 pr-3 py-2 rounded-btn bg-white text-sm border text-ink transition-colors",
                            errors.address
                              ? "border-danger focus:ring-danger/20"
                              : "border-line focus:border-burgundy focus:ring-burgundy/20"
                          )}
                        />
                      </FormControl>
                    </div>
                    <FormMessage id="address-error" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="booking-note">
                    {pillarConfig.noteLabel}
                  </FormLabel>
                  <FormControl>
                    <textarea
                      id="booking-note"
                      rows={2}
                      placeholder={pillarConfig.notePlaceholder}
                      {...field}
                      className="w-full p-2.5 rounded-btn bg-white text-sm border border-line text-ink focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
      </Form>

      {/* Success Modal (Extracted reusable component) */}
      <BookingSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        booking={createdBooking}
        productName={productName}
        pillar={activePillar}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onSelectSize={(size) => {
          setValue("size", size, { shouldValidate: true });
        }}
        pillar={activePillar}
      />
    </div>
  );
};
