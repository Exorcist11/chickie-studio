import { z } from "zod";

export const VIETNAM_PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/;

export const trackingSearchSchema = z.object({
  bookingCode: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã đơn thuê")
    .min(5, "Mã đơn thuê tối thiểu 5 ký tự"),
  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .refine(
      (val) => VIETNAM_PHONE_REGEX.test(val.replace(/\s+/g, "")),
      "Số điện thoại không hợp lệ (Ví dụ: 0912345678 hoặc +84912345678)"
    ),
});

export type TrackingSearchFormValues = z.infer<typeof trackingSearchSchema>;
