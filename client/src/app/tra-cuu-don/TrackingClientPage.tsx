"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Search,
  ChevronRight,
  HelpCircle,
  AlertCircle,
  Home,
  Sparkles,
} from "lucide-react";
import { Header, Footer } from "@/components/ui";
import {
  TrackingSearchForm,
  TrackingTimeline,
  TrackingOrderCard,
  TrackingSkeleton,
  TrackingSearchFormValues,
} from "@/components/features/tracking";
import { trackBooking } from "@/lib/api/booking";
import { BookingResponse } from "@/types/booking";

export const TrackingClientPage: React.FC = () => {
  const searchParams = useSearchParams();
  const t = useTranslations("tracking");
  const tFaq = useTranslations("tracking.faq");

  const initialCode =
    searchParams.get("code") || searchParams.get("bookingCode") || "";
  const initialPhone =
    searchParams.get("phone") || searchParams.get("customerPhone") || "";

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = useCallback(
    async (values: TrackingSearchFormValues) => {
      setIsLoading(true);
      setErrorMessage("");
      setHasSearched(true);

      try {
        const result = await trackBooking({
          bookingCode: values.bookingCode,
          phone: values.phone,
        });
        setBooking(result);
        setErrorMessage("");
      } catch (err: unknown) {
        setBooking(null);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : t("form.errorNotFound")
        );
      } finally {
        setIsLoading(false);
      }
    },
    [t]
  );

  // Auto trigger search if both code and phone exist in query params
  useEffect(() => {
    if (initialCode && initialPhone) {
      handleSearch({
        bookingCode: initialCode,
        phone: initialPhone,
      });
    }
  }, [initialCode, initialPhone, handleSearch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-stone-900 selection:bg-rose-100 selection:text-[#6B1D2F]">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center text-xs text-stone-500 gap-1.5"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#6B1D2F] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-stone-800 font-medium">{t("breadcrumb")}</span>
        </nav>

        {/* Hero Title Section */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#6B1D2F] text-xs font-semibold border border-rose-200/60 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Chickie Studio Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            {t("subtitle")}
          </p>
        </div>

        {/* Search Form */}
        <section aria-labelledby="tracking-form-heading">
          <h2 id="tracking-form-heading" className="sr-only">
            {t("form.submitButton")}
          </h2>
          <TrackingSearchForm
            initialValues={{
              bookingCode: initialCode,
              phone: initialPhone,
            }}
            isLoading={isLoading}
            onSubmit={handleSearch}
          />
        </section>

        {/* Error notification */}
        {errorMessage && !isLoading && (
          <div
            role="alert"
            className="p-5 rounded-2xl bg-red-50/90 border border-red-200 text-red-900 flex items-start gap-3.5 shadow-xs"
            data-testid="tracking-error-alert"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-red-800">
                Tra cứu không thành công
              </p>
              <p className="text-red-700 mt-0.5">{errorMessage}</p>
              <p className="text-xs text-stone-500 mt-2">
                Nếu bạn lỡ quên mã đơn hoặc số điện thoại, vui lòng liên hệ hotline{" "}
                <a
                  href="tel:0987654321"
                  className="font-semibold text-[#6B1D2F] underline"
                >
                  0987.654.321
                </a>{" "}
                để được nhân viên hỗ trợ trực tiếp.
              </p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && <TrackingSkeleton />}

        {/* Search Result Section */}
        {booking && !isLoading && (
          <section
            aria-label="Kết quả tra cứu đơn hàng"
            className="space-y-6 sm:space-y-8 animate-in fade-in duration-300"
            data-testid="tracking-result-section"
          >
            {/* Timeline Progress */}
            <TrackingTimeline
              currentStatus={booking.status}
              statusHistories={booking.statusHistories}
            />

            {/* Detailed Order Card with VietQR */}
            <TrackingOrderCard booking={booking} />
          </section>
        )}

        {/* FAQ Section */}
        {!booking && !isLoading && (
          <section
            aria-labelledby="faq-heading"
            className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <HelpCircle className="w-5 h-5 text-[#C5A880]" />
              <h3
                id="faq-heading"
                className="text-base font-serif font-bold text-stone-900"
              >
                {tFaq("title")}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1.5 p-4 rounded-xl bg-stone-50/70 border border-stone-100">
                <h4 className="font-semibold text-stone-900 text-xs sm:text-sm">
                  {tFaq("q1")}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {tFaq("a1")}
                </p>
              </div>

              <div className="space-y-1.5 p-4 rounded-xl bg-stone-50/70 border border-stone-100">
                <h4 className="font-semibold text-stone-900 text-xs sm:text-sm">
                  {tFaq("q2")}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {tFaq("a2")}
                </p>
              </div>

              <div className="space-y-1.5 p-4 rounded-xl bg-stone-50/70 border border-stone-100">
                <h4 className="font-semibold text-stone-900 text-xs sm:text-sm">
                  {tFaq("q3")}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {tFaq("a3")}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};
