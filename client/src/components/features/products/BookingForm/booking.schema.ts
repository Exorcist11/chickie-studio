import { z } from "zod";

export const VIETNAM_PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/;

export const createBookingSchema = (minStartDate: string) =>
  z
    .object({
      size: z.string().min(1, "Vui lòng chọn kích cỡ/phiên bản"),
      color: z.string().optional().default(""),
      rentalStartDate: z.string().min(1, "Vui lòng chọn ngày nhận đồ"),
      rentalEndDate: z.string().min(1, "Vui lòng chọn ngày trả đồ"),
      fullName: z
        .string()
        .trim()
        .min(1, "Vui lòng nhập họ và tên của bạn")
        .min(2, "Họ và tên tối thiểu 2 ký tự"),
      phone: z
        .string()
        .trim()
        .min(1, "Vui lòng nhập số điện thoại để tiệm liên hệ")
        .refine(
          (val) => VIETNAM_PHONE_REGEX.test(val.replace(/\s+/g, "")),
          "Số điện thoại không hợp lệ (Ví dụ: 0912345678 hoặc +84912345678)"
        ),
      email: z
        .string()
        .trim()
        .min(1, "Vui lòng nhập địa chỉ email nhận thông báo")
        .email("Địa chỉ email không đúng định dạng (Ví dụ: name@example.com)"),
      deliveryMethod: z.enum(["PICKUP_STORE", "SHIP_TO_ADDRESS"] as const),
      address: z.string().optional().default(""),
      note: z.string().optional().default(""),
    })
    .superRefine((data, ctx) => {
      // 1. Kiểm tra ngày nhận đồ không ở quá khứ
      if (data.rentalStartDate && data.rentalStartDate < minStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rentalStartDate"],
          message: "Ngày nhận đồ không thể ở quá khứ",
        });
      }

      // 2. Kiểm tra ngày trả đồ không trước ngày nhận đồ
      if (
        data.rentalStartDate &&
        data.rentalEndDate &&
        data.rentalEndDate < data.rentalStartDate
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rentalEndDate"],
          message: "Ngày trả đồ không thể trước ngày nhận đồ",
        });
      }

      // 3. Kiểm tra địa chỉ giao hàng khi chọn SHIP_TO_ADDRESS
      if (data.deliveryMethod === "SHIP_TO_ADDRESS") {
        const trimmedAddress = (data.address || "").trim();
        if (!trimmedAddress) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["address"],
            message: "Vui lòng nhập địa chỉ giao hàng",
          });
        } else if (trimmedAddress.length < 5) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["address"],
            message: "Địa chỉ quá ngắn, vui lòng nhập rõ số nhà, tên đường",
          });
        }
      }
    });

export type BookingSchemaType = ReturnType<typeof createBookingSchema>;
export type BookingFormValues = z.infer<BookingSchemaType>;
