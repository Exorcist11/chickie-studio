import React, { useState } from "react";
import { Layers, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Category, CategoryType, CreateCategoryInput, UpdateCategoryInput } from "../../../../types/category";
import { categoryService } from "../../../../services/category.service";
import { FormField } from "../../../../components/common/FormField";
import { Modal } from "../../../../components/common/Modal";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { TextArea } from "../../../../components/ui/TextArea";
import { Switch } from "../../../../components/ui/Switch";
import { Select } from "../../../../components/ui/Select";
import { slugify, getErrorMessage } from "../../constants";
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
      iconUrl: category?.iconUrl ?? "",
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
      } catch (err: any) {
        if (err?.response?.status === 409) {
          setServerError("Tên danh mục hoặc đường dẫn URL đã tồn tại");
        } else {
          setServerError(err?.response?.data?.message || "Có lỗi xảy ra khi lưu danh mục");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? t("category.editCategory") : t("category.addCategory")}
      icon={<Layers className="w-5 h-5 text-burgundy" />}
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
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            form="category-modal-form"
            isLoading={submitting}
            disabled={submitting}
          >
            {t("common.save")}
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
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Business Pillar (Type) */}
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
                  label={t("category.type")}
                  required
                  error={errorMessage}
                >
                  <Select
                    id="type"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value as CategoryType)}
                    onValueChange={(val) => field.handleChange(val as CategoryType)}
                    options={[
                      { label: "Thuê trang phục (COSTUME)", value: "COSTUME" },
                      { label: "Thuê máy ảnh (CAMERA)", value: "CAMERA" },
                      { label: "Dịch vụ chụp ảnh (PHOTOGRAPHY)", value: "PHOTOGRAPHY" },
                    ]}
                    disabled={submitting}
                  />
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
                  label={t("category.name")}
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
                    placeholder={t("category.namePlaceholder")}
                    disabled={submitting}
                    autoFocus
                  />
                </FormField>
              );
            }}
          </form.Field>

          {/* Slug Field */}
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
              return (
                <FormField
                  name="slug"
                  label={t("category.slug")}
                  required
                  error={errorMessage}
                  helperText={t("category.slugHelper")}
                >
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
                    placeholder={t("category.slugPlaceholder")}
                    disabled={submitting}
                  />
                </FormField>
              );
            }}
          </form.Field>

          <div className={styles.formGrid}>
            {/* Icon Url */}
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
                    label={t("category.icon")}
                    error={errorMessage}
                  >
                    <Input
                      id="iconUrl"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        if (serverError) setServerError(null);
                      }}
                      onBlur={field.handleBlur}
                      placeholder="Sparkles, Flower2, Camera..."
                      disabled={submitting}
                    />
                  </FormField>
                );
              }}
            </form.Field>

            {/* Display Order */}
            <form.Field
              name="displayOrder"
              validators={{
                onChange: displayOrderSchema,
                onSubmit: displayOrderSchema,
              }}
            >
              {(field) => {
                const errorMessage = getErrorMessage(field.state.meta.errors[0]);
                return (
                  <FormField
                    name="displayOrder"
                    label={t("category.displayOrder")}
                    error={errorMessage}
                  >
                    <Input
                      id="displayOrder"
                      name={field.name}
                      type="number"
                      min={0}
                      value={field.state.value}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                        field.handleChange(isNaN(val) ? 0 : val);
                        if (serverError) setServerError(null);
                      }}
                      onBlur={field.handleBlur}
                      disabled={submitting}
                    />
                  </FormField>
                );
              }}
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
                  label={t("category.description")}
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
                    placeholder={t("category.descriptionPlaceholder")}
                    disabled={submitting}
                    rows={3}
                  />
                </FormField>
              );
            }}
          </form.Field>

          {/* Active Status using system Switch */}
          <form.Field name="isActive">
            {(field) => (
              <div className={styles.switchWrapper}>
                <Switch
                  id="isActive"
                  name={field.name}
                  label={t("category.active")}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  disabled={submitting}
                />
              </div>
            )}
          </form.Field>
        </div>
      </form>
    </Modal>
  );
};
