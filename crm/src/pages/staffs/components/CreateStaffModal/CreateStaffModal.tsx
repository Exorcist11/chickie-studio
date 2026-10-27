import React, { useState } from "react";
import { UserPlus, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Modal } from "../../../../components/common/Modal";
import { FormField } from "../../../../components/common/FormField";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { notify } from "../../../../components/ui/Notify";
import { staffService } from "../../../../services/staff.service";
import { UserRole } from "../../../../types/auth";
import { generateRandomPassword } from "../../../../utils/password";
import styles from "./CreateStaffModal.module.scss";

export interface CreateStaffModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const createStaffSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Tên đăng nhập tối thiểu 3 ký tự")
    .max(50, "Tên đăng nhập tối đa 50 ký tự")
    .regex(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới"),
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
  password: z
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số"
    ),
  role: z.enum(["ROLE_STAFF", "ROLE_ADMIN"]),
});

export const CreateStaffModal: React.FC<CreateStaffModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("ROLE_STAFF");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setUsername("");
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setRole("ROLE_STAFF");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGeneratePassword = () => {
    const generated = generateRandomPassword();
    setPassword(generated);
    if (errors.password) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.password;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      username,
      fullName,
      email,
      phone: phone || undefined,
      password,
      role,
    };

    const result = createStaffSchema.safeParse(formData);
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
      await staffService.createStaff(result.data);
      notify.success(t("staff.createSuccess"));
      handleClose();
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tạo tài khoản";
      notify.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t("staff.createModalTitle")}
      subtitle={t("staff.createModalSubtitle")}
      maxWidth="md"
      icon={
        <div className="w-10 h-10 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center shrink-0">
          <UserPlus className="w-5 h-5" />
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
            form="create-staff-form"
            loading={submitting}
            variant="primary"
          >
            {t("staff.addBtn")}
          </Button>
        </div>
      }
    >
      <form
        id="create-staff-form"
        onSubmit={handleSubmit}
        className={styles.createStaffModal__form}
      >
        <div className={styles.createStaffModal__row}>
          <FormField
            name="username"
            label={t("staff.usernameLabel")}
            required
            error={errors.username}
          >
            <Input
              id="username"
              name="username"
              value={username}
              placeholder={t("staff.usernamePlaceholder")}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
              autoComplete="username"
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

        <div className={styles.createStaffModal__row}>
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
              autoComplete="email"
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

        <div className={styles.createStaffModal__row}>
          <FormField
            name="password"
            label={t("staff.passwordLabel")}
            required
            error={errors.password}
            helperText={t("staff.passwordPlaceholder")}
          >
            <div className={styles.createStaffModal__passwordWrapper}>
              <Input
                id="password"
                name="password"
                type="text"
                value={password}
                placeholder={t("staff.passwordPlaceholder")}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete="new-password"
              />
              <div className={styles.createStaffModal__passwordAction}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGeneratePassword}
                  className="text-xs text-burgundy flex items-center gap-1.5 h-7 px-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("staff.generatePasswordBtn")}
                </Button>
              </div>
            </div>
          </FormField>

          <FormField
            name="role"
            label={t("staff.roleLabel")}
            required
            error={errors.role}
          >
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={submitting}
              className={styles.createStaffModal__roleSelect}
            >
              <option value="ROLE_STAFF">{t("staff.roleStaff")}</option>
              <option value="ROLE_ADMIN">{t("staff.roleAdmin")}</option>
            </select>
          </FormField>
        </div>
      </form>
    </Modal>
  );
};
