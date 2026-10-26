"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2, Copy, ExternalLink, Mail, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui";
import { BookingResponse } from "@/types/booking";
import { BusinessPillar, PILLAR_CONFIGS } from "../product-pillar.config";

export interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingResponse | null;
  productName?: string;
  pillar?: BusinessPillar;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  onClose,
  booking,
  productName,
  pillar = "COSTUME",
}) => {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = React.useState<boolean>(false);
  const [copiedNote, setCopiedNote] = React.useState<boolean>(false);
  const [copiedBank, setCopiedBank] = React.useState<boolean>(false);

  const activePillar = pillar || "COSTUME";
  const pillarConfig = PILLAR_CONFIGS[activePillar].booking;

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // VietQR Dynamic URL with amount, transfer memo and account details
  const qrUrl = React.useMemo(() => {
    if (!booking) return "";
    const memo = `${booking.bookingCode} ${booking.customerPhone || ""}`.trim();
    const addInfo = encodeURIComponent(memo);
    const accountName = encodeURIComponent("CHICKIE STUDIO");
    return `https://img.vietqr.io/image/MB-999988886666-compact2.png?amount=${booking.totalDepositPrice || 0}&addInfo=${addInfo}&accountName=${accountName}`;
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleCopy = async (text: string, type: "code" | "note" | "bank") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else if (type === "bank") {
        setCopiedBank(true);
        setTimeout(() => setCopiedBank(false), 2000);
      } else {
        setCopiedNote(true);
        setTimeout(() => setCopiedNote(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handleViewReceipt = () => {
    onClose();
    router.push(`/booking/success/${booking.bookingCode}`);
  };

  const displayProductName =
    productName || booking.items?.[0]?.productName || "Sản phẩm đặt thuê";
  const displayCustomer = `${booking.customerName || ""} - ${booking.customerPhone || ""}`.trim();
  const displayDates = `${booking.rentalStartDate} đến ${booking.rentalEndDate} (${booking.durationDays || 1} ${pillarConfig.durationUnitLabel})`;
  const displayDelivery =
    booking.deliveryMethod === "SHIP_TO_ADDRESS"
      ? booking.deliveryAddress
        ? `Giao hàng tận nơi: ${booking.deliveryAddress}`
        : "Giao hàng tận nơi"
      : "Nhận tại Studio (120 Hoàng Cầu)";
  const displayDeposit = new Intl.NumberFormat("vi-VN").format(booking.totalDepositPrice || 0);
  const transferContent = `${booking.bookingCode} ${booking.customerPhone || ""}`.trim();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl sm:max-w-2xl rounded-2xl bg-white p-4 sm:p-5 sm:px-6 shadow-2xl border border-line space-y-3.5 my-auto max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-ink-muted hover:text-ink p-1.5 rounded-full hover:bg-ivory transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 mx-auto rounded-full bg-success/10 text-success flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>

          <div className="space-y-0.5">
            <h3
              id="success-modal-title"
              className="font-serif text-lg sm:text-xl font-bold text-ink"
            >
              {pillarConfig.successModalTitle}
            </h3>
            <p className="text-xs text-ink-muted">
              {pillarConfig.successModalSubtitle}
            </p>
          </div>

          {/* Booking Code Banner */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy/10 border border-burgundy/20 text-burgundy text-xs font-semibold">
            <span>Mã đơn:</span>
            <span className="font-mono text-sm tracking-wide font-bold">
              {booking.bookingCode}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(booking.bookingCode, "code")}
              className="p-1 hover:bg-burgundy/20 rounded-md transition-colors cursor-pointer"
              title="Sao chép mã"
            >
              {copiedCode ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Summary Details */}
        <div className="rounded-xl bg-ivory/60 border border-line p-3 space-y-1.5 text-xs">
          <div className="flex justify-between items-center py-0.5 border-b border-line/40">
            <span className="text-ink-muted">Sản phẩm:</span>
            <span className="font-semibold text-ink text-right max-w-[340px] truncate">
              {displayProductName}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-line/40">
            <span className="text-ink-muted">Khách thuê:</span>
            <span className="font-medium text-ink">
              {displayCustomer}
            </span>
          </div>
          {booking.customerEmail && (
            <div className="flex justify-between items-center py-0.5 border-b border-line/40">
              <span className="text-ink-muted">Email nhận vé:</span>
              <span className="font-medium text-ink truncate max-w-[260px]">
                {booking.customerEmail}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center py-0.5 border-b border-line/40">
            <span className="text-ink-muted">Thời gian:</span>
            <span className="font-medium text-ink">
              {displayDates}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-line/40">
            <span className="text-ink-muted">Hình thức nhận:</span>
            <span className="font-medium text-ink">
              {displayDelivery}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 font-semibold text-xs sm:text-sm">
            <span className="text-ink">Cọc cần chuyển khoản:</span>
            <span className="text-burgundy font-bold">
              {displayDeposit}đ
            </span>
          </div>
        </div>

        {/* Bank Transfer Box with VietQR Image */}
        <div className="rounded-xl border border-burgundy/25 bg-burgundy/5 p-3 sm:p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-burgundy border-b border-burgundy/15 pb-1.5">
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 shrink-0" />
              <span>Thông tin chuyển khoản cọc giữ đồ:</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-burgundy/10 text-burgundy rounded-full font-semibold">
              VietQR 24/7
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* QR Code Left */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
              <div className="p-1 bg-white rounded-xl border border-burgundy/20 shadow-2xs">
                <Image
                  src={qrUrl}
                  alt="Mã QR chuyển khoản cọc giữ đồ"
                  width={120}
                  height={120}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-lg mx-auto"
                  priority
                  unoptimized
                />
              </div>
              <span className="text-[10px] text-ink-muted mt-1">
                Quét bằng mọi App Ngân hàng
              </span>
            </div>

            {/* Account Details Right */}
            <div className="sm:col-span-8 space-y-1.5 text-xs sm:border-l sm:border-burgundy/15 sm:pl-3">
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <div>
                  <span className="text-[10.5px] text-ink-muted block">Ngân hàng:</span>
                  <strong className="text-ink text-xs font-semibold block truncate">
                    MB Bank (Quân Đội)
                  </strong>
                </div>
                <div>
                  <span className="text-[10.5px] text-ink-muted block">Chủ tài khoản:</span>
                  <strong className="text-ink text-xs font-semibold block uppercase truncate">
                    CHICKIE STUDIO
                  </strong>
                </div>
              </div>

              <div>
                <span className="text-[10.5px] text-ink-muted block">Số tài khoản:</span>
                <div className="flex items-center justify-between mt-0.5">
                  <strong className="font-mono font-bold text-burgundy text-xs sm:text-sm">
                    9999 8888 6666
                  </strong>
                  <button
                    type="button"
                    onClick={() => handleCopy("999988886666", "bank")}
                    className="px-2 py-0.5 rounded bg-white border border-burgundy/20 text-[10.5px] font-medium text-burgundy hover:bg-burgundy/10 cursor-pointer inline-flex items-center gap-1 transition-colors"
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
                <span className="text-[10.5px] text-ink-muted block">Nội dung CK:</span>
                <div className="flex items-center justify-between gap-1 mt-0.5 bg-white p-1 sm:p-1.5 rounded-lg border border-burgundy/20">
                  <span className="font-mono font-bold text-burgundy text-xs truncate max-w-[190px]">
                    {transferContent}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(transferContent, "note")}
                    className="px-1.5 py-0.5 hover:bg-burgundy/10 text-burgundy rounded text-[10.5px] font-medium transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1"
                    title="Sao chép nội dung chuyển khoản"
                    aria-label="Sao chép nội dung chuyển khoản"
                  >
                    {copiedNote ? (
                      <Check className="w-3 h-3 text-success" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Chép</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Notification Notice Banner */}
        {booking.customerEmail && (
          <div className="p-2.5 rounded-xl bg-ivory/90 border border-gold/40 flex items-start gap-2.5 text-xs text-ink-muted">
            <Mail className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-ink block">Hóa đơn điện tử & mã VietQR đã được gửi tự động</span>
              <span>
                Vui lòng kiểm tra email <strong className="text-burgundy font-medium">{booking.customerEmail}</strong> để xem chi tiết vé thuê và hướng dẫn cọc.
              </span>
            </div>
          </div>
        )}

        {/* Actions: 2 buttons có cùng chiều dài và icon cùng 1 hàng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 w-full">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            className="w-full justify-center"
          >
            Đóng
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleViewReceipt}
            rightIcon={<ExternalLink className="w-4 h-4 shrink-0" />}
            className="w-full justify-center whitespace-nowrap"
          >
            Xem hóa đơn chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
};
