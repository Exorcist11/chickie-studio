import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  ShieldCheck,
  Tag,
  Layers,
  Calendar,
  Sparkles,
  CheckCircle2,
  Share2,
  Folder,
  Scissors,
  Boxes,
} from "lucide-react";
import { cn } from "../../../../lib/cn";
import { Modal } from "../../../../components/common/Modal";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { ProductDetailResponse } from "../../../../types/product";
import { Category, CategoryType } from "../../../../types/category";
import { PILLAR_PRODUCT_CONFIG } from "../../constants";
import { ProductItemsTab } from "../ProductItemsTab/ProductItemsTab";
import styles from "./ProductViewModal.module.scss";

type DetailTab = "overview" | "variants" | "items" | "gallery";

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetailResponse | null;
  categories?: Category[];
  onEdit?: (product: ProductDetailResponse) => void;
}

export const ProductViewModal: React.FC<ProductViewModalProps> = ({
  isOpen,
  onClose,
  product,
  categories = [],
  onEdit,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Reset tab and image index when product changes
  useEffect(() => {
    if (product) {
      setActiveTab("overview");
      setSelectedImgIndex(0);
      setCopiedField(null);
    }
  }, [product]);

  // Deposit ratio calculation (called unconditionally for hooks consistency)
  const depositRatio = useMemo(() => {
    if (!product || !product.rentalPrice || product.rentalPrice <= 0) return null;
    const ratio = Math.round((product.depositPrice / product.rentalPrice) * 100);
    return `${ratio}%`;
  }, [product]);

  // Unique sizes and colors count
  const variantStats = useMemo(() => {
    const variants = product?.variants || [];
    const sizes = new Set(variants.map((v) => v.size).filter(Boolean));
    const colors = new Set(variants.map((v) => v.color).filter(Boolean));
    return {
      total: variants.length,
      sizesList: Array.from(sizes).join(", ") || "—",
      colorsList: Array.from(colors).join(", ") || "—",
    };
  }, [product?.variants]);

  if (!product) return null;

  const images = product.images || [];
  const currentImg = images[selectedImgIndex]?.imageUrl || images[0]?.imageUrl;

  // Resolve business pillar for the product
  const matchedCategory = categories.find((c) => c.id === product.categoryId);
  const pillarType: CategoryType = matchedCategory?.type || "COSTUME";
  const pillarConfig = PILLAR_PRODUCT_CONFIG[pillarType];
  const PillarIcon = pillarConfig.icon;

  // Formatting currency
  const formatVnd = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  // Copy helper
  const handleCopy = async (text: string, fieldKey: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Handled
    }
  };

  const handlePrevImg = () => {
    if (images.length <= 1) return;
    setSelectedImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = () => {
    if (images.length <= 1) return;
    setSelectedImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Public Web link (e.g., client at localhost:3000)
  const clientProductUrl = `http://localhost:3000/products/${product.slug}`;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("product.viewProduct")}
      subtitle={t("product.viewSubtitle")}
      icon={<PillarIcon size={18} className="text-burgundy" />}
      maxWidth="2xl"
      className={styles.productViewModalCard}
      headerExtra={
        <a
          href={clientProductUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-line bg-white hover:bg-warm-white text-ink transition-colors"
          title={t("product.openPublicPage")}
        >
          <ExternalLink size={14} />
          <span className="hidden sm:inline">{t("product.openPublicPage")}</span>
        </a>
      }
      footer={
        <div className={styles.productViewModal__footer}>
          <div className={styles.productViewModal__footerMeta}>
            <span>ID: #{product.id}</span>
            {product.createdAt && (
              <span>Ngày tạo: {new Date(product.createdAt).toLocaleDateString("vi-VN")}</span>
            )}
          </div>

          <div className={styles.productViewModal__footerBtns}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(window.location.href, "direct-link")}
              className="gap-1.5"
            >
              {copiedField === "direct-link" ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span>{t("product.copiedDirectLink")}</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>{t("product.copyDirectLink")}</span>
                </>
              )}
            </Button>

            {onEdit && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEdit(product)}
                className="gap-1.5"
              >
                <Edit2 size={14} />
                <span>{t("product.editProduct")}</span>
              </Button>
            )}

            <Button variant="secondary" size="sm" onClick={onClose}>
              {t("common.close", "Đóng")}
            </Button>
          </div>
        </div>
      }
    >
      <div className={styles.productViewModal}>
        {/* HERO HEADER BANNER */}
        <div className={styles.productViewModal__heroCard}>
          <div className={styles.productViewModal__heroTop}>
            <div className={styles.productViewModal__heroBadges}>
              {/* Product Code Chip with Copy */}
              <div className={styles.productViewModal__codeChip}>
                <span>{product.productCode}</span>
                <button
                  type="button"
                  className={styles.productViewModal__copyBtn}
                  onClick={() => handleCopy(product.productCode, "code")}
                  title={copiedField === "code" ? t("product.copiedCode") : t("product.copyCode")}
                  aria-label={t("product.copyCode")}
                >
                  {copiedField === "code" ? (
                    <Check size={13} className="text-emerald-600" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>

              {/* Business Pillar Badge */}
              <span
                className={cn(
                  styles.productViewModal__pillarBadge,
                  styles[`productViewModal__pillarBadge--${pillarType.toLowerCase()}`]
                )}
              >
                <PillarIcon size={13} />
                {pillarConfig.badgeLabel}
              </span>

              {/* Category Tag */}
              {product.categoryName && (
                <Badge variant="outline" className="gap-1 bg-white text-xs">
                  <Folder size={12} className="text-burgundy" />
                  {product.categoryName}
                </Badge>
              )}
            </div>

            {/* Status Pill */}
            <Badge
              variant={
                product.status === "ACTIVE"
                  ? "success"
                  : product.status === "INACTIVE"
                  ? "warning"
                  : "secondary"
              }
              className="font-medium"
            >
              {product.status === "ACTIVE"
                ? t("product.active")
                : product.status === "INACTIVE"
                ? t("product.inactive")
                : t("product.archived")}
            </Badge>
          </div>

          {/* Product Name Title */}
          <div className={styles.productViewModal__heroTitleBlock}>
            <h2 className={styles.productViewModal__productName}>{product.name}</h2>
            <div className={styles.productViewModal__heroMeta}>
              <span className={styles.productViewModal__metaItem}>
                <span>Slug:</span>
                <code className="text-xs text-burgundy font-mono">{product.slug}</code>
              </span>
              <span className={styles.productViewModal__metaDot}>•</span>
              <span className={styles.productViewModal__metaItem}>
                <span>{t("product.variantCount")}:</span>
                <strong className="text-ink">{product.variants?.length || 0}</strong>
              </span>
              <span className={styles.productViewModal__metaDot}>•</span>
              <span className={styles.productViewModal__metaItem}>
                <span>{t("product.images")}:</span>
                <strong className="text-ink">{images.length}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className={styles.productViewModal__tabsBar} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "overview"}
            className={cn(
              styles.productViewModal__tabBtn,
              activeTab === "overview" && styles["productViewModal__tabBtn--active"]
            )}
            onClick={() => setActiveTab("overview")}
          >
            <Layers size={16} />
            <span>{t("product.overviewTab")}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "variants"}
            className={cn(
              styles.productViewModal__tabBtn,
              activeTab === "variants" && styles["productViewModal__tabBtn--active"]
            )}
            onClick={() => setActiveTab("variants")}
          >
            <Tag size={16} />
            <span>{t("product.variantsTab")}</span>
            <span className={styles.productViewModal__tabCount}>
              {product.variants?.length || 0}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "items"}
            className={cn(
              styles.productViewModal__tabBtn,
              activeTab === "items" && styles["productViewModal__tabBtn--active"]
            )}
            onClick={() => setActiveTab("items")}
          >
            <Boxes size={16} />
            <span>{t("productItem.title", "Kho đồ thực tế")}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "gallery"}
            className={cn(
              styles.productViewModal__tabBtn,
              activeTab === "gallery" && styles["productViewModal__tabBtn--active"]
            )}
            onClick={() => setActiveTab("gallery")}
          >
            <ImageIcon size={16} />
            <span>{t("product.galleryTab")}</span>
            <span className={styles.productViewModal__tabCount}>{images.length}</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & PRICING */}
        {activeTab === "overview" && (
          <div className={styles.productViewModal__overviewGrid}>
            {/* Gallery Column */}
            <div className={styles.productViewModal__galleryCol}>
              <div className={styles.productViewModal__mainFrame}>
                {currentImg ? (
                  <>
                    <img src={currentImg} alt={product.name} />
                    {images[selectedImgIndex]?.isThumbnail && (
                      <span className={styles.productViewModal__imageBadge}>
                        <Sparkles size={11} />
                        {t("product.thumbnailBadge")}
                      </span>
                    )}
                    {images.length > 1 && (
                      <span className={styles.productViewModal__imageCounter}>
                        {selectedImgIndex + 1} / {images.length}
                      </span>
                    )}
                    {images.length > 1 && (
                      <div className={styles.productViewModal__navArrows}>
                        <button
                          type="button"
                          className={styles.productViewModal__navBtn}
                          onClick={handlePrevImg}
                          aria-label="Ảnh trước"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          className={styles.productViewModal__navBtn}
                          onClick={handleNextImg}
                          aria-label="Ảnh kế tiếp"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.productViewModal__noImageFallback}>
                    <ImageIcon size={36} />
                    <span>{t("product.noImages")}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails Strip */}
              {images.length > 1 && (
                <div className={styles.productViewModal__thumbStrip}>
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      type="button"
                      className={cn(
                        styles.productViewModal__thumbBtn,
                        selectedImgIndex === idx && styles["productViewModal__thumbBtn--active"]
                      )}
                      onClick={() => setSelectedImgIndex(idx)}
                      aria-label={`Xem ảnh ${idx + 1}`}
                    >
                      <img src={img.imageUrl} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Content Column */}
            <div className={styles.productViewModal__detailsCol}>
              {/* Luxury Pricing Card */}
              <div className={styles.productViewModal__pricingCard}>
                <div className={styles.productViewModal__pricingRow}>
                  <div className={styles.productViewModal__priceBlock}>
                    <span className={styles.productViewModal__priceLabel}>
                      {pillarConfig.rentalPriceLabel}
                    </span>
                    <span className={styles.productViewModal__rentalVal}>
                      {formatVnd(product.rentalPrice)}
                      <small>/ ngày</small>
                    </span>
                  </div>

                  <div className={styles.productViewModal__priceBlock}>
                    <span className={styles.productViewModal__priceLabel}>
                      {pillarConfig.depositPriceLabel}
                    </span>
                    <div className={styles.productViewModal__depositVal}>
                      <span>{formatVnd(product.depositPrice)}</span>
                      {depositRatio && (
                        <span className={styles.productViewModal__depositRatioPill}>
                          Cọc {depositRatio}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.productViewModal__depositNote}>
                  <ShieldCheck size={16} />
                  <span>{t("product.depositNote")}</span>
                </div>
              </div>

              {/* Bento Specifications Grid */}
              <div className={styles.productViewModal__specsGrid}>
                {/* Spec 1: Danh mục */}
                <div className={styles.productViewModal__specCard}>
                  <div className={styles.productViewModal__specHeader}>
                    <Folder size={14} />
                    <span>{t("product.category")}</span>
                  </div>
                  <div className={styles.productViewModal__specContent}>
                    {product.categoryName || "—"}
                  </div>
                </div>

                {/* Spec 2: Mảng dịch vụ */}
                <div className={styles.productViewModal__specCard}>
                  <div className={styles.productViewModal__specHeader}>
                    <PillarIcon size={14} />
                    <span>Mảng dịch vụ</span>
                  </div>
                  <div className={styles.productViewModal__specContent}>
                    {pillarConfig.name}
                  </div>
                </div>

                {/* Spec 3: Chất liệu / Phụ kiện */}
                <div className={styles.productViewModal__specCard}>
                  <div className={styles.productViewModal__specHeader}>
                    <Scissors size={14} />
                    <span>{pillarConfig.materialLabel}</span>
                  </div>
                  <div className={styles.productViewModal__specContent}>
                    {product.material || "—"}
                  </div>
                </div>

                {/* Spec 4: Dịp sự kiện / Tính năng */}
                <div className={styles.productViewModal__specCard}>
                  <div className={styles.productViewModal__specHeader}>
                    <Calendar size={14} />
                    <span>{pillarConfig.occasionLabel}</span>
                  </div>
                  <div className={styles.productViewModal__specContent}>
                    {product.occasion || "—"}
                  </div>
                </div>
              </div>

              {/* Description Block */}
              {product.description && (
                <div className={styles.productViewModal__descBlock}>
                  <h4 className={styles.productViewModal__descTitle}>{t("product.description")}</h4>
                  <p className={styles.productViewModal__descText}>{product.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: VARIANTS & INVENTORY */}
        {activeTab === "variants" && (
          <div className={styles.productViewModal__variantsTabPane}>
            <div className={styles.productViewModal__statsRow}>
              <div className={styles.productViewModal__statBox}>
                <span className={styles.productViewModal__statLabel}>
                  {t("product.variantCount")}
                </span>
                <span className={styles.productViewModal__statVal}>
                  {variantStats.total}
                </span>
              </div>
              <div className={styles.productViewModal__statBox}>
                <span className={styles.productViewModal__statLabel}>
                  {pillarConfig.sizeFieldLabel} có sẵn
                </span>
                <span className={styles.productViewModal__statVal}>
                  {variantStats.sizesList}
                </span>
              </div>
              <div className={styles.productViewModal__statBox}>
                <span className={styles.productViewModal__statLabel}>
                  {pillarConfig.colorFieldLabel} có sẵn
                </span>
                <span className={styles.productViewModal__statVal}>
                  {variantStats.colorsList}
                </span>
              </div>
            </div>

            <div className={styles.productViewModal__variantsTableWrap}>
              <table className={styles.productViewModal__table}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>{t("product.sku")}</th>
                    <th>{pillarConfig.sizeFieldLabel}</th>
                    <th>{pillarConfig.colorFieldLabel}</th>
                    <th>{t("product.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants && product.variants.length > 0 ? (
                    product.variants.map((v, i) => (
                      <tr key={v.id || i}>
                        <td className="text-ink-muted text-xs">#{i + 1}</td>
                        <td>
                          <div className={styles.productViewModal__skuCell}>
                            <span>{v.sku}</span>
                            <button
                              type="button"
                              className={styles.productViewModal__copyBtn}
                              onClick={() => handleCopy(v.sku || "", `sku-${i}`)}
                              title="Sao chép SKU"
                              aria-label={`Sao chép SKU ${v.sku || ""}`}
                            >
                              {copiedField === `sku-${i}` ? (
                                <Check size={12} className="text-emerald-600" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className={styles.productViewModal__sizePill}>{v.size}</span>
                        </td>
                        <td>
                          <div className={styles.productViewModal__colorIndicator}>
                            <span className="w-2.5 h-2.5 rounded-full bg-burgundy/40 border border-burgundy inline-block" />
                            <span>{v.color}</span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.productViewModal__statusPill}>
                            <CheckCircle2 size={14} />
                            {t("product.readyToRent")}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-ink-muted">
                        {t("product.noVariants")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA & LOOKBOOK GALLERY */}
        {activeTab === "gallery" && (
          <div>
            {images.length > 0 ? (
              <div className={styles.productViewModal__galleryGrid}>
                {images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className={styles.productViewModal__galleryCard}
                    onClick={() => {
                      setSelectedImgIndex(idx);
                      setActiveTab("overview");
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Xem ảnh lớn ${idx + 1}`}
                  >
                    <img src={img.imageUrl} alt={`${product.name} ${idx + 1}`} />
                    <div className={styles.productViewModal__galleryCardOverlay}>
                      <span className="text-xs font-medium">Ảnh #{idx + 1}</span>
                      {img.isThumbnail && (
                        <Badge variant="success" className="text-[10px] py-0.5">
                          {t("product.thumbnailBadge")}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.productViewModal__emptyNotice}>
                <ImageIcon size={40} />
                <p>{t("product.noImages")}</p>
              </div>
            )}
          </div>
        )}
        {/* TAB 4: ITEM INSTANCES / KHO ĐỒ THỰC TẾ (CAT-003) */}
        {activeTab === "items" && (
          <ProductItemsTab product={product} />
        )}
      </div>
    </Modal>
  );
};

export default ProductViewModal;
