import React, { useState } from "react";
import { KeyRound, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Modal } from "../../../../components/common/Modal";
import { FormField } from "../../../../components/common/FormField";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { notify } from "../../../../components/ui/Notify";
import { staffService } from "../../../../services/staff.service";
import { StaffUser } from "../../../../types/staff";
import { generateRandomPassword } from "../../../../utils/password";
import styles from "./ResetPasswordModal.module.scss";

export interface ResetPasswordModalProps {
  open: boolean;
  staff: StaffUser | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số"
    ),
});

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  staff,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setNewPassword("");
    setError(null);
    onClose();
  };

  const handleGeneratePassword = () => {
    const generated = generateRandomPassword();
    setNewPassword(generated);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;

    setError(null);
    const result = resetPasswordSchema.safeParse({ newPassword });
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Mật khẩu không hợp lệ");
      return;
    }

    try {
      setSubmitting(true);
      await staffService.resetPassword(staff.id, { newPassword });
      notify.success(t("staff.resetPasswordSuccess"));
      handleClose();
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt lại mật khẩu";
      notify.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t("staff.resetPasswordTitle")}
      subtitle={staff ? `${staff.fullName} (@${staff.username})` : t("staff.resetPasswordSubtitle")}
      maxWidth="sm"
      icon={
        <div className="w-10 h-10 rounded-full bg-amber-50 text-warning border border-amber-200 flex items-center justify-center shrink-0">
          <KeyRound className="w-5 h-5" />
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
            form="reset-password-form"
            loading={submitting}
            variant="primary"
          >
            {t("staff.resetPasswordTitle")}
          </Button>
        </div>
      }
    >
      <form
        id="reset-password-form"
        onSubmit={handleSubmit}
        className={styles.resetPasswordModal__form}
      >
        <FormField
          name="newPassword"
          label={t("staff.newPasswordLabel")}
          required
          error={error || undefined}
          helperText={t("staff.newPasswordPlaceholder")}
        >
          <div className={styles.resetPasswordModal__passwordWrapper}>
            <Input
              id="newPassword"
              name="newPassword"
              type="text"
              value={newPassword}
              placeholder={t("staff.newPasswordPlaceholder")}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={submitting}
              autoComplete="new-password"
            />
            <div className={styles.resetPasswordModal__passwordAction}>
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
      </form>
    </Modal>
  );
};
