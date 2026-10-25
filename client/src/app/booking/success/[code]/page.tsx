"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  HelpCircle,
  Maximize2,
  Phone,
  QrCode,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
  X,
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
  const [copiedContent, setCopiedContent] = React.useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = React.useState<boolean>(false);

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

  const handleCopy = async (text: string, type: "code" | "bank" | "content") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else if (type === "bank") {
        setCopiedBank(true);
        setTimeout(() => setCopiedBank(false), 2000);
      } else {
        setCopiedContent(true);
        setTimeout(() => setCopiedContent(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  // VietQR Dynamic URL with amount, transfer memo and account details
  const qrUrl = React.useMemo(() => {
    if (!booking) return "";
    const memo = `${booking.bookingCode} ${booking.customerPhone || ""}`.trim();
    const addInfo = encodeURIComponent(memo);
    const accountName = encodeURIComponent("CHICKIE STUDIO");
    return `https://img.vietqr.io/image/MB-999988886666-compact2.png?amount=${booking.totalDepositPrice}&addInfo=${addInfo}&accountName=${accountName}`;
  }, [booking]);

  return (
    <div className="min-h-screen flex flex-col bg-warm-white">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Back navigation */}
        <div className="mb-3 sm:mb-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-burgundy transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại danh mục sản phẩm</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-line shadow-card space-y-3">
            <div className="w-8 h-8 mx-auto border-3 border-burgundy border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-ink-muted">Đang tải hóa đơn đơn hàng...</p>
          </div>
        ) : error || !booking ? (
          <div className="p-6 sm:p-8 text-center rounded-2xl bg-white border border-line shadow-card space-y-3.5">
            <div className="w-10 h-10 mx-auto rounded-full bg-danger/10 text-danger flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-danger" />
            </div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-ink">
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
          <div className="space-y-4 sm:space-y-5">
            {/* Header Hero Banner */}
            <div className="rounded-2xl bg-white border border-line p-4 sm:p-5 shadow-card text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-success/10 text-success flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-success" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-success/10 text-success text-[11px] font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Đặt Thuê Thành Công</span>
                </div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                  Biên Nhận Giữ Đồ Chickie Studio
                </h1>
                <p className="text-xs text-ink-muted max-w-lg mx-auto">
                  Cảm ơn bạn đã tin tưởng Chickie Studio! Đơn hàng của bạn đã được ghi nhận trên hệ thống và đang chờ đối soát cọc.
                </p>
              </div>

              {/* Code Pill & Status Badge */}
              <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-ivory border border-burgundy/20">
                  <span className="text-xs text-ink-muted">Mã đơn:</span>
                  <span className="font-mono font-bold text-burgundy text-sm sm:text-base">
                    {booking.bookingCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(booking.bookingCode, "code")}
                    className="p-1 text-ink-muted hover:text-burgundy transition-colors cursor-pointer"
                    title="Sao chép mã đơn"
                    aria-label="Sao chép mã đơn"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Trạng thái: <strong>Chờ đặt cọc (60 phút)</strong></span>
                </div>
              </div>
            </div>

            {/* Grid 2 Columns: Order Details & Payment Guide - Balanced Bento Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
              {/* Column 1: Order Details */}
              <div className="rounded-2xl bg-white border border-line p-4 sm:p-5 shadow-card flex flex-col justify-between">
                <div className="space-y-3.5">
                  <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-burgundy border-b border-line pb-2.5 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-burgundy" />
                    <span>Chi Tiết Đơn Đặt Thuê</span>
                  </h2>

                  {/* Items list */}
                  <div className="space-y-2">
                    {booking.items && booking.items.length > 0 ? (
                      booking.items.map((it, idx) => (
                        <div
                          key={it.id || idx}
                          className="p-3 rounded-xl bg-ivory/60 border border-line text-xs space-y-1"
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
                        Trang phục / Thiết bị / Combo đã chọn
                      </div>
                    )}
                  </div>

                  {/* Customer & Delivery Meta */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <span className="text-ink-muted flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-burgundy shrink-0" />
                        Người đặt:
                      </span>
                      <span className="font-medium text-ink text-right">
                        {booking.customerName}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-ink-muted flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-burgundy shrink-0" />
                        Điện thoại:
                      </span>
                      <span className="font-medium text-ink text-right">
                        {booking.customerPhone}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-ink-muted flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-burgundy shrink-0" />
                        Thời gian thuê:
                      </span>
                      <span className="font-medium text-ink text-right">
                        {booking.rentalStartDate} đến {booking.rentalEndDate} ({booking.durationDays} ngày)
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <span className="text-ink-muted flex items-center gap-1.5">
                        {booking.deliveryMethod === "PICKUP_STORE" ? (
                          <Building2 className="w-3.5 h-3.5 text-burgundy shrink-0" />
                        ) : (
                          <Truck className="w-3.5 h-3.5 text-burgundy shrink-0" />
                        )}
                        Hình thức nhận:
                      </span>
                      <span className="font-medium text-ink text-right max-w-[210px]">
                        {booking.deliveryMethod === "PICKUP_STORE"
                          ? "Nhận tại tiệm (120 Hoàng Cầu)"
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
                </div>

                {/* Pricing Table pinned at bottom */}
                <div className="pt-3.5 mt-3 border-t border-line space-y-1.5 text-xs">
                  <div className="flex justify-between text-ink-muted">
                    <span>Tiền thuê đồ:</span>
                    <span className="font-medium text-ink">
                      {new Intl.NumberFormat("vi-VN").format(booking.totalRentalPrice)}đ
                    </span>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-burgundy shrink-0" />
                      Tiền cọc bảo hiểm (hoàn 100%):
                    </span>
                    <span className="font-medium text-ink">
                      {new Intl.NumberFormat("vi-VN").format(booking.totalDepositPrice)}đ
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-line/60 font-semibold text-xs sm:text-sm">
                    <span className="text-ink">Tổng thanh toán dự kiến:</span>
                    <span className="text-burgundy font-bold text-sm sm:text-base">
                      {new Intl.NumberFormat("vi-VN").format(booking.totalAmount)}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Column 2: Bank Transfer & Payment Guide with VietQR Code */}
              <div className="rounded-2xl bg-white border border-line p-4 sm:p-5 shadow-card flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="border-b border-line pb-2.5 flex items-center justify-between">
                    <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-burgundy flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-burgundy" />
                      <span>Hướng Dẫn Chuyển Khoản Cọc</span>
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      VietQR Tự Động
                    </span>
                  </div>

                  <p className="text-xs text-ink-muted leading-relaxed">
                    Vui lòng quét mã QR hoặc chuyển khoản số tiền cọc{" "}
                    <strong className="text-burgundy font-semibold">
                      {new Intl.NumberFormat("vi-VN").format(booking.totalDepositPrice)}đ
                    </strong>{" "}
                    để tiệm tiến hành giữ trang phục & thiết bị cho bạn:
                  </p>

                  {/* Balanced Bento Box: QR Code Side-by-Side with Account Details */}
                  <div className="rounded-xl bg-ivory/70 border border-burgundy/20 p-3 sm:p-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
                      {/* Left: Dynamic VietQR Card */}
                      <div className="sm:col-span-5 flex flex-col items-center justify-center text-center">
                        <div
                          onClick={() => setIsQrModalOpen(true)}
                          className="relative group p-1.5 bg-white rounded-xl border border-line shadow-2xs hover:shadow-md hover:border-burgundy/40 transition-all cursor-pointer"
                          title="Nhấp để phóng to mã QR"
                        >
                          <Image
                            src={qrUrl}
                            alt="Mã QR chuyển khoản cọc VietQR Chickie Studio"
                            width={160}
                            height={160}
                            className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-lg mx-auto"
                            priority
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity">
                            <span className="p-1.5 bg-white/90 rounded-full shadow text-burgundy">
                              <Maximize2 className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>

                        <div className="mt-1.5 flex flex-col items-center gap-0.5">
                          <span className="text-[10.5px] text-ink-muted">
                            Quét bằng mọi App Ngân hàng
                          </span>
                          <div className="flex items-center gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => setIsQrModalOpen(true)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-burgundy hover:underline cursor-pointer"
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span>Phóng to</span>
                            </button>
                            <span className="text-ink-muted/50">•</span>
                            <a
                              href={qrUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={`VietQR-${booking.bookingCode}.png`}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-burgundy hover:underline cursor-pointer"
                            >
                              <Download className="w-3 h-3" />
                              <span>Tải ảnh</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Right: Bank Account Details */}
                      <div className="sm:col-span-7 space-y-2 text-xs border-t sm:border-t-0 sm:border-l border-line/70 pt-2.5 sm:pt-0 sm:pl-3.5">
                        <div>
                          <span className="text-ink-muted block text-[10.5px]">
                            Ngân hàng thụ hưởng:
                          </span>
                          <strong className="text-ink text-xs sm:text-sm font-semibold">
                            MB Bank (Ngân hàng Quân Đội)
                          </strong>
                        </div>

                        <div>
                          <span className="text-ink-muted block text-[10.5px]">Số tài khoản:</span>
                          <div className="flex items-center justify-between mt-0.5">
                            <strong className="font-mono text-burgundy text-sm sm:text-base font-bold tracking-tight">
                              9999 8888 6666
                            </strong>
                            <button
                              type="button"
                              onClick={() => handleCopy("999988886666", "bank")}
                              className="px-2 py-0.5 rounded-md bg-white border border-line text-[11px] text-burgundy hover:bg-burgundy/5 cursor-pointer inline-flex items-center gap-1 font-medium transition-colors shadow-2xs"
                              aria-label="Sao chép số tài khoản"
                            >
                              {copiedBank ? (
                                <>
                                  <Check className="w-3 h-3 text-success" />
                                  <span>Đã chép</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Chép STK</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-ink-muted block text-[10.5px]">Chủ tài khoản:</span>
                          <strong className="text-ink font-semibold text-xs mt-0.5 block">
                            CHICKIE STUDIO - LE THI PHUONG ANH
                          </strong>
                        </div>

                        <div>
                          <span className="text-ink-muted block text-[10.5px]">
                            Nội dung chuyển khoản (Bắt buộc):
                          </span>
                          <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-line font-mono font-bold text-burgundy text-xs flex justify-between items-center shadow-2xs">
                            <span className="truncate pr-1">
                              {booking.bookingCode} {booking.customerPhone}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  `${booking.bookingCode} ${booking.customerPhone}`,
                                  "content"
                                )
                              }
                              className="text-[11px] text-ink-muted hover:text-burgundy cursor-pointer px-1 py-0.5 shrink-0 inline-flex items-center gap-1 rounded hover:bg-ivory transition-colors"
                              title="Sao chép nội dung"
                              aria-label="Sao chép nội dung chuyển khoản"
                            >
                              {copiedContent ? (
                                <Check className="w-3.5 h-3.5 text-success" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>Chép</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 60 minutes notice */}
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-0.5 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Thời gian giữ đơn: 60 phút</span>
                    </div>
                    <p className="text-[11px] text-amber-800/90 pl-5">
                      Sau khi nhận được tiền cọc, nhân viên Chickie Studio sẽ gọi điện hoặc nhắn tin Zalo xác nhận ngay cho bạn!
                    </p>
                  </div>
                </div>

                {/* Support hotline & Action buttons pinned at bottom */}
                <div className="pt-3.5 mt-3 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2 text-ink-muted w-full sm:w-auto justify-center sm:justify-start">
                    <Phone className="w-3.5 h-3.5 text-burgundy shrink-0" />
                    <span>Hỗ trợ: <strong className="text-ink font-semibold">0987.654.321</strong></span>
                  </div>

                  <Link href="/products" className="w-full sm:w-auto">
                    <Button variant="primary" size="md" className="w-full sm:w-auto font-medium">
                      Tiếp tục xem đồ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal phóng to mã QR */}
      {isQrModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mã QR chuyển khoản cọc phóng to"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl border border-line shadow-2xl p-5 max-w-sm w-full text-center space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-ink-muted hover:text-ink hover:bg-ivory transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-burgundy/10 text-burgundy text-[11px] font-semibold">
                <QrCode className="w-3 h-3" />
                <span>VietQR Napas 247</span>
              </div>
              <h3 className="text-base font-serif font-bold text-ink mt-1">
                Quét Mã Chuyển Khoản Cọc
              </h3>
              <p className="text-xs text-ink-muted">
                Số tiền: <strong className="text-burgundy">{new Intl.NumberFormat("vi-VN").format(booking?.totalDepositPrice || 0)}đ</strong>
              </p>
            </div>

            {/* QR Image Large */}
            <div className="p-2 bg-ivory rounded-xl border border-line inline-block">
              <Image
                src={qrUrl}
                alt="Mã QR chuyển khoản cọc VietQR Chickie Studio phóng to"
                width={300}
                height={300}
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain mx-auto rounded-lg"
                unoptimized
              />
            </div>

            <div className="text-xs text-ink-muted space-y-1">
              <p className="font-mono font-bold text-burgundy">
                MB Bank: 9999 8888 6666
              </p>
              <p>CHICKIE STUDIO - LE THI PHUONG ANH</p>
              <p className="font-mono text-[11px] bg-ivory py-1 px-2 rounded border border-line inline-block">
                Nội dung: {booking?.bookingCode} {booking?.customerPhone}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <a
                href={qrUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={`VietQR-${booking?.bookingCode}.png`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-burgundy text-white text-xs font-semibold hover:bg-burgundy/90 transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải ảnh mã QR</span>
              </a>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsQrModalOpen(false)}
                className="px-4"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

