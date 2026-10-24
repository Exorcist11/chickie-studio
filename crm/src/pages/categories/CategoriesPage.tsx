import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Edit2, Trash2, Layers, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Category } from "../../types/category";
import { categoryService } from "../../services/category.service";
import { PageHeader } from "../../components/common/PageHeader";
import { DataTable, ColumnType } from "../../components/common/DataTable";
import { FilterBar, FilterValues } from "../../components/common/FilterBar";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { cn } from "../../lib/cn";
import { CategoryModal, CategoryViewModal } from "./components";
import { ICON_MAP } from "./constants";
import styles from "./CategoriesPage.module.scss";

export const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);

  // Delete Confirm State
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch {
      // Handled by global toast / alert
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      setDeleteLoading(true);
      await categoryService.deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
      await fetchCategories();
    } catch {
      // Error handled
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered List
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Search term
      if (filterValues.search) {
        const query = filterValues.search.toLowerCase();
        const matchName = cat.name.toLowerCase().includes(query);
        const matchSlug = cat.slug.toLowerCase().includes(query);
        if (!matchName && !matchSlug) return false;
      }
      // Status
      if (filterValues.selectValue && filterValues.selectValue !== "ALL") {
        if (filterValues.selectValue === "ACTIVE" && !cat.isActive) return false;
        if (filterValues.selectValue === "INACTIVE" && cat.isActive) return false;
      }
      return true;
    });
  }, [categories, filterValues]);

  // Columns definition
  const columns: ColumnType<Category>[] = [
    {
      title: "#",
      dataIndex: "displayOrder",
      key: "displayOrder",
      width: 60,
      render: (value: number) => (
        <span className={styles.orderBadge}>
          {value}
        </span>
      ),
    },
    {
      title: t("category.name"),
      dataIndex: "name",
      key: "name",
      render: (_value: string, record: Category) => {
        const IconComponent = (record.iconUrl && ICON_MAP[record.iconUrl]) || Layers;
        return (
          <div className={styles.categoryCell}>
            <div className={styles.iconPreview}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <div className={styles.categoryTitle}>{record.name}</div>
              {record.iconUrl && (
                <span className={styles.categoryIconLabel}>Icon: {record.iconUrl}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: t("category.slug"),
      dataIndex: "slug",
      key: "slug",
      render: (value: string) => (
        <code className={styles.slugBadge}>
          /{value}
        </code>
      ),
    },
    {
      title: t("category.description"),
      dataIndex: "description",
      key: "description",
      render: (value?: string) => (
        <span className={styles.descCell}>
          {value || "-"}
        </span>
      ),
    },
    {
      title: t("category.status"),
      dataIndex: "isActive",
      key: "isActive",
      width: 150,
      render: (isActive: boolean) => (
        <Badge
          variant={isActive ? "success" : "secondary"}
          className="gap-1.5 font-medium whitespace-nowrap inline-flex items-center"
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full inline-block shrink-0",
              isActive ? "bg-emerald-500" : "bg-stone-400"
            )}
            aria-hidden="true"
          />
          <span className="whitespace-nowrap">{isActive ? t("category.active") : t("category.inactive")}</span>
        </Badge>
      ),
    },
    {
      title: t("category.actions"),
      key: "actions",
      width: 150,
      render: (_: unknown, record: Category) => (
        <div className={styles.actionsGroup}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewingCategory(record)}
            aria-label={`view-${record.slug}`}
            title={t("common.view", "Xem chi tiết")}
            className={styles.actionBtnView}
          >
            <Eye className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleOpenEditModal(record)}
            aria-label={`edit-${record.slug}`}
            title={t("category.edit", "Chỉnh sửa")}
            className={styles.actionBtnEdit}
          >
            <Edit2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeletingCategory(record)}
            aria-label={`delete-${record.slug}`}
            title={t("category.delete", "Xóa")}
            className={styles.actionBtnDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <PageHeader
        title={t("category.title")}
        subtitle={t("category.subtitle")}
        breadcrumbs={[
          { title: t("menu.dashboard"), href: "/" },
          { title: t("category.title") },
        ]}
        actions={
          <Button
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-4 h-4 shrink-0" />}
            className="whitespace-nowrap shadow-xs"
          >
            {t("category.addCategory")}
          </Button>
        }
      />

      <FilterBar
        searchPlaceholder={t("common.search")}
        selectPlaceholder={t("category.status")}
        showDateRange={false}
        selectOptions={[
          { label: t("common.all"), value: "ALL" },
          { label: t("category.active"), value: "ACTIVE" },
          { label: t("category.inactive"), value: "INACTIVE" },
        ]}
        onFilterChange={setFilterValues}
        onReset={() => setFilterValues({})}
      />

      <DataTable
        columns={columns}
        dataSource={filteredCategories}
        loading={loading}
        rowKey="id"
        emptyText={t("common.empty")}
      />

      {/* View Category Detail Modal */}
      {viewingCategory && (
        <CategoryViewModal
          open={Boolean(viewingCategory)}
          category={viewingCategory}
          onClose={() => setViewingCategory(null)}
          onEdit={(cat) => handleOpenEditModal(cat)}
        />
      )}

      {/* Add / Edit Category Modal using TanStack Form & System Components */}
      {isModalOpen && (
        <CategoryModal
          open={isModalOpen}
          category={editingCategory}
          displayOrderDefault={categories.length + 1}
          onClose={handleCloseModal}
          onSuccess={fetchCategories}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deletingCategory)}
        title={t("category.deleteConfirmTitle")}
        content={
          <p className="text-sm text-stone-600">
            {t("category.deleteConfirmDesc")} <strong>{deletingCategory?.name}</strong>?
          </p>
        }
        confirmLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  );
};

export default CategoriesPage;
