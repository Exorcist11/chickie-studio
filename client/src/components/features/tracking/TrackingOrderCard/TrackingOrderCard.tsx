"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Copy,
  Check,
  Calendar,
  MapPin,
  Store,
  CreditCard,
  Phone,
  MessageCircle,
  ShieldCheck,
  QrCode,
  Sparkles,
} from "lucide-react";
import { BookingResponse } from "@/types/booking";

export interface TrackingOrderCardProps {
  booking: BookingResponse;
  className?: string;
}

export const TrackingOrderCard: React.FC<TrackingOrderCardProps> = ({
  booking,
  className = "",
}) => {
  const t = useTranslations("tracking.result");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  const isDepositPaid = [
    "DEPOSITED",
    "DELIVERED",
    "RETURNED",
    "COMPLETED",
  ].includes(booking.status);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(booking.bookingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(booking.bookingCode);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } catch {
      // Ignore
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  // VietQR Dynamic URL for Deposit
  const depositAmount = booking.totalDepositPrice || 0;
  const vietQrUrl = `https://img.vietqr.io/image/970422-0987654321-compact2.png?amount=${depositAmount}&addInfo=${encodeURIComponent(
    booking.bookingCode
  )}&accountName=${encodeURIComponent("CHICKIE STUDIO")}`;

  return (
    <div
      className={`bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden divide-y divide-stone-100 ${className}`}
      data-testid="tracking-order-card"
    >
      {/* 1. Header Information */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-stone-50/80 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A16207] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                {t("orderInfo")}
              </span>
              <span className="text-xs text-stone-400">
                • {t("createdAt")}: {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <h2 className="text-2xl sm:text-3xl font-mono font-bold text-stone-900 tracking-tight">
                {booking.bookingCode}
              </h2>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-[#6B1D2F] bg-white border border-stone-200 rounded-lg shadow-2xs hover:border-[#6B1D2F]/30 transition-all cursor-pointer active:scale-95"
                title={t("copyCode")}
                data-testid="btn-copy-code"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{t("copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t("copyCode")}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:items-end text-xs text-stone-600 gap-1">
            <div className="flex items-center gap-1.5 font-medium text-stone-800">
              {booking.deliveryMethod === "PICKUP_STORE" ? (
                <>
                  <Store className="w-4 h-4 text-[#6B1D2F]" />
                  <span>{t("pickupStore")}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-[#6B1D2F]" />
                  <span>{t("shipAddress")}</span>
                </>
              )}
            </div>
            {booking.deliveryAddress && (
              <p className="text-stone-500 max-w-xs sm:text-right">
                {booking.deliveryAddress}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Customer & Rental Period Summary */}
      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            Khách hàng đặt thuê
          </h4>
          <p className="text-base font-semibold text-stone-900">
            {booking.customerName}
          </p>
          <p className="text-sm text-stone-600 font-mono mt-0.5">
            {booking.customerPhone}
          </p>
          {booking.note && (
            <p className="text-xs text-stone-500 italic mt-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
              &quot;{booking.note}&quot;
            </p>
          )}
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            {t("rentalTime")}
          </h4>
          <div className="flex items-center gap-2 text-stone-900 font-medium">
            <Calendar className="w-4 h-4 text-[#A16207]" />
            <span>
              {formatDate(booking.rentalStartDate)} → {formatDate(booking.rentalEndDate)}
            </span>
            <span className="text-xs font-semibold bg-rose-50 text-[#6B1D2F] px-2 py-0.5 rounded-md border border-rose-100">
              {t("duration", { days: booking.durationDays })}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Giờ nhận đồ: Từ 09:00 sáng tại Showroom Chickie Studio
          </p>
        </div>
      </div>

      {/* 3. Items Reserved */}
      <div className="p-6 sm:p-8 bg-white">
        <h4 className="text-sm font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C5A880]" />
          <span>{t("itemsTitle")}</span>
        </h4>

        <div className="space-y-3">
          {booking.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex items-center justify-between p-4 rounded-xl bg-stone-50/70 border border-stone-200/70 hover:border-stone-300 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-100/60 to-amber-100/60 border border-stone-200 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-[#6B1D2F]/60" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-stone-900">
                    {item.productName}
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    {item.variantSize && (
                      <span className="font-medium bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-700">
                        Size: {item.variantSize}
                      </span>
                    )}
                    {item.variantColor && (
                      <span>Màu: {item.variantColor}</span>
                    )}
                    {item.productItemCode && (
                      <span className="font-mono text-[11px] text-stone-400">
                        ({item.productItemCode})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-stone-900">
                  {formatCurrency(item.rentalPrice)}
                </p>
                <p className="text-xs text-stone-400">
                  Cọc: {formatCurrency(item.depositPrice)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Financial & Deposit VietQR Section */}
      <div className="p-6 sm:p-8 bg-stone-50/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Payment summary breakdown */}
          <div className="bg-white p-6 rounded-xl border border-stone-200/80 space-y-3">
            <h4 className="text-sm font-semibold text-stone-900 pb-2 border-b border-stone-100">
              {t("pricingTitle")}
            </h4>

            <div className="flex justify-between text-sm text-stone-600">
              <span>{t("rentalFee")}:</span>
              <span className="font-medium text-stone-900">
                {formatCurrency(booking.totalRentalPrice)}
              </span>
            </div>

            <div className="flex justify-between text-sm text-stone-600">
              <span>{t("depositFee")} (hoàn trả khi trả đồ):</span>
              <span className="font-medium text-amber-900">
                {formatCurrency(booking.totalDepositPrice)}
              </span>
            </div>

            <div className="pt-3 border-t border-dashed border-stone-200 flex justify-between items-baseline">
              <span className="text-base font-bold text-stone-900">
                {t("totalAmount")}:
              </span>
              <span className="text-xl font-bold text-[#6B1D2F]">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
          </div>

          {/* Deposit Status / VietQR */}
          <div className="bg-white p-6 rounded-xl border border-stone-200/80">
            {isDepositPaid ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-2xs">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-emerald-800">
                  {t("depositPaid")}
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {t("depositPaidDesc")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#6B1D2F]" />
                  <h4 className="text-sm font-bold text-stone-900">
                    {t("depositPending")}
                  </h4>
                </div>
                <p className="text-xs text-stone-500">
                  {t("depositPendingDesc")}
                </p>

                {/* VietQR Box */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                  <div className="w-36 h-36 bg-white p-2 rounded-lg border border-amber-200 shadow-xs shrink-0 flex items-center justify-center">
                    <Image
                      src={vietQrUrl}
                      alt="VietQR Chuyển cọc giữ đồ"
                      width={128}
                      height={128}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  </div>

                  <div className="text-xs space-y-1.5 flex-1 w-full">
                    <div>
                      <span className="text-stone-400">{t("bankName")}: </span>
                      <span className="font-semibold text-stone-800">MB Bank (Quân Đội)</span>
                    </div>
                    <div>
                      <span className="text-stone-400">{t("accountNumber")}: </span>
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        0987654321
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400">{t("accountOwner")}: </span>
                      <span className="font-semibold text-stone-800">CHICKIE STUDIO</span>
                    </div>
                    <div>
                      <span className="text-stone-400">{t("transferContent")}: </span>
                      <span className="font-mono font-bold text-[#6B1D2F]">
                        {booking.bookingCode}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyContent}
                        className="ml-2 inline-flex items-center text-[10px] text-[#6B1D2F] underline hover:no-underline cursor-pointer"
                        title={t("copyContent")}
                      >
                        {copiedContent ? t("copied") : t("copyContent")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Support & Hotline Footer */}
      <div className="p-6 sm:p-8 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h5 className="text-sm font-semibold text-stone-900">
            {t("needHelp")}
          </h5>
          <p className="text-xs text-stone-500 mt-0.5">
            {t("helpDesc")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://zalo.me/0987654321"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t("chatZalo")}</span>
          </a>

          <a
            href="tel:0987654321"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-300 shadow-2xs transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#6B1D2F]" />
            <span>{t("callHotline")}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
