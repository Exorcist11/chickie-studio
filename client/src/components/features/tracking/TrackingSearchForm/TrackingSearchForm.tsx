"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Search, Hash, Phone, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/primitives/form";
import {
  trackingSearchSchema,
  TrackingSearchFormValues,
} from "./tracking.schema";

export interface TrackingSearchFormProps {
  initialValues?: Partial<TrackingSearchFormValues>;
  isLoading?: boolean;
  onSubmit: (values: TrackingSearchFormValues) => void;
  className?: string;
}

export const TrackingSearchForm: React.FC<TrackingSearchFormProps> = ({
  initialValues,
  isLoading = false,
  onSubmit,
  className = "",
}) => {
  const t = useTranslations("tracking.form");

  const form = useForm<TrackingSearchFormValues>({
    resolver: zodResolver(trackingSearchSchema),
    defaultValues: {
      bookingCode: initialValues?.bookingCode || "",
      phone: initialValues?.phone || "",
    },
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (initialValues?.bookingCode || initialValues?.phone) {
      form.reset({
        bookingCode: initialValues.bookingCode || "",
        phone: initialValues.phone || "",
      });
    }
  }, [initialValues?.bookingCode, initialValues?.phone, form]);

  const handleSubmit = (values: TrackingSearchFormValues) => {
    onSubmit(values);
  };

  return (
    <div
      className={`bg-white/90 backdrop-blur-md border border-stone-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(handleSubmit)(e);
          }}
          className="space-y-6"
          noValidate
          data-testid="tracking-search-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Mã đơn đặt thuê */}
            <FormField
              control={form.control}
              name="bookingCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-stone-800 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-[#6B1D2F]" aria-hidden="true" />
                    <span>{t("bookingCodeLabel")}</span>
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        {...field}
                        type="text"
                        placeholder={t("bookingCodePlaceholder")}
                        disabled={isLoading}
                        className="w-full h-11 px-3.5 bg-stone-50/70 border border-stone-300 rounded-xl text-stone-900 placeholder:text-stone-400 font-mono uppercase text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1D2F] focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        data-testid="input-booking-code"
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-stone-500 mt-1">
                    {t("bookingCodeHelp")}
                  </p>
                  <FormMessage className="text-xs text-red-600 mt-1" />
                </FormItem>
              )}
            />

            {/* Số điện thoại */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-stone-800 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#6B1D2F]" aria-hidden="true" />
                    <span>{t("phoneLabel")}</span>
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        {...field}
                        type="tel"
                        placeholder={t("phonePlaceholder")}
                        disabled={isLoading}
                        className="w-full h-11 px-3.5 bg-stone-50/70 border border-stone-300 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1D2F] focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        data-testid="input-phone"
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-stone-500 mt-1">
                    {t("phoneHelp")}
                  </p>
                  <FormMessage className="text-xs text-red-600 mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto min-h-[44px] px-8 py-3 bg-[#6B1D2F] hover:bg-[#521624] text-white font-medium rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B1D2F]"
              data-testid="btn-submit-tracking"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>{t("submitting")}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" aria-hidden="true" />
                  <span>{t("submitButton")}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};
