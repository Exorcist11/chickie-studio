"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  HelpCircle,
  MapPin,
  Phone,
  QrCode,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
} from "lucide-react";
import { Header, Footer, Button } from "@/components/ui";
import { getBookingByCode } from "@/lib/api/booking";
import { BookingResponse } from "@/types/booking";

export default function BookingSuccessPage() {
  const params = useParams();
  const code = (params?.code as string) || "";

  const [booking, setBooking] = React.useState<BookingResponse | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [copiedCode, setCopiedCode] = React.useState<boolean>(false);
  const [copiedBank, setCopiedBank] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!code) return;

    let isMounted = true;
    setLoading(true);

    getBookingByCode(code)
      .then((data) => {
        if (isMounted) {
          setBooking(data);
          setError("");
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Không thể tải thông tin đơn đặt thuê"
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [code]);

  const handleCopy = async (text: string, type: "code" | "bank") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedBank(true);
        setTimeout(() => setCopiedBank(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-white">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-burgundy transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại danh mục sản phẩm</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-line shadow-card space-y-4">
            <div className="w-10 h-10 mx-auto border-3 border-burgundy border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-ink-muted">Đang tải hóa đơn đơn hàng...</p>
          </div>
        ) : error || !booking ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-line shadow-card space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-danger/10 text-danger flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-danger" />
            </div>
            <h1 className="text-xl font-serif font-bold text-ink">
              Không Tìm Thấy Đơn Đặt Thuê
            </h1>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              {error || "Mã đơn hàng không hợp lệ hoặc đã hết hạn lưu trữ."}
            </p>
            <Link href="/products">
              <Button variant="primary" size="md">
                Khám phá bộ sưu tập
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Hero Banner */}
            <div className="rounded-2xl bg-white border border-line p-6 sm:p-8 shadow-card text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-success/10 text-success flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-success" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Đặt Thuê Thành Công</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                  Biên Nhận Giữ Đồ Chickie Studio
                </h1>
                <p className="text-xs text-ink-muted max-w-lg mx-auto">
                  Cảm ơn bạn đã tin tưởng Chickie Studio! Đơn hàng của bạn đã được ghi nhận trên hệ thống và đang chờ đối soát cọc.
                </p>
              </div>

              {/* Code Pill */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ivory border border-burgundy/20">
                  <span className="text-xs text-ink-muted">Mã đơn:</span>
                  <span className="font-mono font-bold text-burgundy text-sm sm:text-base">
                    {booking.bookingCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(booking.bookingCode, "code")}
                    className="p-1 text-ink-muted hover:text-burgundy transition-colors cursor-pointer"
                    title="Sao chép mã đơn"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Trạng thái: <strong>Chờ đặt cọc (60 phút)</strong></span>
                </div>
              </div>
            </div>

            {/* Grid 2 Columns: Order Details & Payment Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: Order Details */}
              <div className="rounded-2xl bg-white border border-line p-6 shadow-card space-y-5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-burgundy border-b border-line pb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-burgundy" />
                  <span>Chi Tiết Đơn Đặt Thuê</span>
                </h2>

                {/* Items */}
                <div className="space-y-3">
                  {booking.items && booking.items.length > 0 ? (
                    booking.items.map((it, idx) => (
                      <div
                        key={it.id || idx}
                        className="p-3.5 rounded-xl bg-ivory/60 border border-line text-xs space-y-1.5"
                      >
                        <div className="font-semibold text-ink text-sm">
                          {it.productName}
                        </div>
                        <div className="flex justify-between text-ink-muted">
                          <span>Phân loại / Size:</span>
                          <span className="font-medium text-ink">
                            {it.variantSize || "Tiêu chuẩn"}{" "}
                            {it.variantColor ? `• ${it.variantColor}` : ""}
                          </span>
                        </div>
                        {it.productItemCode && (
                          <div className="flex justify-between text-ink-muted">
                            <span>Mã hiện vật (Item):</span>
                            <span className="font-mono text-ink-muted">
                              {it.productItemCode}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl bg-ivory/60 text-xs text-ink">
                      Trang phục / Combo chụp ảnh đã chọn
                    </div>
                  )}
                </div>

                {/* Booking Meta */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start justify-between">
                    <span className="text-ink-muted flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-burgundy" />
                      Người đặt:
                    </span>
                    <span className="font-medium text-ink text-right">
                      {booking.customerName}
                    </span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-ink-muted flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-burgundy" />
                      Điện thoại:
                    </span>
                    <span className="font-medium text-ink text-right">
                      {booking.customerPhone}
                    </span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-ink-muted flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-burgundy" />
                      Thời gian thuê:
                    </span>
                    <span className="font-medium text-ink text-right">
                      {booking.rentalStartDate} đến {booking.rentalEndDate} ({booking.durationDays} ngày)
                    </span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-ink-muted flex items-center gap-1">
                      {booking.deliveryMethod === "PICKUP_STORE" ? (
                        <Building2 className="w-3.5 h-3.5 text-burgundy" />
                      ) : (
                        <Truck className="w-3.5 h-3.5 text-burgundy" />
                      )}
                      Hình thức nhận:
                    </span>
                    <span className="font-medium text-ink text-right max-w-[200px]">
                      {booking.deliveryMethod === "PICKUP_STORE"
                        ? "Nhận tại studio (18 Ngõ 120 Hoàng Hoa Thám)"
                        : `Giao tận nơi: ${booking.deliveryAddress || "Theo SĐT"}`}
                    </span>
                  </div>

                  {booking.note && (
                    <div className="pt-2 border-t border-line/60 text-ink-muted">
                      <span className="block text-[11px] font-medium text-ink">
                        Ghi chú riêng:
                      </span>
                      <p className="italic text-ink">{booking.note}</p>
                    </div>
                  )}
                </div>

                {/* Pricing Table */}
                <div className="pt-3 border-t border-line space-y-2 text-xs">
                  <div className="flex justify-between text-ink-muted">
                    <span>Tiền thuê đồ:</span>
                    <span className="font-medium text-ink">
                      {new Intl.NumberFormat("vi-VN").format(booking.totalRentalPrice)}đ
                    </span>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-burgundy" />
                      Tiền cọc bảo hiểm (hoàn 100%):
                    </span>
                    <span className="font-medium text-ink">
                      {new Intl.NumberFormat("vi-VN").format(booking.totalDepositPrice)}đ
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-line/60 font-semibold text-sm">
                    <span className="text-ink">Tổng thanh toán dự kiến:</span>
                    <span className="text-burgundy font-bold text-base">
                      {new Intl.NumberFormat("vi-VN").format(booking.totalAmount)}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Column 2: Bank Transfer & Payment Guide */}
              <div className="rounded-2xl bg-white border border-line p-6 shadow-card space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-burgundy border-b border-line pb-3 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-burgundy" />
                    <span>Hướng Dẫn Chuyển Khoản Cọc</span>
                  </h2>

                  <p className="text-xs text-ink-muted leading-relaxed">
                    Để đảm bảo tiệm giữ đúng mẫu và kích cỡ trang phục cho bạn, vui lòng chuyển khoản số tiền cọc{" "}
                    <strong className="text-burgundy font-semibold">
                      {new Intl.NumberFormat("vi-VN").format(booking.totalDepositPrice)}đ
                    </strong>{" "}
                    theo thông tin tài khoản dưới đây:
                  </p>

                  {/* Bank Details Bento Box */}
                  <div className="p-4 rounded-xl bg-ivory/70 border border-burgundy/20 space-y-3 text-xs">
                    <div>
                      <span className="text-ink-muted block text-[11px]">Ngân hàng thụ hưởng:</span>
                      <strong className="text-ink text-sm font-semibold">
                        MB Bank (Ngân hàng Quân Đội)
                      </strong>
                    </div>

                    <div>
                      <span className="text-ink-muted block text-[11px]">Số tài khoản:</span>
                      <div className="flex items-center justify-between">
                        <strong className="font-mono text-burgundy text-lg font-bold">
                          9999 8888 6666
                        </strong>
                        <button
                          type="button"
                          onClick={() => handleCopy("999988886666", "bank")}
                          className="px-2 py-1 rounded bg-white border border-line text-[11px] text-burgundy hover:bg-burgundy/5 cursor-pointer inline-flex items-center gap-1"
                        >
                          {copiedBank ? (
                            <>
                              <Check className="w-3 h-3 text-success" /> Đã chép
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Chép STK
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-ink-muted block text-[11px]">Chủ tài khoản:</span>
                      <strong className="text-ink font-semibold">
                        CHICKIE STUDIO - LE THI PHUONG ANH
                      </strong>
                    </div>

                    <div>
                      <span className="text-ink-muted block text-[11px]">Nội dung chuyển khoản:</span>
                      <div className="p-2 rounded bg-white border border-line font-mono font-bold text-burgundy text-xs flex justify-between items-center">
                        <span>{booking.bookingCode} {booking.customerPhone}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(`${booking.bookingCode} ${booking.customerPhone}`, "code")
                          }
                          className="text-[11px] text-ink-muted hover:text-burgundy cursor-pointer"
                        >
                          Chép
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-burgundy/5 border border-burgundy/15 text-xs text-ink-muted space-y-1 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-semibold text-burgundy">
                      <Clock className="w-4 h-4" />
                      <span>Thời gian giữ đơn: 60 phút</span>
                    </div>
                    <p className="text-[11px]">
                      Ngay sau khi nhận được chuyển khoản, nhân viên tiệm sẽ gọi điện hoặc nhắn tin Zalo xác nhận ngay cho bạn!
                    </p>
                  </div>
                </div>

                {/* Support hotline */}
                <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Phone className="w-4 h-4 text-burgundy" />
                    <span>Hỗ trợ nhanh: <strong>0987.654.321</strong> (Zalo/Hotline)</span>
                  </div>

                  <Link href="/products">
                    <Button variant="primary" size="md" className="w-full sm:w-auto">
                      Tiếp tục xem đồ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
