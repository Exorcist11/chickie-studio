import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Edit2, Trash2, X, AlertCircle, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "../../types/category";
import { categoryService } from "../../services/category.service";
import { PageHeader } from "../../components/common/PageHeader";
import { DataTable, ColumnType } from "../../components/common/DataTable";
import { FilterBar, FilterValues } from "../../components/common/FilterBar";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { FormField } from "../../components/common/FormField";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import styles from "./CategoriesPage.module.scss";

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Tên danh mục không được để trống")
    .max(100, "Tên danh mục tối đa 100 ký tự"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .max(120, "Slug tối đa 120 ký tự")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số và dấu gạch ngang (-)"),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  displayOrder: z.number().int().min(0, "Thứ tự từ 0 trở lên"),
  isActive: z.boolean(),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    iconUrl: "",
    displayOrder: 0,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

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
    setFormData({
      name: "",
      slug: "",
      description: "",
      iconUrl: "",
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setFormErrors({});
    setServerError(null);
    setIsSlugManuallyEdited(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      iconUrl: category.iconUrl || "",
      displayOrder: category.displayOrder,
      isActive: category.isActive,
    });
    setFormErrors({});
    setServerError(null);
    setIsSlugManuallyEdited(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!submitting) {
      setIsModalOpen(false);
      setEditingCategory(null);
      setServerError(null);
      setFormErrors({});
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: !isSlugManuallyEdited && !editingCategory ? slugify(newName) : prev.slug,
    }));
    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
    if (formErrors.slug) {
      setFormErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationResult = categoryFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      if (editingCategory) {
        const updatePayload: UpdateCategoryInput = {
          name: formData.name.trim(),
          slug: formData.slug.trim().toLowerCase(),
          description: formData.description.trim() || undefined,
          iconUrl: formData.iconUrl.trim() || undefined,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };
        await categoryService.updateCategory(editingCategory.id, updatePayload);
      } else {
        const createPayload: CreateCategoryInput = {
          name: formData.name.trim(),
          slug: formData.slug.trim().toLowerCase(),
          description: formData.description.trim() || undefined,
          iconUrl: formData.iconUrl.trim() || undefined,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };
        await categoryService.createCategory(createPayload);
      }
      setIsModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setServerError("Tên danh mục hoặc đường dẫn URL đã tồn tại");
      } else {
        setServerError(err?.response?.data?.message || "Có lỗi xảy ra khi lưu danh mục");
      }
    } finally {
      setSubmitting(false);
    }
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
      width: 70,
      render: (value: number) => (
        <span className="font-semibold text-stone-500 text-xs px-2 py-1 bg-stone-100 rounded">
          {value}
        </span>
      ),
    },
    {
      title: t("category.name"),
      dataIndex: "name",
      key: "name",
      render: (_value: string, record: Category) => (
        <div className="flex items-center gap-3">
          <div className={styles.iconPreview}>
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium text-ink">{record.name}</div>
            {record.iconUrl && (
              <span className="text-xs text-stone-400">Icon: {record.iconUrl}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t("category.slug"),
      dataIndex: "slug",
      key: "slug",
      render: (value: string) => (
        <code className="text-xs font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
          /{value}
        </code>
      ),
    },
    {
      title: t("category.description"),
      dataIndex: "description",
      key: "description",
      render: (value?: string) => (
        <span className="text-sm text-stone-600 line-clamp-1 max-w-xs">
          {value || "-"}
        </span>
      ),
    },
    {
      title: t("category.status"),
      dataIndex: "isActive",
      key: "isActive",
      width: 140,
      render: (isActive: boolean) => (
        <Badge variant={isActive ? "success" : "secondary"}>
          {isActive ? t("category.active") : t("category.inactive")}
        </Badge>
      ),
    },
    {
      title: t("category.actions"),
      key: "actions",
      width: 160,
      render: (_: unknown, record: Category) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEditModal(record)}
            aria-label={`edit-${record.slug}`}
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" />
            {t("category.edit")}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeletingCategory(record)}
            aria-label={`delete-${record.slug}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
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
          <Button onClick={handleOpenAddModal} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            {t("category.addCategory")}
          </Button>
        }
      />

      <FilterBar
        searchPlaceholder={t("common.search")}
        selectPlaceholder={t("category.status")}
        selectOptions={[
          { label: t("common.all"), value: "ALL" },
          { label: t("category.active"), value: "ACTIVE" },
          { label: t("category.inactive"), value: "INACTIVE" },
        ]}
        onFilterChange={setFilterValues}
        onReset={() => setFilterValues({})}
      />

      <div className="bg-white rounded-xl border border-line shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          dataSource={filteredCategories}
          loading={loading}
          rowKey="id"
          emptyText={t("common.empty")}
        />
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className="font-playfair text-lg font-bold text-ink">
                {editingCategory ? t("category.editCategory") : t("category.addCategory")}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitting}
                className="text-stone-400 hover:text-stone-700 transition-colors"
                aria-label="close-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                {serverError && (
                  <div className={styles.errorBanner} role="alert">
                    <div className="flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{serverError}</span>
                    </div>
                  </div>
                )}

                <FormField
                  name="name"
                  label={t("category.name")}
                  required
                  error={formErrors.name}
                >
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder={t("category.namePlaceholder")}
                    disabled={submitting}
                    autoFocus
                  />
                </FormField>

                <FormField
                  name="slug"
                  label={t("category.slug")}
                  required
                  error={formErrors.slug}
                  helperText={t("category.slugHelper")}
                >
                  <Input
                    name="slug"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    placeholder={t("category.slugPlaceholder")}
                    disabled={submitting}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="iconUrl"
                    label={t("category.icon")}
                    error={formErrors.iconUrl}
                  >
                    <Input
                      name="iconUrl"
                      value={formData.iconUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, iconUrl: e.target.value }))
                      }
                      placeholder="Sparkles, Flower2, Camera..."
                      disabled={submitting}
                    />
                  </FormField>

                  <FormField
                    name="displayOrder"
                    label={t("category.displayOrder")}
                    error={formErrors.displayOrder}
                  >
                    <Input
                      name="displayOrder"
                      type="number"
                      min={0}
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          displayOrder: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      disabled={submitting}
                    />
                  </FormField>
                </div>

                <FormField
                  name="description"
                  label={t("category.description")}
                  error={formErrors.description}
                >
                  <textarea
                    name="description"
                    className={styles.textarea}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder={t("category.descriptionPlaceholder")}
                    disabled={submitting}
                  />
                </FormField>

                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                    disabled={submitting}
                  />
                  <span className="text-sm font-medium text-ink">
                    {t("category.active")}
                  </span>
                </label>
              </div>

              <div className={styles.modalFooter}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" isLoading={submitting}>
                  {t("common.save")}
                </Button>
              </div>
            </form>
          </div>
        </div>
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
