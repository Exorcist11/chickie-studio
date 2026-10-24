import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { Modal } from "../../../../components/common/Modal";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { ProductDetailResponse } from "../../../../types/product";
import { Category, CategoryType } from "../../../../types/category";
import { PILLAR_PRODUCT_CONFIG } from "../../constants";
import styles from "./ProductViewModal.module.scss";

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetailResponse | null;
  categories?: Category[];
}

export const ProductViewModal: React.FC<ProductViewModalProps> = ({
  isOpen,
  onClose,
  product,
  categories = [],
}) => {
  const { t } = useTranslation();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!product) return null;

  const images = product.images || [];
  const currentImg = images[selectedImgIndex]?.imageUrl || images[0]?.imageUrl;

  // Resolve business pillar for the product
  const matchedCategory = categories.find((c) => c.id === product.categoryId);
  const pillarType: CategoryType = matchedCategory?.type || "COSTUME";
  const pillarConfig = PILLAR_PRODUCT_CONFIG[pillarType];
  const PillarIcon = pillarConfig.icon;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("product.viewProduct")}
      maxWidth="lg"
    >
      <div className={styles.productViewModal}>
        {/* Header Section */}
        <div className={styles.productViewModal__header}>
          <div className={styles.productViewModal__headerMeta}>
            <div className={styles.productViewModal__headerBadges}>
              <span className={styles.productViewModal__codeBadge}>{product.productCode}</span>
              <span
                className={cn(
                  styles.productViewModal__headerPillar,
                  styles[`productViewModal__headerPillar--${pillarType.toLowerCase()}`]
                )}
              >
                <PillarIcon size={13} />
                {pillarConfig.name}
              </span>
            </div>
            <h3 className={styles.productViewModal__title}>{product.name}</h3>
          </div>
          <Badge
            variant={
              product.status === "ACTIVE"
                ? "success"
                : product.status === "INACTIVE"
                ? "warning"
                : "secondary"
            }
          >
            {product.status === "ACTIVE"
              ? t("product.active")
              : product.status === "INACTIVE"
              ? t("product.inactive")
              : t("product.archived")}
          </Badge>
        </div>

        {/* Luxury Split View */}
        <div className={styles.productViewModal__grid}>
          {/* Gallery Column */}
          <div className={styles.productViewModal__gallery}>
            <div className={styles.productViewModal__mainImage}>
              {currentImg ? (
                <img src={currentImg} alt={product.name} />
              ) : (
                <div className={styles.productViewModal__noImage}>
                  <ImageIcon size={32} />
                  <span>Chưa có ảnh</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.productViewModal__thumbList}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`${styles.productViewModal__thumbItem} ${
                      selectedImgIndex === idx ? styles["productViewModal__thumbItem--active"] : ""
                    }`}
                    onClick={() => setSelectedImgIndex(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Xem ảnh ${idx + 1}`}
                  >
                    <img src={img.imageUrl} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className={styles.productViewModal__content}>
            {/* Price Box */}
            <div className={styles.productViewModal__priceCard}>
              <div className={styles.productViewModal__priceBlock}>
                <span className={styles.productViewModal__priceLabel}>{pillarConfig.rentalPriceLabel}</span>
                <span className={styles.productViewModal__rentalPriceVal}>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    product.rentalPrice
                  )}
                </span>
              </div>
              <div className={styles.productViewModal__priceBlock}>
                <span className={styles.productViewModal__priceLabel}>{pillarConfig.depositPriceLabel}</span>
                <span className={styles.productViewModal__depositPriceVal}>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    product.depositPrice
                  )}
                </span>
              </div>
            </div>

            {/* Attributes Grid */}
            <div className={styles.productViewModal__attributesGrid}>
              <div className={styles.productViewModal__attrItem}>
                <span className={styles.productViewModal__attrLabel}>{t("product.category")}</span>
                <span className={styles.productViewModal__attrVal}>{product.categoryName}</span>
              </div>
              <div className={styles.productViewModal__attrItem}>
                <span className={styles.productViewModal__attrLabel}>{t("product.slug")}</span>
                <span className={styles.productViewModal__attrVal}>{product.slug}</span>
              </div>
              <div className={styles.productViewModal__attrItem}>
                <span className={styles.productViewModal__attrLabel}>{pillarConfig.materialLabel}</span>
                <span className={styles.productViewModal__attrVal}>{product.material || "—"}</span>
              </div>
              <div className={styles.productViewModal__attrItem}>
                <span className={styles.productViewModal__attrLabel}>{pillarConfig.occasionLabel}</span>
                <span className={styles.productViewModal__attrVal}>{product.occasion || "—"}</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className={styles.productViewModal__description}>
                <span className={styles.productViewModal__attrLabel}>{t("product.description")}</span>
                <p className={styles.productViewModal__descText}>{product.description}</p>
              </div>
            )}

            {/* Variants Table */}
            <div className={styles.productViewModal__variantsSection}>
              <span className={styles.productViewModal__attrLabel}>
                {pillarConfig.variantsTitle} ({product.variants?.length || 0})
              </span>
              <table className={styles.productViewModal__variantsTable}>
                <thead>
                  <tr>
                    <th>{pillarConfig.sizeFieldLabel}</th>
                    <th>{pillarConfig.colorFieldLabel}</th>
                    <th>{t("product.sku")}</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants?.map((v, i) => (
                    <tr key={i}>
                      <td><strong>{v.size}</strong></td>
                      <td>{v.color}</td>
                      <td><code className={styles.productViewModal__skuPill}>{v.sku}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className={styles.productViewModal__actions}>
          <Button variant="primary" onClick={onClose}>
            {t("common.close", "Đóng")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
