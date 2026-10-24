export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
}
