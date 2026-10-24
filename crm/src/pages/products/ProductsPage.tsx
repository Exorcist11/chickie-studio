import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Eye, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ProductDetailResponse,
  ProductListResponse,
  ProductQueryParams,
  ProductStatus,
} from "../../types/product";
import { Category } from "../../types/category";
import { categoryService } from "../../services/category.service";
import { productService } from "../../services/product.service";
import { PageHeader } from "../../components/common/PageHeader";
import { DataTable, ColumnType } from "../../components/common/DataTable";
import { FilterBar, FilterValues } from "../../components/common/FilterBar";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ProductModal, ProductViewModal } from "./components";
import styles from "./ProductsPage.module.scss";

export const ProductsPage: React.FC = () => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<ProductQueryParams>({});

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetailResponse | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductDetailResponse | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductListResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load categories for selector
  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch {
      // Handled
    }
  }, []);

  const fetchProducts = useCallback(async (params?: ProductQueryParams) => {
    try {
      setLoading(true);
      const res = await productService.getProducts(params);
      setProducts(res.content || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleFilterChange = (filters: FilterValues) => {
    const params: ProductQueryParams = {
      search: filters.search || undefined,
      status:
        filters.selectValue && filters.selectValue !== "ALL"
          ? (filters.selectValue as ProductStatus)
          : undefined,
    };
    setCurrentFilters(params);
    fetchProducts(params);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (prod: ProductListResponse) => {
    try {
      setActionLoading(true);
      const detail = await productService.getProductById(prod.id);
      setEditingProduct(detail);
      setIsModalOpen(true);
    } catch {
      // Handled
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenViewModal = async (prod: ProductListResponse) => {
    try {
      setActionLoading(true);
      const detail = await productService.getProductById(prod.id);
      setViewingProduct(detail);
    } catch {
      // Handled
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      setDeleteLoading(true);
      await productService.deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
      await fetchProducts(currentFilters);
    } catch {
      // Handled
    } finally {
      setDeleteLoading(false);
    }
  };

  const statusOptions = [
    { value: "ALL", label: t("common.all") },
    { value: "ACTIVE", label: t("product.active") },
    { value: "INACTIVE", label: t("product.inactive") },
    { value: "ARCHIVED", label: t("product.archived") },
  ];

  const columns: ColumnType<ProductListResponse>[] = [
    {
      title: t("product.thumbnail"),
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      width: "70px",
      render: (_, record) =>
        record.thumbnailUrl ? (
          <img
            src={record.thumbnailUrl}
            alt={record.name}
            className={styles.productsPage__thumbnail}
          />
        ) : (
          <div className={styles.productsPage__noThumb}>
            <ImageIcon size={18} />
          </div>
        ),
    },
    {
      title: t("product.productCode"),
      dataIndex: "productCode",
      key: "productCode",
      width: "140px",
      render: (val) => <span className={styles.productsPage__code}>{val}</span>,
    },
    {
      title: t("product.name"),
      dataIndex: "name",
      key: "name",
      render: (val, record) => (
        <div className={styles.productsPage__productInfo}>
          <span className={styles.productsPage__productName}>{val}</span>
          <span className={styles.productsPage__productSlug}>{record.slug}</span>
        </div>
      ),
    },
    {
      title: t("product.category"),
      dataIndex: "categoryName",
      key: "categoryName",
      render: (val) => (
        <Badge variant="outline" className={styles.productsPage__categoryBadge}>
          {val}
        </Badge>
      ),
    },
    {
      title: t("product.rentalPrice"),
      dataIndex: "rentalPrice",
      key: "rentalPrice",
      render: (val) => (
        <span className={styles.productsPage__price}>
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
            Number(val)
          )}
        </span>
      ),
    },
    {
      title: t("product.depositPrice"),
      dataIndex: "depositPrice",
      key: "depositPrice",
      render: (val) => (
        <span className={styles.productsPage__deposit}>
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
            Number(val)
          )}
        </span>
      ),
    },
    {
      title: t("product.variantCount"),
      dataIndex: "variantCount",
      key: "variantCount",
      render: (val) => (
        <Badge variant="secondary">
          {val} {t("product.variants").toLowerCase()}
        </Badge>
      ),
    },
    {
      title: t("product.status"),
      dataIndex: "status",
      key: "status",
      render: (val: ProductStatus) => {
        const variant =
          val === "ACTIVE" ? "success" : val === "INACTIVE" ? "warning" : "secondary";
        const label =
          val === "ACTIVE"
            ? t("product.active")
            : val === "INACTIVE"
            ? t("product.inactive")
            : t("product.archived");
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      title: t("common.actions"),
      key: "actions",
      render: (_, record) => (
        <div className={styles.productsPage__actions}>
          <button
            type="button"
            className={styles.productsPage__actionBtn}
            onClick={() => handleOpenViewModal(record)}
            title={t("common.view")}
            aria-label="Xem chi tiết"
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            className={styles.productsPage__actionBtn}
            onClick={() => handleOpenEditModal(record)}
            title={t("common.edit")}
            aria-label="Chỉnh sửa"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            className={`${styles.productsPage__actionBtn} ${styles["productsPage__actionBtn--delete"]}`}
            onClick={() => setDeletingProduct(record)}
            title={t("common.delete")}
            aria-label="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.productsPage}>
      <PageHeader
        title={t("product.title")}
        subtitle={t("product.subtitle")}
        actions={
          <Button onClick={handleOpenAddModal}>
            <Plus size={16} className="mr-1.5" />
            {t("product.addProduct")}
          </Button>
        }
      />

      <FilterBar
        onFilterChange={handleFilterChange}
        selectOptions={statusOptions}
        selectPlaceholder={t("product.status")}
        searchPlaceholder={t("common.search")}
      />

      <DataTable<ProductListResponse>
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading || actionLoading}
      />

      {/* Modal Thêm / Chỉnh Sửa */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchProducts(currentFilters)}
        product={editingProduct}
        categories={categories}
      />

      {/* Modal Xem Chi Tiết */}
      <ProductViewModal
        isOpen={Boolean(viewingProduct)}
        onClose={() => setViewingProduct(null)}
        product={viewingProduct}
        categories={categories}
      />

      {/* Modal Xác Nhận Xóa */}
      <ConfirmModal
        open={Boolean(deletingProduct)}
        title={t("product.deleteConfirmTitle")}
        content={
          <p className="text-sm text-stone-600">
            {t("product.deleteConfirmDesc")} <strong>{deletingProduct?.name}</strong>?
          </p>
        }
        okText={t("common.delete")}
        cancelText={t("common.cancel")}
        confirmLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProduct(null)}
      />
    </div>
  );
};

export default ProductsPage;
