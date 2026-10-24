export type CategoryType = "COSTUME" | "CAMERA" | "PHOTOGRAPHY";

export interface Category extends Record<string, unknown> {
  id: number;
  name: string;
  slug: string;
  type?: CategoryType;
  description?: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  type?: CategoryType;
  description?: string;
  iconUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name: string;
  slug: string;
  type?: CategoryType;
  description?: string;
  iconUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}
