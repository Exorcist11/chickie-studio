import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../../../components/common/Modal";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { ProductDetailResponse } from "../../../../types/product";
import styles from "./ProductViewModal.module.scss";

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetailResponse | null;
}

export const ProductViewModal: React.FC<ProductViewModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { t } = useTranslation();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!product) return null;

  const images = product.images || [];
  const currentImg = images[selectedImgIndex]?.imageUrl || images[0]?.imageUrl;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("product.viewProduct")}
      maxWidth="lg"
    >
      <div className={styles.productViewModal}>
        <div className={styles.productViewModal__header}>
          <div>
            <h3 className={styles.productViewModal__title}>{product.name}</h3>
            <span className={styles.productViewModal__code}>{product.productCode}</span>
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

        <div className={styles.productViewModal__grid}>
          {/* Gallery Column */}
          <div className={styles.productViewModal__gallery}>
            <div className={styles.productViewModal__mainImage}>
              {currentImg ? (
                <img src={currentImg} alt={product.name} />
              ) : (
                <div style={{ display: "grid", placeItems: "center", height: "100%", color: "#94a3b8" }}>
                  Chưa có ảnh
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
                  >
                    <img src={img.imageUrl} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className={styles.productViewModal__infoList}>
              <div className={styles.productViewModal__infoItem}>
                <span className={styles.productViewModal__label}>{t("product.category")}</span>
                <span className={styles.productViewModal__value}>{product.categoryName}</span>
              </div>
              <div className={styles.productViewModal__infoItem}>
                <span className={styles.productViewModal__label}>{t("product.slug")}</span>
                <span className={styles.productViewModal__value}>{product.slug}</span>
              </div>
              <div className={styles.productViewModal__infoItem}>
                <span className={styles.productViewModal__label}>{t("product.rentalPrice")}</span>
                <span className={styles.productViewModal__value} style={{ color: "#0284c7" }}>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    product.rentalPrice
                  )}
                </span>
              </div>
              <div className={styles.productViewModal__infoItem}>
                <span className={styles.productViewModal__label}>{t("product.depositPrice")}</span>
                <span className={styles.productViewModal__value}>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    product.depositPrice
                  )}
                </span>
              </div>
              <div className={styles.productViewModal__infoItem}>
                <span className={styles.productViewModal__label}>{t("product.material")}</span>
                <span className={styles.productViewModal__value}>
                  {product.material || "—"}
                </span>
              </div>
              <div className={styles.productViewModal__infoItem}>
                <span className={styles.productViewModal__label}>{t("product.occasion")}</span>
                <span className={styles.productViewModal__value}>
                  {product.occasion || "—"}
                </span>
              </div>
            </div>

            {product.description && (
              <div className={styles.productViewModal__infoItem}>
                <span className={styles.productViewModal__label}>{t("product.description")}</span>
                <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "0.875rem" }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Variants Table */}
            <div>
              <span className={styles.productViewModal__label}>
                {t("product.variants")} ({product.variants?.length || 0})
              </span>
              <table className={styles.productViewModal__variantsTable}>
                <thead>
                  <tr>
                    <th>{t("product.size")}</th>
                    <th>{t("product.color")}</th>
                    <th>{t("product.sku")}</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants?.map((v, i) => (
                    <tr key={i}>
                      <td><strong>{v.size}</strong></td>
                      <td>{v.color}</td>
                      <td><code>{v.sku}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.productViewModal__actions}>
          <Button variant="primary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};
