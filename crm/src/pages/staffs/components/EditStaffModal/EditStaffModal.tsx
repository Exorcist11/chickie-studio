import React, { useState, useEffect } from "react";
import { UserCog } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Modal } from "../../../../components/common/Modal";
import { FormField } from "../../../../components/common/FormField";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { notify } from "../../../../components/ui/Notify";
import { staffService } from "../../../../services/staff.service";
import { StaffUser } from "../../../../types/staff";
import { UserRole } from "../../../../types/auth";
import styles from "./EditStaffModal.module.scss";

export interface EditStaffModalProps {
  open: boolean;
  staff: StaffUser | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const updateStaffSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Họ và tên không được để trống")
    .max(100, "Họ và tên tối đa 100 ký tự"),
  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng")
    .max(100, "Email tối đa 100 ký tự"),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^(\+?84|0)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/.test(val),
      "Số điện thoại di động Việt Nam không hợp lệ"
    )
    .optional(),
  role: z.enum(["ROLE_STAFF", "ROLE_ADMIN"]),
});

export const EditStaffModal: React.FC<EditStaffModalProps> = ({
  open,
  staff,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("ROLE_STAFF");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (staff) {
      setFullName(staff.fullName || "");
      setEmail(staff.email || "");
      setPhone(staff.phone || "");
      setRole(staff.role || "ROLE_STAFF");
      setErrors({});
    }
  }, [staff]);

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const isRootAdmin = staff?.username?.toLowerCase() === "admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;

    setErrors({});
    const formData = {
      fullName,
      email,
      phone: phone || undefined,
      role,
    };

    const result = updateStaffSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setSubmitting(true);
      await staffService.updateStaff(staff.id, result.data);
      notify.success(t("staff.updateSuccess"));
      handleClose();
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi cập nhật tài khoản";
      notify.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t("staff.editModalTitle")}
      subtitle={t("staff.editModalSubtitle")}
      maxWidth="md"
      icon={
        <div className="w-10 h-10 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center shrink-0">
          <UserCog className="w-5 h-5" />
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            form="edit-staff-form"
            loading={submitting}
            variant="primary"
          >
            {t("common.save")}
          </Button>
        </div>
      }
    >
      <form
        id="edit-staff-form"
        onSubmit={handleSubmit}
        className={styles.editStaffModal__form}
      >
        <div className={styles.editStaffModal__row}>
          <FormField
            name="username"
            label={t("staff.usernameLabel")}
          >
            <Input
              id="username"
              name="username"
              value={staff?.username || ""}
              disabled
              className="bg-muted cursor-not-allowed text-muted-foreground"
            />
          </FormField>

          <FormField
            name="fullName"
            label={t("staff.fullNameLabel")}
            required
            error={errors.fullName}
          >
            <Input
              id="fullName"
              name="fullName"
              value={fullName}
              placeholder={t("staff.fullNamePlaceholder")}
              onChange={(e) => setFullName(e.target.value)}
              disabled={submitting}
            />
          </FormField>
        </div>

        <div className={styles.editStaffModal__row}>
          <FormField
            name="email"
            label={t("staff.emailLabel")}
            required
            error={errors.email}
          >
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              placeholder={t("staff.emailPlaceholder")}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </FormField>

          <FormField
            name="phone"
            label={t("staff.phoneLabel")}
            error={errors.phone}
          >
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              placeholder={t("staff.phonePlaceholder")}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting}
            />
          </FormField>
        </div>

        <FormField
          name="role"
          label={t("staff.roleLabel")}
          required
          error={errors.role}
          helperText={isRootAdmin ? t("staff.cannotLockRootAdmin") : undefined}
        >
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            disabled={submitting || isRootAdmin}
            className={styles.editStaffModal__roleSelect}
          >
            <option value="ROLE_STAFF">{t("staff.roleStaff")}</option>
            <option value="ROLE_ADMIN">{t("staff.roleAdmin")}</option>
          </select>
        </FormField>
      </form>
    </Modal>
  );
};
