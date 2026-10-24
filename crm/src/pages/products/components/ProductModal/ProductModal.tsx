import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, Star, Image as ImageIcon } from "lucide-react";
import { Modal } from "../../../../components/common/Modal";
import { TextField } from "../../../../components/ui/TextField";
import { TextArea } from "../../../../components/ui/TextArea";
import { Select } from "../../../../components/ui/Select";
import { Button } from "../../../../components/ui/Button";
import { Category } from "../../../../types/category";
import {
  CreateProductInput,
  ProductDetailResponse,
  ProductStatus,
  UpdateProductInput,
} from "../../../../types/product";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../../../hooks/queries/productKeys";
import styles from "./ProductModal.module.scss";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product?: ProductDetailResponse | null;
  categories: Category[];
}

type TabType = "general" | "pricing" | "variants" | "images";

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
  categories,
}) => {
  const { t } = useTranslation();
  const isEdit = Boolean(product);

  const [activeTab, setActiveTab] = useState<TabType>("general");

  // Form states
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 0);
  const [productCode, setProductCode] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [occasion, setOccasion] = useState("");
  const [rentalPrice, setRentalPrice] = useState<number>(0);
  const [depositPrice, setDepositPrice] = useState<number>(0);
  const [status, setStatus] = useState<ProductStatus>("ACTIVE");

  // Variants state
  const [variants, setVariants] = useState<
    { id?: number; size: string; color: string; sku?: string }[]
  >([{ size: "Freesize", color: "Trắng", sku: "" }]);

  // Images state
  const [images, setImages] = useState<
    { id?: number; imageUrl: string; isThumbnail: boolean; displayOrder: number }[]
  >([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [validationError, setValidationError] = useState<string | null>(null);

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (product) {
      setCategoryId(product.categoryId);
      setProductCode(product.productCode);
      setName(product.name);
      setSlug(product.slug);
      setDescription(product.description || "");
      setMaterial(product.material || "");
      setOccasion(product.occasion || "");
      setRentalPrice(product.rentalPrice);
      setDepositPrice(product.depositPrice);
      setStatus(product.status);
      setVariants(
        product.variants?.length > 0
          ? product.variants.map((v) => ({
              id: v.id,
              size: v.size,
              color: v.color,
              sku: v.sku,
            }))
          : [{ size: "Freesize", color: "Trắng", sku: "" }]
      );
      setImages(
        product.images?.length > 0
          ? product.images.map((img, idx) => ({
              id: img.id,
              imageUrl: img.imageUrl,
              isThumbnail: Boolean(img.isThumbnail),
              displayOrder: img.displayOrder ?? idx,
            }))
          : []
      );
    } else {
      setCategoryId(categories[0]?.id || 0);
      setProductCode("");
      setName("");
      setSlug("");
      setDescription("");
      setMaterial("");
      setOccasion("");
      setRentalPrice(0);
      setDepositPrice(0);
      setStatus("ACTIVE");
      setVariants([{ size: "Freesize", color: "Trắng", sku: "" }]);
      setImages([]);
    }
    setActiveTab("general");
    setValidationError(null);
  }, [product, categories, isOpen]);

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { size: "S", color: "", sku: "" }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: "size" | "color" | "sku",
    value: string
  ) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddImage = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    const isFirst = images.length === 0;
    setImages((prev) => [
      ...prev,
      {
        imageUrl: trimmed,
        isThumbnail: isFirst,
        displayOrder: prev.length,
      },
    ]);
    setNewImageUrl("");
  };

  const handleSetThumbnail = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isThumbnail: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isThumbnail)) {
        filtered[0].isThumbnail = true;
      }
      return filtered;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!name.trim()) {
      setValidationError("Tên sản phẩm không được để trống");
      setActiveTab("general");
      return;
    }
    if (!categoryId) {
      setValidationError("Vui lòng chọn danh mục");
      setActiveTab("general");
      return;
    }
    if (rentalPrice <= 0) {
      setValidationError("Giá thuê phải lớn hơn 0");
      setActiveTab("pricing");
      return;
    }
    if (depositPrice < 0) {
      setValidationError("Tiền cọc không được âm");
      setActiveTab("pricing");
      return;
    }
    if (variants.length === 0 || variants.some((v) => !v.size.trim() || !v.color.trim())) {
      setValidationError("Vui lòng nhập đầy đủ kích cỡ và màu sắc cho tất cả biến thể");
      setActiveTab("variants");
      return;
    }
    if (images.length === 0) {
      setValidationError("Sản phẩm phải có ít nhất 1 hình ảnh");
      setActiveTab("images");
      return;
    }

    try {
      if (isEdit && product) {
        const payload: UpdateProductInput = {
          categoryId,
          productCode: productCode.trim() || undefined,
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          material: material.trim() || undefined,
          occasion: occasion.trim() || undefined,
          rentalPrice,
          depositPrice,
          status,
          variants,
          images,
        };
        await updateMutation.mutateAsync({ id: product.id, data: payload });
      } else {
        const payload: CreateProductInput = {
          categoryId,
          productCode: productCode.trim() || undefined,
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          material: material.trim() || undefined,
          occasion: occasion.trim() || undefined,
          rentalPrice,
          depositPrice,
          status,
          variants,
          images,
        };
        await createMutation.mutateAsync(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Đã có lỗi xảy ra khi lưu sản phẩm";
      setValidationError(errorMsg || "Lỗi lưu dữ liệu");
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: String(cat.id),
    label: cat.name,
  }));

  const statusOptions = [
    { value: "ACTIVE", label: t("product.active") },
    { value: "INACTIVE", label: t("product.inactive") },
    { value: "ARCHIVED", label: t("product.archived") },
  ];

  const sizeOptions = [
    { value: "S", label: "Size S" },
    { value: "M", label: "Size M" },
    { value: "L", label: "Size L" },
    { value: "XL", label: "Size XL" },
    { value: "Freesize", label: "Freesize" },
  ];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={isEdit ? t("product.editProduct") : t("product.addProduct")}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className={styles.productModal__form}>
        {/* Navigation Tabs */}
        <div className={styles.productModal__tabs}>
          <button
            type="button"
            className={`${styles.productModal__tabBtn} ${
              activeTab === "general" ? styles["productModal__tabBtn--active"] : ""
            }`}
            onClick={() => setActiveTab("general")}
          >
            {t("product.tabs.general")}
          </button>
          <button
            type="button"
            className={`${styles.productModal__tabBtn} ${
              activeTab === "pricing" ? styles["productModal__tabBtn--active"] : ""
            }`}
            onClick={() => setActiveTab("pricing")}
          >
            {t("product.tabs.pricing")}
          </button>
          <button
            type="button"
            className={`${styles.productModal__tabBtn} ${
              activeTab === "variants" ? styles["productModal__tabBtn--active"] : ""
            }`}
            onClick={() => setActiveTab("variants")}
          >
            {t("product.tabs.variants")} ({variants.length})
          </button>
          <button
            type="button"
            className={`${styles.productModal__tabBtn} ${
              activeTab === "images" ? styles["productModal__tabBtn--active"] : ""
            }`}
            onClick={() => setActiveTab("images")}
          >
            {t("product.tabs.images")} ({images.length})
          </button>
        </div>

        {/* Tab 1: General Info */}
        {activeTab === "general" && (
          <div className={styles.productModal__tabContent}>
            <div className={styles.productModal__row}>
              <TextField
                label={t("product.name")}
                placeholder={t("product.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Select
                label={t("product.category")}
                placeholder={t("product.selectCategory")}
                options={categoryOptions}
                value={String(categoryId)}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                required
              />
            </div>

            <div className={styles.productModal__row}>
              <TextField
                label={t("product.productCode")}
                placeholder={t("product.productCodePlaceholder")}
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
              <TextField
                label={t("product.slug")}
                placeholder={t("product.slugPlaceholder")}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className={styles.productModal__row}>
              <TextField
                label={t("product.material")}
                placeholder={t("product.materialPlaceholder")}
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
              <TextField
                label={t("product.occasion")}
                placeholder={t("product.occasionPlaceholder")}
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              />
            </div>

            <TextArea
              label={t("product.description")}
              placeholder={t("product.descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {/* Tab 2: Pricing & Status */}
        {activeTab === "pricing" && (
          <div className={styles.productModal__tabContent}>
            <div className={styles.productModal__row}>
              <TextField
                label={t("product.rentalPrice")}
                type="number"
                placeholder={t("product.rentalPricePlaceholder")}
                value={rentalPrice ? String(rentalPrice) : ""}
                onChange={(e) => setRentalPrice(Number(e.target.value))}
                required
              />
              <TextField
                label={t("product.depositPrice")}
                type="number"
                placeholder={t("product.depositPricePlaceholder")}
                value={depositPrice ? String(depositPrice) : ""}
                onChange={(e) => setDepositPrice(Number(e.target.value))}
                required
              />
            </div>

            <Select
              label={t("product.status")}
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
              required
            />
          </div>
        )}

        {/* Tab 3: Variants */}
        {activeTab === "variants" && (
          <div className={styles.productModal__tabContent}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                {t("product.variants")}
              </span>
              <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
                <Plus size={14} style={{ marginRight: 4 }} />
                {t("product.addVariant")}
              </Button>
            </div>

            {variants.map((v, idx) => (
              <div key={idx} className={styles.productModal__variantItem}>
                <Select
                  options={sizeOptions}
                  value={v.size}
                  onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                />
                <TextField
                  placeholder={t("product.color")}
                  value={v.color}
                  onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                />
                <TextField
                  placeholder={t("product.sku")}
                  value={v.sku || ""}
                  onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveVariant(idx)}
                  disabled={variants.length <= 1}
                  style={{ color: "#ef4444", padding: 0 }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Photos */}
        {activeTab === "images" && (
          <div className={styles.productModal__tabContent}>
            <div className={styles.productModal__imageInputRow}>
              <TextField
                placeholder={t("product.imageUrlPlaceholder")}
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button type="button" variant="outline" onClick={handleAddImage}>
                <Plus size={16} style={{ marginRight: 4 }} />
                {t("product.addImage")}
              </Button>
            </div>

            {images.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem",
                  color: "#94a3b8",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "0.5rem",
                }}
              >
                <ImageIcon size={32} style={{ marginBottom: 8 }} />
                <span>Chưa có hình ảnh nào. Nhập URL ảnh ở trên để thêm.</span>
              </div>
            ) : (
              <div className={styles.productModal__imageGrid}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`${styles.productModal__imageCard} ${
                      img.isThumbnail ? styles["productModal__imageCard--thumbnail"] : ""
                    }`}
                  >
                    <img src={img.imageUrl} alt={`Ảnh ${idx + 1}`} />
                    {img.isThumbnail && (
                      <span className={styles.productModal__thumbBadge}>
                        {t("product.isThumbnail")}
                      </span>
                    )}
                    <div className={styles.productModal__imageCardActions}>
                      <button
                        type="button"
                        onClick={() => handleSetThumbnail(idx)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: img.isThumbnail ? "#eab308" : "#94a3b8",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                        title={t("product.setThumbnail")}
                      >
                        <Star size={16} fill={img.isThumbnail ? "#eab308" : "none"} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {validationError && (
          <div className={styles.productModal__error}>{validationError}</div>
        )}

        {/* Footer Actions */}
        <div className={styles.productModal__actions}>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? t("common.loading") : t("common.save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
