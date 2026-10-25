import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Copy,
  Check,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Package,
  History,
  FileText,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Modal } from "../../../../components/common/Modal";
import { StatusBadge } from "../../../../components/common/StatusBadge";
import { Button } from "../../../../components/ui/Button";
import { BookingResponse, BookingStatus } from "../../../../types/booking";
import styles from "./BookingDetailModal.module.scss";

export interface BookingDetailModalProps {
  open: boolean;
  booking: BookingResponse | null;
  onClose: () => void;
  onRequestStatusChange: (targetStatus: BookingStatus) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  open,
  booking,
  onClose,
  onRequestStatusChange,
}) => {
  const { t } = useTranslation();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBarcode, setCopiedBarcode] = useState<string | null>(null);

  if (!booking) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(booking.bookingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyBarcode = async (barcode: string) => {
    try {
      await navigator.clipboard.writeText(barcode);
      setCopiedBarcode(barcode);
      setTimeout(() => setCopiedBarcode(null), 2000);
    } catch {
      // Fallback
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Đơn có thể hủy nếu chưa bàn giao đồ
  const canCancel =
    booking.status === "PENDING" ||
    booking.status === "CONFIRMED" ||
    booking.status === "DEPOSITED";

  const renderPrimaryAction = () => {
    switch (booking.status) {
      case "PENDING":
        return (
          <Button
            variant="primary"
            onClick={() => onRequestStatusChange("CONFIRMED")}
          >
            {t("orders.actionsBtn.approve")}
          </Button>
        );
      case "CONFIRMED":
        return (
          <Button
            variant="primary"
            onClick={() => onRequestStatusChange("DEPOSITED")}
          >
            {t("orders.actionsBtn.deposit")}
          </Button>
        );
      case "DEPOSITED":
        return (
          <Button
            variant="primary"
            onClick={() => onRequestStatusChange("DELIVERED")}
          >
            {t("orders.actionsBtn.deliver")}
          </Button>
        );
      case "DELIVERED":
      case "OVERDUE":
        return (
          <Button
            variant="primary"
            onClick={() => onRequestStatusChange("RETURNED")}
          >
            {t("orders.actionsBtn.return")}
          </Button>
        );
      case "RETURNED":
        return (
          <Button
            variant="primary"
            className={styles.completeBtn}
            onClick={() => onRequestStatusChange("COMPLETED")}
          >
            {t("orders.actionsBtn.complete")}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className={styles.modalHeaderTitle}>
          <div className={styles.codeWrapper}>
            <span className={styles.codeText}>{booking.bookingCode}</span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={handleCopyCode}
              title="Sao chép mã đơn"
              aria-label="copy-booking-code"
            >
              {copiedCode ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-stone-500" />
              )}
            </button>
          </div>
          <StatusBadge type="order" status={booking.status} />
        </div>
      }
      subtitle={
        <span className={styles.createdTime}>
          {t("orders.detail.createdAt")}: {new Date(booking.createdAt).toLocaleString("vi-VN")}
        </span>
      }
      maxWidth="xl"
      footer={
        <div className={styles.modalFooter}>
          <div className={styles.leftActions}>
            {canCancel && (
              <Button
                variant="outline"
                className={styles.cancelBookingBtn}
                onClick={() => onRequestStatusChange("CANCELLED")}
              >
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>{t("orders.actionsBtn.cancelBooking")}</span>
              </Button>
            )}
          </div>
          <div className={styles.rightActions}>
            <Button variant="outline" onClick={onClose}>
              {t("common.close")}
            </Button>
            {renderPrimaryAction()}
          </div>
        </div>
      }
    >
      <div className={styles.modalBody}>
        {/* Customer & Delivery Card */}
        <div className={styles.cardSection}>
          <h4 className={styles.sectionTitle}>
            <User className="w-4 h-4 text-burgundy" />
            {t("orders.detail.customerInfo")}
          </h4>
          <div className={styles.customerGrid}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t("orders.customer")}:</span>
              <span className={styles.infoValueBold}>{booking.customerName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t("orders.phone")}:</span>
              <a href={`tel:${booking.customerPhone}`} className={styles.phoneLink}>
                <Phone className="w-3.5 h-3.5" />
                {booking.customerPhone}
              </a>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>{t("orders.deliveryMethod")}:</span>
              <span className={styles.deliveryBadge}>
                <MapPin className="w-3.5 h-3.5" />
                {booking.deliveryMethod === "PICKUP_STORE"
                  ? t("orders.pickupStore")
                  : t("orders.shipToAddress")}
              </span>
            </div>
            {booking.deliveryAddress && (
              <div className={styles.infoRowFull}>
                <span className={styles.infoLabel}>{t("orders.detail.address")}:</span>
                <span className={styles.infoValue}>{booking.deliveryAddress}</span>
              </div>
            )}
            <div className={styles.infoRowFull}>
              <span className={styles.infoLabel}>
                <Calendar className="w-3.5 h-3.5 text-burgundy inline mr-1" />
                {t("orders.rentalPeriod")}:
              </span>
              <span className={styles.dateRangeBadge}>
                <span>{formatDate(booking.rentalStartDate)}</span>
                <ArrowRight className="w-3.5 h-3.5 text-burgundy shrink-0 inline mx-1.5" />
                <span>{formatDate(booking.rentalEndDate)}</span>
                <span className={styles.durationPill}>
                  {booking.durationDays} {t("orders.days")}
                </span>
              </span>
            </div>
            {booking.note && (
              <div className={styles.infoRowFull}>
                <span className={styles.infoLabel}>{t("orders.detail.note")}:</span>
                <p className={styles.noteText}>{booking.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Rented Items */}
        <div className={styles.cardSection}>
          <h4 className={styles.sectionTitle}>
            <Package className="w-4 h-4 text-burgundy" />
            {t("orders.detail.itemsInfo")}
          </h4>
          {booking.items && booking.items.length > 0 ? (
            <div className={styles.itemsList}>
              {booking.items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemMain}>
                    <span className={styles.itemName}>
                      {item.productName || "Sản phẩm thuê"}
                    </span>
                    <div className={styles.itemTags}>
                      {item.variantSize && (
                        <span className={styles.variantTag}>Size {item.variantSize}</span>
                      )}
                      {item.variantColor && (
                        <span className={styles.variantTag}>{item.variantColor}</span>
                      )}
                      {item.productItemCode && (
                        <span className={styles.barcodeTag}>
                          <Sparkles className="w-3 h-3 text-gold" />
                          Barcode: {item.productItemCode}
                          <button
                            type="button"
                            className={styles.copyInlineBtn}
                            onClick={() => handleCopyBarcode(item.productItemCode!)}
                            title="Sao chép Barcode"
                            aria-label={`copy-barcode-${item.productItemCode}`}
                          >
                            {copiedBarcode === item.productItemCode ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-stone-400" />
                            )}
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.itemPricing}>
                    <div className={styles.pricingRow}>
                      <span className={styles.pricingLabel}>{t("orders.detail.price")}:</span>
                      <span className={styles.pricingVal}>
                        {formatCurrency(item.rentalPrice)}
                      </span>
                    </div>
                    <div className={styles.pricingRow}>
                      <span className={styles.pricingLabel}>{t("orders.detail.deposit")}:</span>
                      <span className={styles.depositVal}>
                        {formatCurrency(item.depositPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyItemsText}>{t("orders.detail.noItems")}</p>
          )}

          {/* Pricing Total Summary */}
          <div className={styles.pricingSummaryBox}>
            <div className={styles.summaryRow}>
              <span>{t("orders.totalRentalPrice")}:</span>
              <span>{formatCurrency(booking.totalRentalPrice)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>{t("orders.totalDepositPrice")}:</span>
              <span>{formatCurrency(booking.totalDepositPrice)}</span>
            </div>
            <div className={styles.summaryTotalRow}>
              <span>{t("orders.totalAmount")}:</span>
              <span className={styles.totalAmountVal}>
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Audit Trail / History */}
        <div className={styles.cardSection}>
          <h4 className={styles.sectionTitle}>
            <History className="w-4 h-4 text-burgundy" />
            {t("orders.detail.timelineInfo")}
          </h4>
          {booking.statusHistories && booking.statusHistories.length > 0 ? (
            <div className={styles.timelineList}>
              {booking.statusHistories.map((h, idx) => (
                <div key={h.id || idx} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <div className={styles.transitionBadges}>
                        {h.fromStatus && (
                          <>
                            <StatusBadge type="order" status={h.fromStatus} size="sm" />
                            <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0 inline mx-0.5" />
                          </>
                        )}
                        <StatusBadge type="order" status={h.toStatus} size="sm" />
                      </div>
                      <span className={styles.timelineTime}>
                        {new Date(h.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className={styles.timelineMeta}>
                      <span className={styles.changedByText}>
                        Bởi: <strong>{h.changedBy || "Hệ thống"}</strong>
                      </span>
                      {h.note && <span className={styles.historyNote}>"{h.note}"</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyItemsText}>{t("orders.detail.noHistory")}</p>
          )}
        </div>
      </div>
    </Modal>
  );
};
