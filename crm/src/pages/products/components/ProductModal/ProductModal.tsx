import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useForm, useStore } from "@tanstack/react-form";
import {
  Plus,
  Trash2,
  Star,
  Image as ImageIcon,
  Sparkles,
  Layers,
  CircleDollarSign,
  Shirt,
  UploadCloud,
  Loader2,
  Bookmark,
} from "lucide-react";
import { cn } from "../../../../lib/cn";
import { uploadService } from "../../../../services/upload.service";
import { Modal } from "../../../../components/common/Modal";
import { TextField } from "../../../../components/ui/TextField";
import { TextArea } from "../../../../components/ui/TextArea";
import { Select } from "../../../../components/ui/Select";
import { Button } from "../../../../components/ui/Button";
import { Category, CategoryType } from "../../../../types/category";
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
import { PILLAR_PRODUCT_CONFIG } from "../../constants";
import styles from "./ProductModal.module.scss";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product?: ProductDetailResponse | null;
  categories: Category[];
}

export interface ProductFormValues {
  categoryId: number;
  productCode: string;
  name: string;
  slug: string;
  description: string;
  material: string;
  occasion: string;
  rentalPrice: number;
  depositPrice: number;
  status: ProductStatus;
  variants: { id?: number; size: string; color: string; sku?: string }[];
  images: { id?: number; imageUrl: string; isThumbnail: boolean; displayOrder: number }[];
}

const toSlug = (str: string): string =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const getInitialValues = (
  product?: ProductDetailResponse | null,
  categories: Category[] = []
): ProductFormValues => {
  if (product) {
    return {
      categoryId: product.categoryId || categories[0]?.id || 0,
      productCode: product.productCode || "",
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      material: product.material || "",
      occasion: product.occasion || "",
      rentalPrice: product.rentalPrice || 0,
      depositPrice: product.depositPrice || 0,
      status: product.status || "ACTIVE",
      variants:
        product.variants?.length > 0
          ? product.variants.map((v) => ({
              id: v.id,
              size: v.size,
              color: v.color,
              sku: v.sku,
            }))
          : [{ size: "Freesize", color: "Trắng", sku: "" }],
      images:
        product.images?.length > 0
          ? product.images.map((img, idx) => ({
              id: img.id,
              imageUrl: img.imageUrl,
              isThumbnail: Boolean(img.isThumbnail),
              displayOrder: img.displayOrder ?? idx,
            }))
          : [],
    };
  }

  const firstCat = categories[0];
  const firstPillar = firstCat?.type || "COSTUME";
  const defaultVar = PILLAR_PRODUCT_CONFIG[firstPillar]?.defaultVariant || {
    size: "Freesize",
    color: "Trắng",
    sku: "",
  };

  return {
    categoryId: firstCat?.id || 0,
    productCode: "",
    name: "",
    slug: "",
    description: "",
    material: "",
    occasion: "",
    rentalPrice: 0,
    depositPrice: 0,
    status: "ACTIVE",
    variants: [{ ...defaultVar }],
    images: [],
  };
};

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
  categories,
}) => {
  const { t } = useTranslation();
  const isEdit = Boolean(product);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState<"general" | "pricing" | "media" | "specs">("general");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToSection = (id: string, sectionKey: "general" | "pricing" | "media" | "specs") => {
    setActiveSection(sectionKey);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      setIsUploading(true);
      setValidationError(null);
      const fileList = Array.from(files);
      const uploadedUrls = await uploadService.uploadImages(fileList);

      const currentImages = form.getFieldValue("images") || [];
      const hasThumb = currentImages.some((img) => img.isThumbnail);

      const newItems = uploadedUrls.map((url, i) => ({
        imageUrl: url,
        isThumbnail: !hasThumb && i === 0,
        displayOrder: currentImages.length + i,
      }));

      form.setFieldValue("images", [...currentImages, ...newItems]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Tải ảnh lên máy chủ thất bại";
      setValidationError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    defaultValues: getInitialValues(product, categories),
    onSubmit: async ({ value }) => {
      setValidationError(null);

      // Validate required business rules
      if (!value.name.trim()) {
        setValidationError("Tên sản phẩm không được để trống");
        scrollToSection("sec-general", "general");
        return;
      }
      if (!value.categoryId) {
        setValidationError("Vui lòng chọn danh mục");
        scrollToSection("sec-general", "general");
        return;
      }
      if (value.rentalPrice <= 0) {
        setValidationError("Giá thuê phải lớn hơn 0");
        scrollToSection("sec-pricing", "pricing");
        return;
      }
      if (value.depositPrice < 0) {
        setValidationError("Tiền cọc không được âm");
        scrollToSection("sec-pricing", "pricing");
        return;
      }
      if (
        value.variants.length === 0 ||
        value.variants.some((v) => !v.size.trim() || !v.color.trim())
      ) {
        setValidationError("Vui lòng nhập đầy đủ kích cỡ và màu sắc cho tất cả biến thể");
        scrollToSection("sec-pricing", "pricing");
        return;
      }
      if (value.images.length === 0) {
        setValidationError("Sản phẩm phải có ít nhất 1 hình ảnh");
        scrollToSection("sec-media", "media");
        return;
      }

      const cleanedVariants = value.variants.map((v) => ({
        ...v,
        size: v.size.trim(),
        color: v.color.trim(),
        sku: v.sku?.trim() ? v.sku.trim() : undefined,
      }));

      try {
        if (isEdit && product) {
          const payload: UpdateProductInput = {
            categoryId: value.categoryId,
            productCode: value.productCode.trim() || undefined,
            name: value.name.trim(),
            slug: value.slug.trim() || undefined,
            description: value.description.trim() || undefined,
            material: value.material.trim() || undefined,
            occasion: value.occasion.trim() || undefined,
            rentalPrice: value.rentalPrice,
            depositPrice: value.depositPrice,
            status: value.status,
            variants: cleanedVariants,
            images: value.images,
          };
          await updateMutation.mutateAsync({ id: product.id, data: payload });
        } else {
          const payload: CreateProductInput = {
            categoryId: value.categoryId,
            productCode: value.productCode.trim() || undefined,
            name: value.name.trim(),
            slug: value.slug.trim() || undefined,
            description: value.description.trim() || undefined,
            material: value.material.trim() || undefined,
            occasion: value.occasion.trim() || undefined,
            rentalPrice: value.rentalPrice,
            depositPrice: value.depositPrice,
            status: value.status,
            variants: cleanedVariants,
            images: value.images,
          };
          await createMutation.mutateAsync(payload);
        }
        onSuccess?.();
        onClose();
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : "Đã có lỗi xảy ra khi lưu sản phẩm";
        setValidationError(errorMsg || "Lỗi lưu dữ liệu");
      }
    },
  });

  // Reset form whenever modal opens or product changes
  useEffect(() => {
    if (isOpen) {
      form.reset(getInitialValues(product, categories));
      setValidationError(null);
      setActiveSection("general");
    }
  }, [isOpen, product, categories, form]);

  // Keyboard shortcut Ctrl/Cmd + S to save
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        form.handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, form]);

  // Resolve current business pillar reactively based on selected categoryId
  const selectedCategoryId = useStore(form.store, (state) => state.values.categoryId);
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const currentPillar: CategoryType = selectedCategory?.type || "COSTUME";
  const pillarConfig = PILLAR_PRODUCT_CONFIG[currentPillar];
  const PillarIcon = pillarConfig.icon;

  const categoryOptions = categories.map((cat) => {
    const pillar = cat.type || "COSTUME";
    const CategoryPillarIcon = PILLAR_PRODUCT_CONFIG[pillar].icon;
    return {
      value: String(cat.id),
      label: cat.name,
      icon: CategoryPillarIcon,
    };
  });

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
      variant="drawer"
      maxWidth="xl"
      title={isEdit ? t("product.editProduct") : t("product.addProduct")}
      subtitle={
        isEdit
          ? `Mã: ${product?.productCode || `#${product?.id}`} • ${product?.name} (${pillarConfig.name})`
          : pillarConfig.modalSubtitle
      }
      headerExtra={
        <div
          className={cn(
            styles.productModal__headerBadge,
            styles[`productModal__headerBadge--${currentPillar.toLowerCase()}`]
          )}
        >
          <PillarIcon size={12} />
          {isEdit ? "CẬP NHẬT" : pillarConfig.badgeLabel}
        </div>
      }
    >
      {/* Sticky Quick Anchor Navigation Tabs */}
      <div className={styles.productModal__nav}>
        <button
          type="button"
          className={cn(
            styles.productModal__navItem,
            activeSection === "general" && styles["productModal__navItem--active"]
          )}
          onClick={() => scrollToSection("sec-general", "general")}
        >
          <span className={styles.productModal__navStep}>01</span>
          <Sparkles size={16} className={styles.productModal__navIcon} />
          <span className={styles.productModal__navLabel}>Thông tin</span>
        </button>

        <button
          type="button"
          className={cn(
            styles.productModal__navItem,
            activeSection === "pricing" && styles["productModal__navItem--active"]
          )}
          onClick={() => scrollToSection("sec-pricing", "pricing")}
        >
          <span className={styles.productModal__navStep}>02</span>
          <CircleDollarSign size={16} className={styles.productModal__navIcon} />
          <span className={styles.productModal__navLabel}>Giá & Biến thể</span>
        </button>

        <form.Subscribe
          selector={(state) => state.values.images?.length || 0}
          children={(imagesCount) => (
            <button
              type="button"
              className={cn(
                styles.productModal__navItem,
                activeSection === "media" && styles["productModal__navItem--active"]
              )}
              onClick={() => scrollToSection("sec-media", "media")}
            >
              <span className={styles.productModal__navStep}>03</span>
              <ImageIcon size={16} className={styles.productModal__navIcon} />
              <span className={styles.productModal__navLabel}>
                {currentPillar === "COSTUME" ? "Lookbook" : "Hình ảnh"} ({imagesCount})
              </span>
            </button>
          )}
        />

        <button
          type="button"
          className={cn(
            styles.productModal__navItem,
            activeSection === "specs" && styles["productModal__navItem--active"]
          )}
          onClick={() => scrollToSection("sec-specs", "specs")}
        >
          <span className={styles.productModal__navStep}>04</span>
          <PillarIcon size={16} className={styles.productModal__navIcon} />
          <span className={styles.productModal__navLabel}>{pillarConfig.specsTabLabel}</span>
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className={styles.productModal__form}
      >
        {/* Section 1: Thông tin cơ bản */}
        <div id="sec-general" className={styles.productModal__section}>
          <div className={styles.productModal__card}>
            <div className={styles.productModal__cardHeader}>
              <div className={styles.productModal__cardTitleGroup}>
                <div className={styles.productModal__cardIcon}>
                  <PillarIcon size={16} />
                </div>
                <div>
                  <h4 className={styles.productModal__cardTitle}>
                    1. Thông tin {pillarConfig.name.toLowerCase()}
                  </h4>
                  <span className={styles.productModal__cardSubtitle}>
                    {pillarConfig.generalCardSubtitle}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.productModal__row}>
              <form.Field name="name">
                {(field) => (
                  <TextField
                    label={t("product.name")}
                    placeholder={pillarConfig.namePlaceholder}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      const currentSlug = form.getFieldValue("slug");
                      if (!currentSlug || currentSlug === toSlug(field.state.value.slice(0, -1))) {
                        form.setFieldValue("slug", toSlug(e.target.value));
                      }
                    }}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors[0] ? String(field.state.meta.errors[0]) : undefined}
                    required
                  />
                )}
              </form.Field>

              <form.Field name="categoryId">
                {(field) => (
                  <div className={styles.productModal__categoryWrapper}>
                    <Select
                      label={t("product.category")}
                      placeholder={t("product.selectCategory")}
                      options={categoryOptions}
                      value={String(field.state.value || "")}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                      required
                    />
                    <div className={styles.productModal__categoryMeta}>
                      <span className={styles.productModal__pillarHint}>
                        Mảng kinh doanh:
                      </span>
                      <span
                        className={cn(
                          styles.productModal__pillarBadge,
                          styles[`productModal__pillarBadge--${currentPillar.toLowerCase()}`]
                        )}
                      >
                        <PillarIcon size={12} />
                        {pillarConfig.name}
                      </span>
                    </div>
                  </div>
                )}
              </form.Field>
            </div>

            <div className={styles.productModal__row}>
              <form.Field name="productCode">
                {(field) => (
                  <TextField
                    label={t("product.productCode")}
                    placeholder={pillarConfig.codePlaceholder}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                )}
              </form.Field>

              <form.Field name="slug">
                {(field) => (
                  <TextField
                    label={t("product.slug")}
                    placeholder={t("product.slugPlaceholder")}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                )}
              </form.Field>
            </div>

            <form.Field name="description">
              {(field) => (
                <TextArea
                  label={t("product.description")}
                  placeholder={t("product.descriptionPlaceholder")}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={3}
                />
              )}
            </form.Field>
          </div>
        </div>

        {/* Section 2: Giá & Biến thể */}
        <div id="sec-pricing" className={styles.productModal__section}>
          <div className={styles.productModal__card}>
            <div className={styles.productModal__cardHeader}>
              <div className={styles.productModal__cardTitleGroup}>
                <div className={styles.productModal__cardIcon}>
                  <CircleDollarSign size={16} />
                </div>
                <div>
                  <h4 className={styles.productModal__cardTitle}>
                    2. Bảng giá & Biến thể ({pillarConfig.name})
                  </h4>
                  <span className={styles.productModal__cardSubtitle}>
                    {pillarConfig.variantsSubtitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Giá thuê và Tiền cọc chia 2 cột */}
            <div className={styles.productModal__row}>
              <form.Field name="rentalPrice">
                {(field) => (
                  <div>
                    <TextField
                      label={pillarConfig.rentalPriceLabel}
                      type="number"
                      placeholder={t("product.rentalPricePlaceholder")}
                      value={field.state.value ? String(field.state.value) : ""}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors[0] ? String(field.state.meta.errors[0]) : undefined}
                      required
                    />
                    {Boolean(field.state.value && field.state.value > 0) && (
                      <div className={styles.productModal__pricePreview}>
                        ≈ {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(field.state.value)}
                        {currentPillar !== "PHOTOGRAPHY" ? " / ngày" : " (trọn gói)"}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="depositPrice">
                {(field) => (
                  <div>
                    <TextField
                      label={pillarConfig.depositPriceLabel}
                      type="number"
                      placeholder={t("product.depositPricePlaceholder")}
                      value={field.state.value ? String(field.state.value) : ""}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors[0] ? String(field.state.meta.errors[0]) : undefined}
                      required
                    />
                    {Boolean(field.state.value && field.state.value > 0) && (
                      <div className={styles.productModal__pricePreview}>
                        ≈ {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(field.state.value)}
                      </div>
                    )}
                    <div className={styles.productModal__quickPriceBtns}>
                      {pillarConfig.depositPresets.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          className={styles.productModal__pricePresetBtn}
                          onClick={() => {
                            const rPrice = form.getFieldValue("rentalPrice") || 0;
                            field.handleChange(preset.calculate(rPrice));
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form.Field>
            </div>

            {/* Trạng thái sản phẩm */}
            <form.Field name="status">
              {(field) => (
                <Select
                  label={t("product.status")}
                  options={statusOptions}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as ProductStatus)}
                  onBlur={field.handleBlur}
                  required
                />
              )}
            </form.Field>

            {/* Biến thể */}
            <form.Field name="variants">
              {(field) => {
                const variants = field.state.value;

                const handleAddVariant = (
                  size = pillarConfig.quickChips[0] || "Freesize",
                  color = pillarConfig.defaultVariant.color
                ) => {
                  const rawCode = form.getFieldValue("productCode") || "PROD";
                  const cleanCode = toSlug(rawCode).replace(/-/g, "").toUpperCase() || "PROD";
                  const cleanColor = toSlug(color).replace(/-/g, "").toUpperCase() || "COLOR";
                  const cleanSize = toSlug(size).replace(/-/g, "").toUpperCase() || "VAR";
                  const sku = `${cleanCode}-${cleanSize}-${cleanColor}`;
                  field.handleChange([...variants, { size, color, sku }]);
                };

                const handleRemoveVariant = (index: number) => {
                  if (variants.length <= 1) return;
                  field.handleChange(variants.filter((_, i) => i !== index));
                };

                const handleVariantChange = (
                  index: number,
                  vField: "size" | "color" | "sku",
                  value: string
                ) => {
                  const copy = [...variants];
                  copy[index] = { ...copy[index], [vField]: value };
                  field.handleChange(copy);
                };

                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PillarIcon size={16} className="text-burgundy" />
                        <span className="text-sm font-semibold text-ink">
                          {pillarConfig.variantsTitle} ({variants.length})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleAddVariant(
                            pillarConfig.quickChips[0] || "Freesize",
                            pillarConfig.defaultVariant.color
                          )
                        }
                      >
                        <Plus size={14} className="mr-1" />
                        {t("product.addVariant")}
                      </Button>
                    </div>

                    <div className={styles.productModal__quickChips}>
                      <span className={styles.productModal__quickChipsLabel}>
                        {pillarConfig.quickChipsLabel}
                      </span>
                      {pillarConfig.quickChips.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={styles.productModal__chipBtn}
                          onClick={() => handleAddVariant(s, pillarConfig.defaultVariant.color)}
                        >
                          +{s}
                        </button>
                      ))}
                    </div>

                    <div className={styles.productModal__variantsList}>
                      {variants.map((v, idx) => (
                        <div key={idx} className={styles.productModal__variantItem}>
                          {currentPillar === "COSTUME" ? (
                            <Select
                              placeholder={pillarConfig.sizePlaceholder}
                              options={sizeOptions}
                              value={v.size}
                              onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                            />
                          ) : (
                            <TextField
                              placeholder={pillarConfig.sizePlaceholder}
                              value={v.size}
                              onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                            />
                          )}

                          <TextField
                            placeholder={pillarConfig.colorPlaceholder}
                            value={v.color}
                            onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                          />

                          <TextField
                            placeholder="Mã SKU (tùy chọn)"
                            value={v.sku || ""}
                            onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                          />

                          <button
                            type="button"
                            className={styles.productModal__deleteBtn}
                            onClick={() => handleRemoveVariant(idx)}
                            disabled={variants.length <= 1}
                            title="Xóa biến thể"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            </form.Field>
          </div>
        </div>

        {/* Section 3: Thư viện hình ảnh */}
        <div id="sec-media" className={styles.productModal__section}>
          <div className={styles.productModal__card}>
            <form.Field name="images">
              {(field) => {
                const images = field.state.value;

                const handleSetThumbnail = (index: number) => {
                  field.handleChange(
                    images.map((img, i) => ({
                      ...img,
                      isThumbnail: i === index,
                    }))
                  );
                };

                const handleRemoveImage = (index: number) => {
                  const filtered = images.filter((_, i) => i !== index);
                  if (filtered.length > 0 && !filtered.some((img) => img.isThumbnail)) {
                    filtered[0].isThumbnail = true;
                  }
                  field.handleChange(filtered);
                };

                return (
                  <>
                    <div className={styles.productModal__cardHeader}>
                      <div className={styles.productModal__cardTitleGroup}>
                        <div className={styles.productModal__cardIcon}>
                          <ImageIcon size={16} />
                        </div>
                        <div>
                          <h4 className={styles.productModal__cardTitle}>
                            {pillarConfig.mediaTitle} ({images.length})
                          </h4>
                          <span className={styles.productModal__cardSubtitle}>
                            {pillarConfig.mediaSubtitle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* DropZone tải ảnh */}
                    <div
                      className={cn(
                        styles.productModal__dropZone,
                        isUploading && styles["productModal__dropZone--uploading"]
                      )}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className={styles.productModal__hiddenFileInput}
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                      <div className={styles.productModal__dropIcon}>
                        {isUploading ? (
                          <Loader2 size={24} className="animate-spin" />
                        ) : (
                          <UploadCloud size={24} />
                        )}
                      </div>
                      <div className={styles.productModal__dropTitle}>
                        {isUploading
                          ? "Đang lưu ảnh lên máy chủ Chickie..."
                          : "Nhấn để chọn ảnh từ máy hoặc kéo thả vào đây"}
                      </div>
                      <div className={styles.productModal__dropSubtitle}>
                        Hỗ trợ PNG, JPG, WEBP • Tối đa 10MB mỗi ảnh • Tự động tối ưu
                      </div>
                    </div>

                    {/* Grid ảnh */}
                    {images.length > 0 ? (
                      <div className={styles.productModal__imageGrid}>
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              styles.productModal__imageCard,
                              img.isThumbnail && styles["productModal__imageCard--thumbnail"]
                            )}
                          >
                            <img src={img.imageUrl} alt={`Ảnh ${idx + 1}`} />
                            {img.isThumbnail && (
                              <span className={styles.productModal__thumbBadge}>Ảnh bìa</span>
                            )}
                            <div className={styles.productModal__imageCardActions}>
                              <button
                                type="button"
                                className={cn(
                                  styles.productModal__actionIconBtn,
                                  styles.productModal__starBtn,
                                  img.isThumbnail && styles["productModal__starBtn--active"]
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetThumbnail(idx);
                                }}
                                title={img.isThumbnail ? "Đang là ảnh bìa" : "Đặt làm ảnh bìa chính"}
                              >
                                <Star size={12} fill={img.isThumbnail ? "currentColor" : "none"} />
                              </button>
                              <button
                                type="button"
                                className={cn(
                                  styles.productModal__actionIconBtn,
                                  styles.productModal__trashBtn
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(idx);
                                }}
                                title="Xóa ảnh"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.productModal__emptyImage}>
                        <ImageIcon size={28} />
                        <span>{pillarConfig.mediaEmptyNotice}</span>
                      </div>
                    )}
                  </>
                );
              }}
            </form.Field>
          </div>
        </div>

        {/* Section 4: Đặc tính chuyên biệt */}
        <div id="sec-specs" className={styles.productModal__section}>
          <div className={styles.productModal__card}>
            <div className={styles.productModal__cardHeader}>
              <div className={styles.productModal__cardTitleGroup}>
                <div className={styles.productModal__cardIcon}>
                  <PillarIcon size={16} />
                </div>
                <div>
                  <h4 className={styles.productModal__cardTitle}>
                    {pillarConfig.specsTitle}
                  </h4>
                  <span className={styles.productModal__cardSubtitle}>
                    {pillarConfig.specsSubtitle}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.productModal__row}>
              <form.Field name="material">
                {(field) => (
                  <TextField
                    label={pillarConfig.materialLabel}
                    placeholder={pillarConfig.materialPlaceholder}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                )}
              </form.Field>

              <form.Field name="occasion">
                {(field) => (
                  <TextField
                    label={pillarConfig.occasionLabel}
                    placeholder={pillarConfig.occasionPlaceholder}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                )}
              </form.Field>
            </div>
          </div>
        </div>

        {/* Global Validation Error Notice */}
        {validationError && (
          <div className={styles.productModal__error}>{validationError}</div>
        )}

        {/* Sticky Drawer Footer Action Bar */}
        <div className={styles.productModal__footerActions}>
          <div className={styles.productModal__footerHint}>
            <span>Mẹo: Nhấn</span>
            <kbd>Ctrl</kbd> + <kbd>S</kbd>
            <span>để lưu nhanh bất kỳ lúc nào</span>
          </div>

          <div className={styles.productModal__btnGroup}>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? t("common.loading") : t("common.save")}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
