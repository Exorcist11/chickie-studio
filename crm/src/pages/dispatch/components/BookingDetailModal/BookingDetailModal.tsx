import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../../components/common/Modal";
import { StatusBadge } from "../../../../components/common/StatusBadge";
import { Button } from "../../../../components/ui/Button";
import { CalendarBookingDto, CalendarItemDto } from "../../../../types/dispatch";
import { formatCurrencyVND } from "../../../../components/ui/CurrencyField/CurrencyField.utils";
import styles from "./BookingDetailModal.module.scss";

export interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: CalendarBookingDto | null;
  onReschedule?: (booking: CalendarBookingDto) => void;
  onReassign?: (booking: CalendarBookingDto, item: CalendarItemDto) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
  onReschedule,
  onReassign,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!booking) return null;

  const canEdit =
    booking.status === "PENDING" ||
    booking.status === "CONFIRMED" ||
    booking.status === "DEPOSITED";

  const handleGoToOrder = () => {
    navigate(`/orders?search=${encodeURIComponent(booking.bookingCode)}`);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Chi tiết đơn: ${booking.bookingCode}`}
      subtitle="Xem thông tin đơn đặt cọc, thời gian thuê và danh sách hiện vật kho"
      maxWidth="lg"
    >
      <div className={styles.bookingDetailModal}>
        {/* Thông tin đơn hàng & Khách hàng */}
        <div className={styles.bookingDetailModal__gridInfo}>
          <div className={styles.bookingDetailModal__infoItem}>
            <span className={styles.bookingDetailModal__infoLabel}>Mã đơn hàng</span>
            <div className="flex items-center gap-2">
              <span className={styles.bookingDetailModal__infoValue}>{booking.bookingCode}</span>
              <StatusBadge type="order" status={booking.status} size="sm" />
            </div>
          </div>

          <div className={styles.bookingDetailModal__infoItem}>
            <span className={styles.bookingDetailModal__infoLabel}>Khách hàng</span>
            <span className={styles.bookingDetailModal__infoValue}>{booking.customerName}</span>
          </div>

          <div className={styles.bookingDetailModal__infoItem}>
            <span className={styles.bookingDetailModal__infoLabel}>Số điện thoại</span>
            <span className={styles.bookingDetailModal__infoValue}>{booking.customerPhone}</span>
          </div>

          <div className={styles.bookingDetailModal__infoItem}>
            <span className={styles.bookingDetailModal__infoLabel}>Thời gian thuê</span>
            <span className={styles.bookingDetailModal__infoValue}>
              {booking.rentalStartDate} → {booking.rentalEndDate}
            </span>
          </div>

          <div className={styles.bookingDetailModal__infoItem}>
            <span className={styles.bookingDetailModal__infoLabel}>Tiền thuê</span>
            <span className={styles.bookingDetailModal__infoValue}>
              {formatCurrencyVND(booking.totalRentalPrice)} đ
            </span>
          </div>

          <div className={styles.bookingDetailModal__infoItem}>
            <span className={styles.bookingDetailModal__infoLabel}>Tiền cọc</span>
            <span className={styles.bookingDetailModal__infoValue}>
              {formatCurrencyVND(booking.totalDepositPrice)} đ
            </span>
          </div>

          <div className={styles.bookingDetailModal__infoItem}>
            <span className={styles.bookingDetailModal__infoLabel}>Tổng tiền</span>
            <span className="text-base font-bold text-burgundy">
              {formatCurrencyVND(booking.totalAmount)} đ
            </span>
          </div>

          <div className={styles.bookingDetailModal__infoItem}>
            <span className={styles.bookingDetailModal__infoLabel}>Số lượng món</span>
            <span className={styles.bookingDetailModal__infoValue}>{booking.itemCount} món</span>
          </div>
        </div>

        {/* Danh sách hiện vật kho */}
        <div className={styles.bookingDetailModal__itemsList}>
          <div className={styles.bookingDetailModal__itemsTitle}>
            Danh sách trang phục / thiết bị trong đơn ({booking.items.length})
          </div>

          {booking.items.map((item) => (
            <div key={item.bookingItemId} className={styles.bookingDetailModal__itemCard}>
              <div className={styles.bookingDetailModal__itemInfo}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={styles.bookingDetailModal__itemName}>{item.productName}</span>
                  <span className={styles.bookingDetailModal__barcodeBadge}>{item.barcode}</span>
                </div>
                <div className={styles.bookingDetailModal__itemVariant}>
                  Phân loại: {item.variantInfo || "Mặc định"} • Tiền thuê: {formatCurrencyVND(item.rentalPrice)} đ
                </div>
              </div>

              {canEdit && onReassign && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReassign(booking, item)}
                >
                  {t("dispatch.reassignItem")}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.bookingDetailModal__footer}>
          <Button variant="secondary" onClick={handleGoToOrder}>
            {t("dispatch.viewBookingDetails")}
          </Button>

          <div className={styles.bookingDetailModal__actionsRight}>
            {canEdit && onReschedule && (
              <Button
                variant="primary"
                onClick={() => onReschedule(booking)}
              >
                {t("dispatch.reschedule")}
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              {t("common.close")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
