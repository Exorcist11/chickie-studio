import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../../../components/common/Modal";
import { Button } from "../../../../components/ui/Button";
import { Spinner } from "../../../../components/ui/Spinner";
import { notify } from "../../../../components/ui/Notify";
import {
  useAvailableReplacementsQuery,
  useReassignItemMutation,
} from "../../../../hooks/queries/useDispatch";
import styles from "./ReassignItemModal.module.scss";

export interface ReassignItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingItemId: number | null;
  bookingCode?: string;
  currentBarcode?: string;
  productName?: string;
  variantInfo?: string;
  rentalDates?: string;
}

export const ReassignItemModal: React.FC<ReassignItemModalProps> = ({
  isOpen,
  onClose,
  bookingItemId,
  bookingCode,
  currentBarcode,
  productName,
  variantInfo,
  rentalDates,
}) => {
  const { t } = useTranslation();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: replacements = [], isLoading: isLoadingReplacements } =
    useAvailableReplacementsQuery(isOpen ? bookingItemId : null);

  const reassignMutation = useReassignItemMutation();

  useEffect(() => {
    if (isOpen) {
      setSelectedItemId(null);
      setReason("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItemId) {
      setError(t("dispatch.selectReplacementPlaceholder"));
      return;
    }

    if (!reason.trim() || reason.trim().length < 5) {
      setError("Vui lòng nhập lý do điều phối tối thiểu 5 ký tự");
      return;
    }

    if (!bookingItemId) return;

    try {
      const result = await reassignMutation.mutateAsync({
        bookingItemId,
        newItemId: selectedItemId,
        reason: reason.trim(),
      });

      notify.success(
        t("dispatch.reassignSuccess", { barcode: result.newBarcode })
      );
      onClose();
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : "Có lỗi xảy ra khi điều phối món đồ";
      setError(errMessage);
      notify.error(errMessage);
    }
  };

  const selectableReplacements = replacements.filter((r) => !r.isCurrent);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("dispatch.reassignItem")}
      subtitle={t("dispatch.reassignSubtitle")}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className={styles.reassignModal}>
        {/* Thông tin món hiện tại */}
        <div className={styles.reassignModal__currentCard}>
          <div className={styles.reassignModal__fieldRow}>
            <span className={styles.reassignModal__fieldLabel}>Đơn thuê:</span>
            <span className={styles.reassignModal__fieldValue}>{bookingCode || "-"}</span>
          </div>
          <div className={styles.reassignModal__fieldRow}>
            <span className={styles.reassignModal__fieldLabel}>Sản phẩm:</span>
            <span className={styles.reassignModal__fieldValue}>{productName || "-"}</span>
          </div>
          <div className={styles.reassignModal__fieldRow}>
            <span className={styles.reassignModal__fieldLabel}>Phân loại (Size/Màu):</span>
            <span className={styles.reassignModal__fieldValue}>{variantInfo || "-"}</span>
          </div>
          <div className={styles.reassignModal__fieldRow}>
            <span className={styles.reassignModal__fieldLabel}>{t("dispatch.currentBarcode")}:</span>
            <span className={styles.reassignModal__barcodeBadge}>{currentBarcode || "-"}</span>
          </div>
          {rentalDates && (
            <div className={styles.reassignModal__fieldRow}>
              <span className={styles.reassignModal__fieldLabel}>Thời gian thuê:</span>
              <span className={styles.reassignModal__fieldValue}>{rentalDates}</span>
            </div>
          )}
        </div>

        {/* Dropdown chọn món thay thế */}
        <div className={styles.reassignModal__formGroup}>
          <label htmlFor="reassign-select" className={styles.reassignModal__label}>
            {t("dispatch.selectReplacement")} *
          </label>
          {isLoadingReplacements ? (
            <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
              <Spinner size="sm" />
              <span>Đang kiểm tra lịch trống kho đồ...</span>
            </div>
          ) : selectableReplacements.length === 0 ? (
            <div className="p-3 text-sm rounded bg-amber-50 text-amber-800 border border-amber-200">
              {t("dispatch.noAvailableItem")}
            </div>
          ) : (
            <select
              id="reassign-select"
              aria-label={t("dispatch.selectReplacement")}
              className={styles.reassignModal__select}
              value={selectedItemId ?? ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                setSelectedItemId(val);
                setError(null);
              }}
            >
              <option value="">{t("dispatch.selectReplacementPlaceholder")}</option>
              {selectableReplacements.map((item) => (
                <option
                  key={item.itemId}
                  value={item.itemId}
                  disabled={!item.isAvailable}
                >
                  {item.barcode} {item.isAvailable ? `(${t("dispatch.available")} - Đã thuê ${item.rentalCount} lần)` : `(${t("dispatch.busy")})`}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Lý do điều phối */}
        <div className={styles.reassignModal__formGroup}>
          <label htmlFor="reassign-reason" className={styles.reassignModal__label}>
            {t("dispatch.reason")} *
          </label>
          <textarea
            id="reassign-reason"
            aria-label={t("dispatch.reason")}
            className={styles.reassignModal__textarea}
            placeholder={t("dispatch.reasonPlaceholder")}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError(null);
            }}
          />
        </div>

        {error && <div className={styles.reassignModal__errorText}>{error}</div>}

        {/* Footer Actions */}
        <div className={styles.reassignModal__footer}>
          <Button type="button" variant="outline" onClick={onClose} disabled={reassignMutation.isPending}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!selectedItemId || selectableReplacements.length === 0 || reassignMutation.isPending}
          >
            {reassignMutation.isPending ? <Spinner size="sm" className="mr-2" /> : null}
            {t("common.confirm")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
