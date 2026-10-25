import React, { useState, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  Copy,
  Check,
  ArrowRightLeft,
  Trash2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/Button";
import { TextField } from "../../../../components/ui/TextField";
import { Select } from "../../../../components/ui/Select";
import { Spinner } from "../../../../components/ui/Spinner";
import { ConfirmModal } from "../../../../components/common/ConfirmModal";
import { ProductDetailResponse } from "../../../../types/product";
import { ProductItem } from "../../../../types/productItem";
import {
  useDeleteProductItemMutation,
  useProductItemsByProduct,
} from "../../../../hooks/queries/useProductItemQueries";
import { ItemStatusBadge } from "../ItemStatusBadge/ItemStatusBadge";
import { CreateItemModal } from "../CreateItemModal/CreateItemModal";
import { ItemStatusChangeModal } from "../ItemStatusChangeModal/ItemStatusChangeModal";
import { cn } from "../../../../lib/cn";
import styles from "./ProductItemsTab.module.scss";

interface ProductItemsTabProps {
  product: ProductDetailResponse;
}

export const ProductItemsTab: React.FC<ProductItemsTabProps> = ({ product }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [statusModalItem, setStatusModalItem] = useState<ProductItem | null>(null);
  const [deleteModalItem, setDeleteModalItem] = useState<ProductItem | null>(null);

  const { data: items = [], isLoading, isError, refetch } = useProductItemsByProduct(product.id);
  const deleteMutation = useDeleteProductItemMutation(product.id);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalItem) return;
    try {
      await deleteMutation.mutateAsync(deleteModalItem.id);
      setDeleteModalItem(null);
    } catch {
      // Delete failure handled by mutation
    }
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchVariant =
        selectedVariantId === "ALL" || String(item.variantId) === selectedVariantId;
      const matchSearch =
        !search.trim() ||
        item.itemCode.toLowerCase().includes(search.toLowerCase()) ||
        (item.note && item.note.toLowerCase().includes(search.toLowerCase()));
      return matchVariant && matchSearch;
    });
  }, [items, selectedVariantId, search]);

  // Statistics calculation
  const stats = useMemo(() => {
    return {
      total: items.length,
      available: items.filter((i) => i.status === "AVAILABLE").length,
      rented: items.filter((i) => i.status === "RENTED").length,
      laundry: items.filter((i) => i.status === "LAUNDRY").length,
      maintenance: items.filter((i) => i.status === "MAINTENANCE").length,
    };
  }, [items]);

  const variantFilterOptions = [
    { value: "ALL", label: t("common.all", "Tất cả biến thể") },
    ...(product.variants || []).map((v) => ({
      value: String(v.id),
      label: `${v.size} - ${v.color}`,
    })),
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-3" role="status">
        <Spinner size="lg" />
        <span className="text-xs text-stone-500 font-medium">{t("common.loading", "Đang tải dữ liệu...")}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-xl border border-red-200 flex flex-col items-center gap-3">
        <AlertTriangle className="w-8 h-8 text-red-500" />
        <span className="text-sm font-semibold text-red-700">Không thể tải danh sách món đồ thực tế</span>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          {t("common.retry", "Thử lại")}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.tabContainer}>
      {/* 5 KPI Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t("productItem.totalItems", "Tổng đồ")}</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={cn(styles.statCard, styles["statCard--available"])}>
          <span className={styles.statLabel}>{t("productItem.availableCount", "Sẵn sàng")}</span>
          <span className={cn(styles.statValue, "text-emerald-700")}>{stats.available}</span>
        </div>
        <div className={cn(styles.statCard, styles["statCard--rented"])}>
          <span className={styles.statLabel}>{t("productItem.rentedCount", "Đang thuê")}</span>
          <span className={cn(styles.statValue, "text-sky-700")}>{stats.rented}</span>
        </div>
        <div className={cn(styles.statCard, styles["statCard--laundry"])}>
          <span className={styles.statLabel}>{t("productItem.laundryCount", "Giặt ủi")}</span>
          <span className={cn(styles.statValue, "text-amber-700")}>{stats.laundry}</span>
        </div>
        <div className={cn(styles.statCard, styles["statCard--maintenance"])}>
          <span className={styles.statLabel}>{t("productItem.maintenanceCount", "Bảo dưỡng")}</span>
          <span className={cn(styles.statValue, "text-rose-700")}>{stats.maintenance}</span>
        </div>
      </div>

      {/* Toolbar Filters & Add Action */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("common.search", "Tìm mã barcode, ghi chú...")}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.variantSelect}>
            <Select
              value={selectedVariantId}
              onValueChange={setSelectedVariantId}
              options={variantFilterOptions}
            />
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {t("productItem.addItem", "Thêm đồ vào kho")}
        </Button>
      </div>

      {/* Items Table */}
      {filteredItems.length === 0 ? (
        <div className={styles.emptyState}>
          <Package className={styles.emptyIcon} />
          <p className={styles.emptyText}>
            {search || selectedVariantId !== "ALL"
              ? "Không tìm thấy món đồ phù hợp với bộ lọc."
              : t("productItem.noItems", "Chưa có món đồ vật lý nào trong kho cho sản phẩm này.")}
          </p>
          <p className={styles.emptySub}>
            Tạo từng món đồ cụ thể để in tem barcode dán lên mác đồ/máy ảnh và theo dõi chu kỳ cho thuê.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            {t("productItem.addItem", "Thêm đồ vật lý đầu tiên")}
          </Button>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("productItem.itemCode", "Mã Barcode")}</th>
                  <th>{t("product.variants", "Biến thể")}</th>
                  <th>{t("productItem.status", "Trạng thái")}</th>
                  <th>{t("productItem.rentalCount", "Số lượt thuê")}</th>
                  <th>{t("productItem.note", "Ghi chú")}</th>
                  <th className="text-right">{t("common.actions", "Thao tác")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const isHighRental = item.rentalCount >= 15;
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className={styles.codeCell}>
                          <span>{item.itemCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(item.itemCode)}
                            className={styles.copyCodeBtn}
                            title="Sao chép mã Barcode"
                            aria-label={`Copy barcode ${item.itemCode}`}
                          >
                            {copiedCode === item.itemCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className={styles.variantInfo}>
                          <span className={styles.variantMain}>
                            {item.variantSize} - {item.variantColor}
                          </span>
                          <span className={styles.variantSku}>{item.variantSku}</span>
                        </div>
                      </td>
                      <td>
                        <ItemStatusBadge status={item.status} />
                      </td>
                      <td>
                        <div className={styles.rentalCell}>
                          <span className="font-mono font-bold">{item.rentalCount}</span>
                          {isHighRental && (
                            <span
                              className={styles.rentalWarning}
                              title={t(
                                "productItem.maintenanceWarning",
                                "Đã thuê > 15 lần, nên bảo dưỡng"
                              )}
                            >
                              Bảo dưỡng
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="text-stone-600 line-clamp-1 italic">
                          {item.note || "-"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionsCell}>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStatusModalItem(item)}
                            title={t("productItem.changeStatus", "Chuyển trạng thái")}
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
                            <span>{t("productItem.changeStatus", "Đổi trạng thái")}</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteModalItem(item)}
                            disabled={item.status === "RENTED"}
                            title={t("common.delete", "Xóa")}
                            className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-1.5"
                            aria-label={`Delete item ${item.itemCode}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Item Modal */}
      {isCreateOpen && (
        <CreateItemModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          product={product}
        />
      )}

      {/* Change Status Modal */}
      {statusModalItem && (
        <ItemStatusChangeModal
          open={!!statusModalItem}
          onClose={() => setStatusModalItem(null)}
          item={statusModalItem}
          productId={product.id}
        />
      )}

      {/* Confirm Delete Modal */}
      {deleteModalItem && (
        <ConfirmModal
          open={!!deleteModalItem}
          onCancel={() => setDeleteModalItem(null)}
          onConfirm={handleDeleteConfirm}
          title={t("productItem.deleteTitle", "Xóa món đồ vật lý")}
          content={`${t(
            "productItem.deleteDesc",
            "Bạn có chắc chắn muốn xóa món đồ này khỏi kho?"
          )} (${deleteModalItem.itemCode})`}
          okText={t("common.delete", "Xóa")}
          cancelText={t("common.cancel", "Hủy")}
          confirmVariant="destructive"
          confirmLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
