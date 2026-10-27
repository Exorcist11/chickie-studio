import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../../../components/common/Modal";
import { Button } from "../../../../components/ui/Button";
import { Spinner } from "../../../../components/ui/Spinner";
import { notify } from "../../../../components/ui/Notify";
import { useRescheduleBookingMutation } from "../../../../hooks/queries/useDispatch";
import styles from "./RescheduleModal.module.scss";

export interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number | null;
  bookingCode?: string;
  customerName?: string;
  currentStartDate?: string;
  currentEndDate?: string;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  bookingCode,
  customerName,
  currentStartDate,
  currentEndDate,
}) => {
  const { t } = useTranslation();
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const rescheduleMutation = useRescheduleBookingMutation();

  useEffect(() => {
    if (isOpen) {
      setNewStartDate(currentStartDate || "");
      setNewEndDate(currentEndDate || "");
      setReason("");
      setError(null);
    }
  }, [isOpen, currentStartDate, currentEndDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStartDate || !newEndDate) {
      setError("Vui lòng chọn đầy đủ ngày nhận và ngày trả mới");
      return;
    }

    if (newEndDate < newStartDate) {
      setError("Ngày trả đồ không thể trước ngày nhận đồ");
      return;
    }

    if (newStartDate === currentStartDate && newEndDate === currentEndDate) {
      setError("Dải ngày mới trùng với thời gian hiện tại của đơn");
      return;
    }

    if (!reason.trim() || reason.trim().length < 5) {
      setError("Vui lòng nhập lý do dời ngày tối thiểu 5 ký tự");
      return;
    }

    if (!bookingId) return;

    try {
      const result = await rescheduleMutation.mutateAsync({
        bookingId,
        newStartDate,
        newEndDate,
        reason: reason.trim(),
      });

      notify.success(t("dispatch.rescheduleSuccess", { code: result.bookingCode }));
      onClose();
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : t("dispatch.conflictAlert");
      setError(errMessage);
      notify.error(errMessage);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("dispatch.reschedule")}
      subtitle={t("dispatch.rescheduleSubtitle")}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className={styles.rescheduleModal}>
        {/* Thông tin đơn hiện tại */}
        <div className={styles.rescheduleModal__currentCard}>
          <div className={styles.rescheduleModal__fieldRow}>
            <span className={styles.rescheduleModal__fieldLabel}>Đơn thuê:</span>
            <span className={styles.rescheduleModal__fieldValue}>{bookingCode || "-"}</span>
          </div>
          <div className={styles.rescheduleModal__fieldRow}>
            <span className={styles.rescheduleModal__fieldLabel}>Khách hàng:</span>
            <span className={styles.rescheduleModal__fieldValue}>{customerName || "-"}</span>
          </div>
          <div className={styles.rescheduleModal__fieldRow}>
            <span className={styles.rescheduleModal__fieldLabel}>Lịch trình hiện tại:</span>
            <span className={styles.rescheduleModal__fieldValue}>
              {currentStartDate} → {currentEndDate}
            </span>
          </div>
        </div>

        {/* Chọn dải ngày mới */}
        <div className={styles.rescheduleModal__gridDates}>
          <div className={styles.rescheduleModal__formGroup}>
            <label htmlFor="reschedule-start" className={styles.rescheduleModal__label}>
              {t("dispatch.newStartDate")} *
            </label>
            <input
              id="reschedule-start"
              type="date"
              aria-label={t("dispatch.newStartDate")}
              className={styles.rescheduleModal__input}
              value={newStartDate}
              onChange={(e) => {
                setNewStartDate(e.target.value);
                setError(null);
              }}
            />
          </div>
          <div className={styles.rescheduleModal__formGroup}>
            <label htmlFor="reschedule-end" className={styles.rescheduleModal__label}>
              {t("dispatch.newEndDate")} *
            </label>
            <input
              id="reschedule-end"
              type="date"
              aria-label={t("dispatch.newEndDate")}
              className={styles.rescheduleModal__input}
              value={newEndDate}
              onChange={(e) => {
                setNewEndDate(e.target.value);
                setError(null);
              }}
            />
          </div>
        </div>

        {/* Lý do dời ngày */}
        <div className={styles.rescheduleModal__formGroup}>
          <label htmlFor="reschedule-reason" className={styles.rescheduleModal__label}>
            {t("dispatch.reason")} *
          </label>
          <textarea
            id="reschedule-reason"
            aria-label={t("dispatch.reason")}
            className={styles.rescheduleModal__textarea}
            placeholder={t("dispatch.rescheduleReasonPlaceholder")}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError(null);
            }}
          />
        </div>

        {error && <div className={styles.rescheduleModal__errorText}>{error}</div>}

        {/* Footer actions */}
        <div className={styles.rescheduleModal__footer}>
          <Button type="button" variant="outline" onClick={onClose} disabled={rescheduleMutation.isPending}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!newStartDate || !newEndDate || rescheduleMutation.isPending}
          >
            {rescheduleMutation.isPending ? <Spinner size="sm" className="mr-2" /> : null}
            {t("common.confirm")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
