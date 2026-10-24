export interface Category {
  id: number;
  name: string;
  slug: string;
  type?: "COSTUME" | "CAMERA" | "PHOTOGRAPHY" | string;
  description?: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
}
