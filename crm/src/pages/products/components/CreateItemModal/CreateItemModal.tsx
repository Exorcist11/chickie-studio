import React, { useState, useEffect } from "react";
import { Sparkles, PackagePlus, Barcode, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../../../components/common/Modal";
import { Button } from "../../../../components/ui/Button";
import { Select } from "../../../../components/ui/Select";
import { TextArea } from "../../../../components/ui/TextArea";
import { FormField } from "../../../../components/common/FormField";
import { ProductDetailResponse } from "../../../../types/product";
import { productItemService } from "../../../../services/productItem.service";
import { useCreateProductItemMutation } from "../../../../hooks/queries/useProductItemQueries";
import styles from "./CreateItemModal.module.scss";

interface CreateItemModalProps {
  open: boolean;
  onClose: () => void;
  product: ProductDetailResponse;
  preselectedVariantId?: number;
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({
  open,
  onClose,
  product,
  preselectedVariantId,
}) => {
  const { t } = useTranslation();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    preselectedVariantId ? String(preselectedVariantId) : ""
  );
  const [itemCode, setItemCode] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateProductItemMutation(product.id);

  useEffect(() => {
    if (open) {
      const defaultVariantId = preselectedVariantId
        ? String(preselectedVariantId)
        : product.variants?.[0]?.id
        ? String(product.variants[0].id)
        : "";
      setSelectedVariantId(defaultVariantId);
      setItemCode("");
      setNote("");
      setErrorMessage(null);
    }
  }, [open, preselectedVariantId, product.variants]);

  const handleSuggestCode = async () => {
    if (!selectedVariantId) return;
    try {
      setIsSuggesting(true);
      const code = await productItemService.suggestItemCode(Number(selectedVariantId));
      setItemCode(code);
    } catch {
      // Ignore suggestion failure
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) {
      setErrorMessage(t("productItem.selectVariant", "Vui lòng chọn biến thể"));
      return;
    }

    try {
      setErrorMessage(null);
      await createMutation.mutateAsync({
        variantId: Number(selectedVariantId),
        input: {
          itemCode: itemCode.trim() || undefined,
          note: note.trim() || undefined,
          status: "AVAILABLE",
        },
      });
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        errorObj.response?.data?.message || "Có lỗi xảy ra khi thêm món đồ vật lý vào kho."
      );
    }
  };

  const variantOptions = (product.variants || []).map((v) => ({
    value: String(v.id),
    label: `${v.size} - ${v.color} (${v.sku || "N/A"})`,
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("productItem.addItemTitle", "Thêm món đồ vật lý vào kho")}
      subtitle={t("productItem.addItemDesc", "Tạo một món đồ thực tế gắn với biến thể, sinh mã barcode theo dõi vòng đời.")}
      icon={<PackagePlus className="w-5 h-5 text-burgundy" />}
      ariaLabelledBy="create-item-title"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel", "Hủy")}
          </Button>
          <Button
            type="submit"
            form="create-item-form"
            loading={createMutation.isPending}
            disabled={!selectedVariantId}
          >
            {t("productItem.addItem", "Thêm vào kho")}
          </Button>
        </>
      }
    >
      <form id="create-item-form" onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200" role="alert">
            {errorMessage}
          </div>
        )}

        <FormField label={t("productItem.selectVariant", "Chọn biến thể")} required>
          <Select
            value={selectedVariantId}
            onValueChange={(val) => setSelectedVariantId(val)}
            options={variantOptions}
            placeholder={t("productItem.selectVariant", "Chọn biến thể sản phẩm")}
          />
        </FormField>

        <FormField
          name="itemCode"
          label={t("productItem.itemCode", "Mã đồ vật lý (Barcode)")}
          helperText={t("productItem.autoCodeHint", "Để trống để hệ thống tự động sinh mã Barcode duy nhất")}
        >
          <div className={styles.barcodeControl}>
            <div className={styles.inputWrapper}>
              <Barcode className={styles.barcodeIcon} aria-hidden="true" />
              <input
                id="itemCode"
                name="itemCode"
                type="text"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value.toUpperCase())}
                placeholder="CK-DR01-S-01"
                className={styles.barcodeInput}
                disabled={createMutation.isPending}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className={styles.suggestBtn}
              onClick={handleSuggestCode}
              disabled={!selectedVariantId || isSuggesting || createMutation.isPending}
              loading={isSuggesting}
              title={t("productItem.suggestCode", "Gợi ý mã Barcode")}
            >
              <Sparkles className="w-3.5 h-3.5 text-burgundy" />
              <span>{t("productItem.suggestCode", "Gợi ý mã Barcode")}</span>
            </Button>
          </div>
        </FormField>

        <FormField label={t("productItem.note", "Ghi chú hiện trạng")}>
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("productItem.statusNotePlaceholder", "Ví dụ: Hàng mới nhập, đính cúc chắc chắn...")}
            rows={3}
            disabled={createMutation.isPending}
          />
        </FormField>

        {/* Initial Status Callout */}
        <div className={styles.statusCallout}>
          <div className={styles.statusBadge}>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-ink">Trạng thái khởi tạo:</span>
            <span className={styles.statusTag}>Sẵn sàng (AVAILABLE)</span>
          </div>
          <p className={styles.statusDesc}>
            Món đồ sau khi tạo sẽ tự động kích hoạt trạng thái sẵn sàng cho thuê trong kho thực tế.
          </p>
        </div>
      </form>
    </Modal>
  );
};
