import React from "react";
import { Sparkles, Flower2, Camera, Layers, Tag, Shirt } from "lucide-react";
import { CategoryType } from "../../types/category";

// Icon mapping for rich visual indicators across categories
export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Flower2,
  Camera,
  Layers,
  Tag,
  Shirt,
};

export interface CategoryTypeConfig {
  value: CategoryType;
  labelKey: string;
  defaultLabel: string;
  badgeStyleClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CATEGORY_TYPE_CONFIG: Record<CategoryType, CategoryTypeConfig> = {
  COSTUME: {
    value: "COSTUME",
    labelKey: "category.types.costume",
    defaultLabel: "Thuê trang phục",
    badgeStyleClass: "typeBadge--costume",
    icon: Shirt,
  },
  CAMERA: {
    value: "CAMERA",
    labelKey: "category.types.camera",
    defaultLabel: "Thuê máy ảnh",
    badgeStyleClass: "typeBadge--camera",
    icon: Camera,
  },
  PHOTOGRAPHY: {
    value: "PHOTOGRAPHY",
    labelKey: "category.types.photography",
    defaultLabel: "Dịch vụ chụp ảnh",
    badgeStyleClass: "typeBadge--photography",
    icon: Sparkles,
  },
};

// Generates URL-friendly slugs from Vietnamese text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Safely extract error message string from TanStack field errors or Zod issues
export function getErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in (error as Record<string, unknown>)) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}
