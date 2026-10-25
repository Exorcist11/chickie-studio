"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Clock,
  CheckCircle2,
  CreditCard,
  Package,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { BookingStatus, BookingStatusHistoryResponse } from "@/types/booking";

export interface TrackingTimelineProps {
  currentStatus: BookingStatus;
  statusHistories?: BookingStatusHistoryResponse[];
  className?: string;
}

const STEP_ORDER: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "DEPOSITED",
  "DELIVERED",
  "RETURNED",
  "COMPLETED",
];

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  currentStatus,
  statusHistories = [],
  className = "",
}) => {
  const t = useTranslations("tracking.timeline");

  const isCancelled = currentStatus === "CANCELLED";
  const isOverdue = currentStatus === "OVERDUE";

  const currentIndex = STEP_ORDER.indexOf(currentStatus);

  const getStepIcon = (status: BookingStatus) => {
    switch (status) {
      case "PENDING":
        return Clock;
      case "CONFIRMED":
        return CheckCircle2;
      case "DEPOSITED":
        return CreditCard;
      case "DELIVERED":
        return Package;
      case "RETURNED":
        return RotateCcw;
      case "COMPLETED":
        return Sparkles;
      default:
        return Clock;
    }
  };

  const getStepHistory = (status: BookingStatus) => {
    return statusHistories.find((h) => h.toStatus === status);
  };

  const formatStepDate = (isoDate?: string) => {
    if (!isoDate) return null;
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  };

  return (
    <div
      className={`bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-sm ${className}`}
      data-testid="tracking-timeline"
    >
      <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-stone-100">
        <div>
          <h3 className="text-lg font-serif font-bold text-stone-900 tracking-wide flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C5A880]" aria-hidden="true" />
            <span>Tiến trình xử lý đơn hàng</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Theo dõi trạng thái chuẩn bị trang phục và lịch trình nhận - trả đồ
          </p>
        </div>

        {/* Status Badge */}
        <div>
          {isCancelled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
              {t("CANCELLED.title")}
            </span>
          ) : isOverdue ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              {t("OVERDUE.title")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-[#6B1D2F] border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-[#6B1D2F] animate-ping" />
              {t(`${currentStatus}.title`)}
            </span>
          )}
        </div>
      </div>

      {/* Special Banner for CANCELLED or OVERDUE */}
      {isCancelled && (
        <div className="mb-6 p-4 rounded-xl bg-red-50/80 border border-red-200 text-red-800 text-sm flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">{t("CANCELLED.title")}</p>
            <p className="text-xs text-red-700 mt-0.5">{t("CANCELLED.desc")}</p>
          </div>
        </div>
      )}

      {isOverdue && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">{t("OVERDUE.title")}</p>
            <p className="text-xs text-amber-800 mt-0.5">{t("OVERDUE.desc")}</p>
          </div>
        </div>
      )}

      {/* Desktop Stepper (lg:flex) */}
      <div className="hidden lg:block relative py-4">
        {/* Connection line */}
        <div className="absolute top-9 left-10 right-10 h-0.5 bg-stone-200 -z-0" />
        <div
          className="absolute top-9 left-10 h-0.5 bg-gradient-to-r from-[#6B1D2F] via-[#A16207] to-[#C5A880] transition-all duration-500 -z-0"
          style={{
            width: `${
              currentIndex >= 0
                ? Math.min(100, (currentIndex / (STEP_ORDER.length - 1)) * 100)
                : 0
            }%`,
          }}
        />

        <div className="grid grid-cols-6 gap-2 relative z-10">
          {STEP_ORDER.map((stepKey, idx) => {
            const Icon = getStepIcon(stepKey);
            const isCompleted = currentIndex > idx;
            const isCurrent = currentIndex === idx;
            const history = getStepHistory(stepKey);
            const formattedDate = formatStepDate(history?.createdAt);

            return (
              <div
                key={stepKey}
                className="flex flex-col items-center text-center px-1"
                data-testid={`step-${stepKey.toLowerCase()}`}
              >
                {/* Step Circle */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-[#6B1D2F] text-white shadow-lg ring-4 ring-rose-100 scale-105"
                      : isCompleted
                      ? "bg-[#C5A880] text-white shadow-sm"
                      : "bg-white border-2 border-stone-200 text-stone-400"
                  }`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>

                {/* Step Title & Details */}
                <div className="mt-3">
                  <p
                    className={`text-xs font-semibold transition-colors ${
                      isCurrent
                        ? "text-[#6B1D2F]"
                        : isCompleted
                        ? "text-stone-900"
                        : "text-stone-400"
                    }`}
                  >
                    {t(`${stepKey}.title`)}
                  </p>
                  <p className="text-[11px] text-stone-400 line-clamp-2 mt-0.5 max-w-[130px]">
                    {t(`${stepKey}.desc`)}
                  </p>
                  {formattedDate && (
                    <span className="inline-block mt-1 text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                      {formattedDate}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper (lg:hidden) */}
      <div className="block lg:hidden space-y-6 relative pl-6 before:content-[''] before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
        {STEP_ORDER.map((stepKey, idx) => {
          const Icon = getStepIcon(stepKey);
          const isCompleted = currentIndex > idx;
          const isCurrent = currentIndex === idx;
          const history = getStepHistory(stepKey);
          const formattedDate = formatStepDate(history?.createdAt);

          return (
            <div
              key={stepKey}
              className="relative flex items-start gap-3.5"
              data-testid={`mobile-step-${stepKey.toLowerCase()}`}
            >
              {/* Step indicator dot */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 -ml-6 transition-all ${
                  isCurrent
                    ? "bg-[#6B1D2F] text-white ring-4 ring-rose-100 shadow"
                    : isCompleted
                    ? "bg-[#C5A880] text-white"
                    : "bg-white border-2 border-stone-200 text-stone-400"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>

              {/* Text content */}
              <div className="pt-0.5 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? "text-[#6B1D2F]"
                        : isCompleted
                        ? "text-stone-900"
                        : "text-stone-400"
                    }`}
                  >
                    {t(`${stepKey}.title`)}
                  </h4>
                  {formattedDate && (
                    <span className="text-[11px] text-stone-400">
                      {formattedDate}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {t(`${stepKey}.desc`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
