import React, { useState, useEffect, useMemo } from "react";
import { ArrowRightLeft, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../../../components/common/Modal";
import { Button } from "../../../../components/ui/Button";
import { Select } from "../../../../components/ui/Select";
import { TextArea } from "../../../../components/ui/TextArea";
import { FormField } from "../../../../components/common/FormField";
import {
  ALLOWED_STATUS_TRANSITIONS,
  ProductItem,
  ProductItemStatus,
} from "../../../../types/productItem";
import { ItemStatusBadge } from "../ItemStatusBadge/ItemStatusBadge";
import { useUpdateProductItemStatusMutation } from "../../../../hooks/queries/useProductItemQueries";
import styles from "./ItemStatusChangeModal.module.scss";

interface ItemStatusChangeModalProps {
  open: boolean;
  onClose: () => void;
  item: ProductItem | null;
  productId: number;
}

export const ItemStatusChangeModal: React.FC<ItemStatusChangeModalProps> = ({
  open,
  onClose,
  item,
  productId,
}) => {
  const { t } = useTranslation();
  const [targetStatus, setTargetStatus] = useState<ProductItemStatus | "">("");
  const [note, setNote] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateMutation = useUpdateProductItemStatusMutation(productId);

  const allowedStatuses = useMemo(
    () => (item ? ALLOWED_STATUS_TRANSITIONS[item.status] : []),
    [item]
  );

  useEffect(() => {
    if (open && item) {
      setTargetStatus(allowedStatuses[0] || "");
      setNote(item.note || "");
      setErrorMessage(null);
    }
  }, [open, item, allowedStatuses]);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStatus) {
      setErrorMessage("Vui lòng chọn trạng thái tiếp theo");
      return;
    }

    try {
      setErrorMessage(null);
      await updateMutation.mutateAsync({
        id: item.id,
        input: {
          status: targetStatus as ProductItemStatus,
          note: note.trim() || undefined,
        },
      });
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        errorObj.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái."
      );
    }
  };

  const isTransitionToLaundry = item.status === "RENTED" && targetStatus === "LAUNDRY";

  const statusOptions = allowedStatuses.map((st) => ({
    value: st,
    label: t(`productItem.status_${st}`, st),
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("productItem.changeStatusTitle", "Cập nhật trạng thái vòng đời")}
      subtitle={t("productItem.changeStatusDesc", "Chọn trạng thái tiếp theo cho món đồ theo quy tắc vận hành.")}
      icon={<ArrowRightLeft className="w-5 h-5 text-burgundy" />}
      ariaLabelledBy="change-status-title"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel", "Hủy")}
          </Button>
          <Button
            type="submit"
            form="change-status-form"
            loading={updateMutation.isPending}
            disabled={!targetStatus}
          >
            {t("common.confirm", "Xác nhận")}
          </Button>
        </>
      }
    >
      <form id="change-status-form" onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200" role="alert">
            {errorMessage}
          </div>
        )}

        <div className={styles.itemSummary}>
          <div className={styles.itemIdentity}>
            <span className={styles.itemCode}>{item.itemCode}</span>
            <span className={styles.variantTag}>
              {item.variantSize} - {item.variantColor} ({item.variantSku})
            </span>
          </div>
          <div>
            <ItemStatusBadge status={item.status} />
          </div>
        </div>

        {allowedStatuses.length === 0 ? (
          <div className={styles.terminalNotice}>
            {t("productItem.terminalNotice", "Món đồ này đã ở trạng thái ngừng sử dụng (RETIRED) và không thể chuyển đổi tiếp.")}
          </div>
        ) : (
          <>
            <FormField label={t("productItem.newStatus", "Trạng thái mới")} required>
              <Select
                value={targetStatus}
                onValueChange={(val) => setTargetStatus(val as ProductItemStatus)}
                options={statusOptions}
                placeholder={t("productItem.newStatus", "Chọn trạng thái mới")}
              />
            </FormField>

            {isTransitionToLaundry && (
              <div className={styles.statusTransitionNotice}>
                <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                <span>
                  Món đồ hoàn tất 1 lượt thuê: Hệ thống sẽ tự động tăng số lần thuê (
                  <strong>rental_count + 1</strong>) để theo dõi độ khấu hao và chu kỳ bảo dưỡng.
                </span>
              </div>
            )}

            <FormField label={t("productItem.statusNote", "Lý do / Ghi chú")}>
              <TextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("productItem.statusNotePlaceholder", "Ghi nhận hiện trạng, lý do chuyển...")}
                rows={3}
              />
            </FormField>
          </>
        )}
      </form>
    </Modal>
  );
};
