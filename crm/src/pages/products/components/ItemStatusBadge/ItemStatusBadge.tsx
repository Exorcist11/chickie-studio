import React from "react";
import { CheckCircle2, Clock, Sparkles, Wrench, Archive } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProductItemStatus, ITEM_STATUS_DEFAULT_LABELS } from "../../../../types/productItem";
import { cn } from "../../../../lib/cn";
import styles from "./ItemStatusBadge.module.scss";

interface ItemStatusBadgeProps {
  status: ProductItemStatus;
  className?: string;
}

const STATUS_ICONS: Record<ProductItemStatus, React.ComponentType<{ className?: string }>> = {
  AVAILABLE: CheckCircle2,
  RENTED: Clock,
  LAUNDRY: Sparkles,
  MAINTENANCE: Wrench,
  RETIRED: Archive,
};

export const ItemStatusBadge: React.FC<ItemStatusBadgeProps> = ({ status, className }) => {
  const { t } = useTranslation();
  const Icon = STATUS_ICONS[status] || CheckCircle2;

  const statusLabel = t(`productItem.status_${status}`, ITEM_STATUS_DEFAULT_LABELS[status]);

  return (
    <span
      className={cn(
        styles.badge,
        styles[`badge--${status.toLowerCase()}`],
        className
      )}
      role="status"
      aria-label={`Trạng thái: ${statusLabel}`}
    >
      <Icon className={styles.icon} aria-hidden="true" />
      <span>{statusLabel}</span>
    </span>
  );
};
