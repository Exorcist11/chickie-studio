import React from "react";
import { Edit2, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Category } from "../../../../types/category";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { Modal } from "../../../../components/common/Modal";
import { cn } from "../../../../lib/cn";
import { ICON_MAP, CATEGORY_TYPE_CONFIG } from "../../constants";
import styles from "./CategoryViewModal.module.scss";

export interface CategoryViewModalProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onEdit: (category: Category) => void;
}

export const CategoryViewModal: React.FC<CategoryViewModalProps> = ({
  open,
  category,
  onClose,
  onEdit,
}) => {
  const { t } = useTranslation();

  if (!open || !category) return null;

  const IconComponent = (category.iconUrl && ICON_MAP[category.iconUrl]) || Layers;
  const pillarConfig = CATEGORY_TYPE_CONFIG[category.type || "COSTUME"];
  const PillarIcon = pillarConfig.icon;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("category.viewCategory", "Chi tiết danh mục")}
      subtitle={t("category.viewSubtitle", "Xem thông tin chi tiết danh mục sản phẩm")}
      icon={<IconComponent className="w-5 h-5 text-burgundy" />}
      ariaLabelledBy="category-view-title"
      closeButtonAriaLabel="close-view-modal"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            leftIcon={<Edit2 className="w-3.5 h-3.5 shrink-0" />}
            onClick={() => {
              onClose();
              onEdit(category);
            }}
          >
            {t("category.edit")}
          </Button>
        </>
      }
    >
      <div className={styles.infoGrid}>
        <div>
          <span className={styles.fieldLabel}>{t("category.name")}</span>
          <span className={styles.fieldValue}>{category.name}</span>
        </div>

        <div>
          <span className={styles.fieldLabel}>{t("category.type")}</span>
          <span className={styles.fieldValue}>
            <span className={cn(styles.typeBadge, styles[pillarConfig.badgeStyleClass])}>
              <PillarIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{t(pillarConfig.labelKey, pillarConfig.defaultLabel)}</span>
            </span>
          </span>
        </div>

        <div>
          <span className={styles.fieldLabel}>{t("category.status")}</span>
          <Badge
            variant={category.isActive ? "success" : "secondary"}
            className="gap-1.5 font-medium whitespace-nowrap inline-flex items-center"
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full inline-block shrink-0",
                category.isActive ? "bg-emerald-500" : "bg-stone-400"
              )}
              aria-hidden="true"
            />
            <span>{category.isActive ? t("category.active") : t("category.inactive")}</span>
          </Badge>
        </div>

        <div>
          <span className={styles.fieldLabel}>{t("category.slug")}</span>
          <code className={styles.fieldCode}>/{category.slug}</code>
        </div>

        <div>
          <span className={styles.fieldLabel}>{t("category.displayOrder")}</span>
          <span className={styles.fieldOrder}>#{category.displayOrder}</span>
        </div>

        <div>
          <span className={styles.fieldLabel}>{t("category.icon")}</span>
          <span className={styles.fieldIcon}>
            {category.iconUrl || <span className="text-stone-400 italic">Mặc định</span>}
          </span>
        </div>

        <div>
          <span className={styles.fieldLabel}>{t("category.createdAt", "Ngày tạo")}</span>
          <span className={styles.fieldTime}>
            {category.createdAt
              ? new Date(category.createdAt).toLocaleString("vi-VN")
              : "-"}
          </span>
        </div>
      </div>

      <div>
        <span className={styles.fieldLabel}>{t("category.description")}</span>
        <div className={styles.descBox}>
          {category.description || (
            <span className="text-stone-400 italic">Không có mô tả</span>
          )}
        </div>
      </div>
    </Modal>
  );
};
