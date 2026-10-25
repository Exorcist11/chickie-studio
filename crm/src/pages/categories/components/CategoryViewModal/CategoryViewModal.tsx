import React, { useState } from "react";
import {
  Edit2,
  Layers,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Clock,
  Sparkles,
  Quote,
  SlidersHorizontal,
} from "lucide-react";
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
  const [copiedSlug, setCopiedSlug] = useState(false);

  if (!open || !category) return null;

  const IconComponent = (category.iconUrl && ICON_MAP[category.iconUrl]) || Layers;
  const pillarConfig = CATEGORY_TYPE_CONFIG[category.type || "COSTUME"];
  const PillarIcon = pillarConfig.icon;

  const handleCopySlug = async () => {
    try {
      await navigator.clipboard.writeText(category.slug);
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  const clientUrl = `http://localhost:3000/categories/${category.slug}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="xl"
      title={t("category.viewCategory", "Chi tiết danh mục")}
      subtitle={t("category.viewSubtitle", "Xem thông tin chi tiết danh mục sản phẩm")}
      icon={<IconComponent className="w-5 h-5 text-burgundy" />}
      ariaLabelledBy="category-view-title"
      closeButtonAriaLabel="close-view-modal"
      headerExtra={
        <a
          href={clientUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={t("category.websitePreview", "Xem trên Website")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-burgundy hover:bg-stone-100 rounded-lg border border-line transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t("category.websitePreview", "Xem trên Website")}</span>
        </a>
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel", "Hủy")}
          </Button>
          <Button
            type="button"
            leftIcon={<Edit2 className="w-3.5 h-3.5 shrink-0" />}
            onClick={() => {
              onClose();
              onEdit(category);
            }}
          >
            {t("category.edit", "Chỉnh sửa")}
          </Button>
        </>
      }
    >
      <div className={styles.viewModal}>
        {/* Luxury Hero Identity Banner */}
        <div className={styles.heroBanner}>
          <div
            className={cn(
              styles.heroIconBadge,
              styles[`heroIconBadge--${(category.type || "COSTUME").toLowerCase()}`]
            )}
            aria-hidden="true"
          >
            <IconComponent className="w-7 h-7" />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.heroTitleRow}>
              <h3 className={styles.heroTitle}>{category.name}</h3>
            </div>

            <div className={styles.heroBadges}>
              {/* Business Pillar Badge */}
              <span className={cn(styles.typeBadge, styles[pillarConfig.badgeStyleClass])}>
                <PillarIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{t(pillarConfig.labelKey, pillarConfig.defaultLabel)}</span>
              </span>

              {/* Status Badge */}
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

              {/* Order Badge */}
              <span className={styles.orderBadge}>#{category.displayOrder}</span>
            </div>

            {/* Copyable Slug Pill */}
            <button
              type="button"
              onClick={handleCopySlug}
              className={styles.slugPill}
              title={t("category.copySlug", "Sao chép slug")}
            >
              <code className="text-stone-600 font-mono">/{category.slug}</code>
              {copiedSlug ? (
                <span className={styles.copySuccess}>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t("category.slugCopied", "Đã chép")}</span>
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-stone-400" />
              )}
            </button>
          </div>
        </div>

        {/* Bento Grid: Structured Specifications */}
        <div className={styles.bentoGrid}>
          {/* Card 1: Business Pillar Info */}
          <div className={styles.bentoCard}>
            <div className={styles.cardHeader}>
              <Layers className="w-4 h-4 text-burgundy" />
              <span>{t("category.type", "Mảng kinh doanh")}</span>
            </div>
            <div className={styles.cardValue}>
              <PillarIcon className="w-4 h-4 text-stone-600 shrink-0" />
              <span>{t(pillarConfig.labelKey, pillarConfig.defaultLabel)}</span>
            </div>
            <span className={styles.cardSub}>
              {category.type === "COSTUME"
                ? "Dành cho váy cưới, áo dài và trang phục chụp ảnh"
                : category.type === "CAMERA"
                ? "Dành cho thiết bị máy ảnh, ống kính và phụ kiện"
                : "Dành cho các gói chụp nghệ thuật tại studio & ngoại cảnh"}
            </span>
          </div>

          {/* Card 2: Visual Icon & Display Order */}
          <div className={styles.bentoCard}>
            <div className={styles.cardHeader}>
              <Sparkles className="w-4 h-4 text-burgundy" />
              <span>{t("category.icon", "Biểu tượng & Hiển thị")}</span>
            </div>
            <div className={styles.cardValue}>
              <div className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center border border-stone-200">
                <IconComponent className="w-3.5 h-3.5 text-stone-700" />
              </div>
              <span className="font-mono text-sm">{category.iconUrl || "Mặc định (Layers)"}</span>
            </div>
            <span className={styles.cardSub}>
              Thứ tự ưu tiên sắp xếp: <strong>#{category.displayOrder}</strong>
            </span>
          </div>

          {/* Card 3: Creation Timestamp */}
          <div className={styles.bentoCard}>
            <div className={styles.cardHeader}>
              <Calendar className="w-4 h-4 text-burgundy" />
              <span>{t("category.createdAt", "Ngày tạo")}</span>
            </div>
            <div className={styles.cardValue}>
              <Clock className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="text-xs font-mono font-medium text-stone-700">
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleString("vi-VN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "-"}
              </span>
            </div>
            <span className={styles.cardSub}>Khởi tạo trên hệ thống CRM</span>
          </div>

          {/* Card 4: System Order & Visibility */}
          <div className={styles.bentoCard}>
            <div className={styles.cardHeader}>
              <SlidersHorizontal className="w-4 h-4 text-burgundy" />
              <span>{t("category.orderPriority", "Thứ tự hiển thị")}</span>
            </div>
            <div className={styles.cardValue}>
              <span className="text-lg font-bold text-burgundy font-mono">#{category.displayOrder}</span>
              <span className="text-xs text-stone-500 font-normal">
                ({category.isActive ? "Đang mở cho khách" : "Đang tạm ẩn"})
              </span>
            </div>
            <span className={styles.cardSub}>
              {t("category.orderHelper", "Số nhỏ hơn sẽ được ưu tiên hiển thị trước")}
            </span>
          </div>
        </div>

        {/* Description Callout Card */}
        <div className={styles.descCard}>
          <div className={styles.descHeader}>
            <Quote className="w-3.5 h-3.5 text-burgundy" />
            <span>{t("category.description", "Mô tả")}</span>
          </div>
          {category.description ? (
            <p className={styles.descText}>"{category.description}"</p>
          ) : (
            <span className={styles.emptyDesc}>
              {t("category.noDescription", "Chưa có mô tả chi tiết cho danh mục này.")}
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
};
