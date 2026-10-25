import React, { useState } from "react";
import {
  Layers,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  RotateCcw,
  Check,
  Plus,
  Minus,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Category,
  CategoryType,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../../../types/category";
import { categoryService } from "../../../../services/category.service";
import { FormField } from "../../../../components/common/FormField";
import { Modal } from "../../../../components/common/Modal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { TextArea } from "../../../../components/ui/TextArea";
import { Switch } from "../../../../components/ui/Switch";
import { cn } from "../../../../lib/cn";
import {
  slugify,
  getErrorMessage,
  CATEGORY_TYPE_CONFIG,
  SUGGESTED_ICONS,
  ICON_MAP,
} from "../../constants";
import styles from "./CategoryModal.module.scss";

// Form Validation Schemas using Zod
const typeSchema = z.enum(["COSTUME", "CAMERA", "PHOTOGRAPHY"]);

const nameSchema = z
  .string()
  .min(1, "Tên danh mục không được để trống")
  .max(100, "Tên danh mục tối đa 100 ký tự");

const slugSchema = z
  .string()
  .min(1, "Slug không được để trống")
  .max(120, "Slug tối đa 120 ký tự")
  .regex(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số và dấu gạch ngang (-)");

const descriptionFieldSchema = z.string().max(500, "Mô tả tối đa 500 ký tự");

const iconUrlFieldSchema = z.string().max(100, "Tên icon tối đa 100 ký tự");

const displayOrderSchema = z
  .number({ invalid_type_error: "Thứ tự từ 0 trở lên" })
  .int("Thứ tự phải là số nguyên")
  .min(0, "Thứ tự từ 0 trở lên");

export interface CategoryModalProps {
  open: boolean;
  category: Category | null;
  displayOrderDefault: number;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  category,
  displayOrderDefault,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(category));
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      type: (category?.type ?? "COSTUME") as CategoryType,
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      iconUrl: category?.iconUrl ?? "Sparkles",
      displayOrder: category ? category.displayOrder : displayOrderDefault,
      isActive: category ? category.isActive : true,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        setSubmitting(true);
        if (category) {
          const updatePayload: UpdateCategoryInput = {
            type: value.type,
            name: value.name.trim(),
            slug: value.slug.trim().toLowerCase(),
            description: value.description?.trim() || undefined,
            iconUrl: value.iconUrl?.trim() || undefined,
            displayOrder: Number(value.displayOrder) || 0,
            isActive: value.isActive,
          };
          await categoryService.updateCategory(category.id, updatePayload);
        } else {
          const createPayload: CreateCategoryInput = {
            type: value.type,
            name: value.name.trim(),
            slug: value.slug.trim().toLowerCase(),
            description: value.description?.trim() || undefined,
            iconUrl: value.iconUrl?.trim() || undefined,
            displayOrder: Number(value.displayOrder) || 0,
            isActive: value.isActive,
          };
          await categoryService.createCategory(createPayload);
        }
        await onSuccess();
        onClose();
      } catch (err: unknown) {
        const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
        if (errorObj?.response?.status === 409) {
          setServerError("Tên danh mục hoặc đường dẫn URL đã tồn tại");
        } else {
          setServerError(errorObj?.response?.data?.message || "Có lỗi xảy ra khi lưu danh mục");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!open) return null;

  const currentIconName = form.getFieldValue("iconUrl") || "";
  const CurrentIconComponent = ICON_MAP[currentIconName] || Layers;

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="xl"
      title={category ? t("category.editCategory", "Chỉnh sửa danh mục") : t("category.addCategory", "Thêm danh mục")}
      subtitle={
        category
          ? t("category.editSubtitle", "Cập nhật thông tin phân loại danh mục sản phẩm")
          : t("category.addSubtitle", "Khởi tạo danh mục mới cho các dòng sản phẩm trong studio")
      }
      icon={<CurrentIconComponent className="w-5 h-5 text-burgundy" />}
      ariaLabelledBy="category-modal-title"
      closeOnEsc={!submitting}
      closeOnOverlayClick={!submitting}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            {t("common.cancel", "Hủy")}
          </Button>
          <Button
            type="submit"
            form="category-modal-form"
            isLoading={submitting}
            disabled={submitting}
          >
            {t("common.save", "Lưu thay đổi")}
          </Button>
        </>
      }
    >
      <form
        id="category-modal-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        noValidate
      >
        <div className={styles.modalFormContent}>
          {serverError && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Business Pillar: Interactive Cards + Synchronized Select for RTL testing */}
          <form.Field
            name="type"
            validators={{
              onChange: typeSchema,
              onSubmit: typeSchema,
            }}
          >
            {(field) => {
              const errorMessage = getErrorMessage(field.state.meta.errors[0]);
              return (
                <FormField
                  name="type"
                  label={t("category.type", "Mảng kinh doanh")}
                  required
                  error={errorMessage}
                >
                  <div className={styles.pillarSection}>
                    {/* Visual 3-card selector */}
                    <div className={styles.pillarCards} role="radiogroup" aria-label="Phân loại mảng">
                      {(["COSTUME", "CAMERA", "PHOTOGRAPHY"] as CategoryType[]).map((pillKey) => {
                        const cfg = CATEGORY_TYPE_CONFIG[pillKey];
                        const Icon = cfg.icon;
                        const isSelected = field.state.value === pillKey;
                        return (
                          <div
                            key={pillKey}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onClick={() => field.handleChange(pillKey)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                field.handleChange(pillKey);
                              }
                            }}
                            className={cn(
                              styles.pillarCard,
                              isSelected && styles["pillarCard--active"]
                            )}
                          >
                            <div className={styles.pillarIconWrapper}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className={styles.pillarCardTitle}>
                              {t(cfg.labelKey, cfg.defaultLabel)}
                            </span>
                            <span className={styles.pillarCardCode}>({pillKey})</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Accessible select control for standard forms and Vitest user.selectOptions */}
                    <select
                      id="type"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value as CategoryType)}
                      disabled={submitting}
                      className="sr-only"
                    >
                      <option value="COSTUME">Thuê trang phục (COSTUME)</option>
                      <option value="CAMERA">Thuê máy ảnh (CAMERA)</option>
                      <option value="PHOTOGRAPHY">Dịch vụ chụp ảnh (PHOTOGRAPHY)</option>
                    </select>
                  </div>
                </FormField>
              );
            }}
          </form.Field>

          {/* Name Field */}
          <form.Field
            name="name"
            validators={{
              onChange: nameSchema,
              onBlur: nameSchema,
              onSubmit: nameSchema,
            }}
          >
            {(field) => {
              const errorMessage = getErrorMessage(field.state.meta.errors[0]);
              return (
                <FormField
                  name="name"
                  label={t("category.name", "Tên danh mục")}
                  required
                  error={errorMessage}
                >
                  <Input
                    id="name"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => {
                      const newName = e.target.value;
                      field.handleChange(newName);
                      if (serverError) setServerError(null);
                      if (!isSlugManuallyEdited && !category) {
                        form.setFieldValue("slug", slugify(newName));
                        form.validateField("slug", "change");
                      }
                    }}
                    onBlur={field.handleBlur}
                    placeholder={t("category.namePlaceholder", "Ví dụ: Váy Thiết Kế")}
                    disabled={submitting}
                    autoFocus
                  />
                </FormField>
              );
            }}
          </form.Field>

          {/* Slug Field with Live URL Preview */}
          <form.Field
            name="slug"
            validators={{
              onChange: slugSchema,
              onBlur: slugSchema,
              onSubmit: slugSchema,
            }}
          >
            {(field) => {
              const errorMessage = getErrorMessage(field.state.meta.errors[0]);
              const currentName = form.getFieldValue("name");
              return (
                <FormField
                  name="slug"
                  label={t("category.slug", "Đường dẫn URL (slug)")}
                  required
                  error={errorMessage}
                  helperText={t("category.slugHelper", "Slug chỉ chứa chữ thường, số và dấu gạch ngang (a-z, 0-9, -)")}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="slug"
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => {
                            setIsSlugManuallyEdited(true);
                            field.handleChange(e.target.value);
                            if (serverError) setServerError(null);
                          }}
                          onBlur={field.handleBlur}
                          placeholder={t("category.slugPlaceholder", "vay-thiet-ke")}
                          disabled={submitting}
                        />
                      </div>
                      {isSlugManuallyEdited && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsSlugManuallyEdited(false);
                            const autoSlug = slugify(currentName || "");
                            form.setFieldValue("slug", autoSlug);
                            form.validateField("slug", "change");
                          }}
                          title={t("category.syncSlug", "Đồng bộ từ tên")}
                          className="shrink-0 text-stone-500 hover:text-burgundy"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>

                    {/* Live URL Preview badge */}
                    <div className={styles.urlPreview}>
                      <LinkIcon className="w-3 h-3 text-burgundy shrink-0" />
                      <span>chickiestudio.vn/categories/{field.state.value || "slug"}</span>
                    </div>
                  </div>
                </FormField>
              );
            }}
          </form.Field>

          {/* Interactive Visual Icon Picker */}
          <form.Field
            name="iconUrl"
            validators={{
              onChange: iconUrlFieldSchema,
              onSubmit: iconUrlFieldSchema,
            }}
          >
            {(field) => {
              const errorMessage = getErrorMessage(field.state.meta.errors[0]);
              return (
                <FormField
                  name="iconUrl"
                  label={t("category.selectIcon", "Chọn biểu tượng đại diện")}
                  error={errorMessage}
                  helperText={t("category.selectIconHint", "Nhấp chọn nhanh biểu tượng phù hợp với dòng sản phẩm")}
                >
                  <div className={styles.iconPickerSection}>
                    <div className={styles.iconPickerHeader}>
                      <span>Biểu tượng đề xuất</span>
                      {field.state.value && (
                        <span className="font-mono text-burgundy font-medium">
                          {field.state.value}
                        </span>
                      )}
                    </div>

                    {/* Quick Icon Selector Grid */}
                    <div className={styles.iconGrid} role="group" aria-label="Danh sách biểu tượng">
                      {SUGGESTED_ICONS.map((item) => {
                        const Icon = item.icon;
                        const isSelected = field.state.value === item.name;
                        return (
                          <button
                            key={item.name}
                            type="button"
                            title={item.label}
                            aria-label={`icon-${item.name}`}
                            onClick={() => field.handleChange(item.name)}
                            className={cn(
                              styles.iconButton,
                              isSelected && styles["iconButton--selected"]
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-burgundy rounded-full text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Manual input for custom icon string or edge case */}
                    <div className={styles.customIconRow}>
                      <Input
                        id="iconUrl"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Sparkles, Flower2, Camera..."
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </FormField>
              );
            }}
          </form.Field>

          {/* Coordinated Dual Settings: Display Order Stepper & Active Visibility Switch */}
          <div className={styles.settingsGrid}>
            {/* Display Order Stepper Card */}
            <form.Field
              name="displayOrder"
              validators={{
                onChange: displayOrderSchema,
                onSubmit: displayOrderSchema,
              }}
            >
              {(field) => {
                const errorMessage = getErrorMessage(field.state.meta.errors[0]);
                const orderVal = typeof field.state.value === "number" ? field.state.value : 0;
                return (
                  <div className={styles.settingCard}>
                    <div className={styles.settingInfo}>
                      <label htmlFor="displayOrder" className={styles.settingTitle}>
                        <SlidersHorizontal className="w-3.5 h-3.5 text-burgundy shrink-0" />
                        <span>{t("category.displayOrder", "Thứ tự hiển thị")}</span>
                      </label>
                      <span className={styles.settingSub}>
                        {errorMessage ? (
                          <span className="text-red-600 font-medium">{errorMessage}</span>
                        ) : (
                          t("category.orderHelper", "Số nhỏ hơn sẽ ưu tiên trước")
                        )}
                      </span>
                    </div>

                    <div className={styles.stepperWrapper}>
                      <button
                        type="button"
                        className={styles.stepperBtn}
                        onClick={() => {
                          const next = Math.max(0, orderVal - 1);
                          field.handleChange(next);
                          if (serverError) setServerError(null);
                        }}
                        disabled={submitting || orderVal <= 0}
                        aria-label="Giảm thứ tự"
                        title="Giảm thứ tự"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className={styles.stepperInputWrapper}>
                        <span className={styles.orderPrefix} aria-hidden="true">#</span>
                        <input
                          id="displayOrder"
                          name={field.name}
                          type="number"
                          min={0}
                          className={styles.stepperInput}
                          value={field.state.value}
                          onChange={(e) => {
                            const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                            field.handleChange(isNaN(val) ? 0 : val);
                            if (serverError) setServerError(null);
                          }}
                          onBlur={field.handleBlur}
                          disabled={submitting}
                        />
                      </div>

                      <button
                        type="button"
                        className={styles.stepperBtn}
                        onClick={() => {
                          const next = orderVal + 1;
                          field.handleChange(next);
                          if (serverError) setServerError(null);
                        }}
                        disabled={submitting}
                        aria-label="Tăng thứ tự"
                        title="Tăng thứ tự"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              }}
            </form.Field>

            {/* Active Status Switch Card */}
            <form.Field name="isActive">
              {(field) => (
                <div className={styles.settingCard}>
                  <div className={styles.settingInfo}>
                    <label htmlFor="isActive" className={styles.settingTitle}>
                      <CheckCircle2
                        className={cn(
                          "w-3.5 h-3.5 shrink-0 transition-colors",
                          field.state.value ? "text-emerald-600" : "text-stone-400"
                        )}
                      />
                      <span>{t("category.activeLabel", "Kích hoạt hiển thị")}</span>
                    </label>
                    <span className={styles.settingSub}>
                      {field.state.value
                        ? t("category.active", "Đang hoạt động")
                        : t("category.inactive", "Tạm ẩn")}
                    </span>
                  </div>

                  <Switch
                    id="isActive"
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    disabled={submitting}
                  />
                </div>
              )}
            </form.Field>
          </div>

          {/* Description using system TextArea */}
          <form.Field
            name="description"
            validators={{
              onChange: descriptionFieldSchema,
              onSubmit: descriptionFieldSchema,
            }}
          >
            {(field) => {
              const errorMessage = getErrorMessage(field.state.meta.errors[0]);
              return (
                <FormField
                  name="description"
                  label={t("category.description", "Mô tả")}
                  error={errorMessage}
                >
                  <TextArea
                    id="description"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      if (serverError) setServerError(null);
                    }}
                    onBlur={field.handleBlur}
                    placeholder={t("category.descriptionPlaceholder", "Mô tả ngắn gọn về danh mục...")}
                    disabled={submitting}
                    rows={3}
                  />
                </FormField>
              );
            }}
          </form.Field>
        </div>
      </form>
    </Modal>
  );
};
