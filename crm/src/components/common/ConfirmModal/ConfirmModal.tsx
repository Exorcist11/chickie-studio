import React from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Modal } from "../Modal";
import { Button } from "../../ui/Button";
import { cn } from "../../../lib/cn";
import "./ConfirmModal.scss";

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLoading?: boolean;
  okText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  confirmVariant?: "primary" | "destructive" | "secondary" | "outline";
  className?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmLoading = false,
  okText,
  cancelText,
  isDestructive = true,
  confirmVariant = "primary",
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title || t("common.confirm")}
      maxWidth="sm"
      className={cn("crm-confirm-modal", className)}
      closeOnEsc={!confirmLoading}
      closeOnOverlayClick={!confirmLoading}
      icon={
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
            isDestructive
              ? "bg-red-50 text-danger border border-red-200"
              : "bg-amber-50 text-warning border border-amber-200"
          )}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={confirmLoading}
            className="min-w-[88px]"
          >
            {cancelText || t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={onConfirm}
            isLoading={confirmLoading}
            disabled={confirmLoading}
            className="min-w-[100px]"
          >
            {okText || t("common.confirm")}
          </Button>
        </>
      }
    >
      <div className="crm-confirm-modal__content text-sm text-stone-600 leading-relaxed py-1">
        {content}
      </div>
    </Modal>
  );
};

export default ConfirmModal;
