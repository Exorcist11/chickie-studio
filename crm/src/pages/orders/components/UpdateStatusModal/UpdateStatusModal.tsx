import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Modal } from "../../../../components/common/Modal";
import { StatusBadge } from "../../../../components/common/StatusBadge";
import { Button } from "../../../../components/ui/Button";
import { TextArea } from "../../../../components/ui/TextArea";
import { BookingResponse, BookingStatus, UpdateBookingStatusInput } from "../../../../types/booking";
import styles from "./UpdateStatusModal.module.scss";

export interface UpdateStatusModalProps {
  open: boolean;
  booking: BookingResponse | null;
  targetStatus: BookingStatus | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (data: UpdateBookingStatusInput) => Promise<void>;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  open,
  booking,
  targetStatus,
  loading = false,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNote("");
      setError(null);
    }
  }, [open]);

  if (!booking || !targetStatus) return null;

  const isCancelled = targetStatus === "CANCELLED";

  const handleConfirm = async () => {
    if (isCancelled && !note.trim()) {
      setError(t("orders.updateStatus.reasonRequired"));
      return;
    }
    setError(null);
    await onConfirm({
      status: targetStatus,
      note: note.trim() || undefined,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("orders.updateStatus.title")}
      maxWidth="md"
      footer={
        <div className={styles.footerActions}>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant={isCancelled ? "destructive" : "primary"}
            onClick={handleConfirm}
            loading={loading}
          >
            {t("common.confirm")}
          </Button>
        </div>
      }
    >
      <div className={styles.modalContent}>
        <div className={styles.transitionBox}>
          <div className={styles.statusCol}>
            <span className={styles.colLabel}>{t("orders.updateStatus.from")}</span>
            <StatusBadge type="order" status={booking.status} />
          </div>
          <div className={styles.arrowIcon}>
            <ArrowRight className="w-5 h-5 text-stone-400" />
          </div>
          <div className={styles.statusCol}>
            <span className={styles.colLabel}>{t("orders.updateStatus.to")}</span>
            <StatusBadge type="order" status={targetStatus} />
          </div>
        </div>

        <p className={styles.confirmPrompt}>
          {t("orders.updateStatus.confirmPrompt")}{" "}
          <span className={styles.orderCode}>{booking.bookingCode}</span>?
        </p>

        {isCancelled && (
          <div className={styles.warningAlert} role="alert">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className={styles.warningText}>
              Khi hủy đơn thuê, các món đồ thực tế liên kết sẽ được tự động giải phóng về trạng thái Sẵn sàng trong kho.
            </p>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="status-note" className={styles.label}>
            {t("orders.updateStatus.reasonLabel")}{" "}
            {isCancelled && <span className={styles.requiredAsterisk}>*</span>}
          </label>
          <TextArea
            id="status-note"
            rows={3}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (error) setError(null);
            }}
            placeholder={t("orders.updateStatus.reasonPlaceholder")}
            error={error || undefined}
          />
        </div>
      </div>
    </Modal>
  );
};
