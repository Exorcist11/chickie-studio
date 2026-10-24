import { Category } from "@/types/category";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Váy Thiết Kế",
    slug: "vay-thiet-ke",
    description: "Váy dạ hội, maxi voan dáng dài cao cấp chụp ảnh ngoại cảnh",
    iconUrl: "Sparkles",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    name: "Áo Dài Truyền Thống & Cách Tân",
    slug: "ao-dai",
    description: "Áo dài kỷ yếu, lễ tết, sự kiện thêu tay hoa sen thanh lịch",
    iconUrl: "Flower2",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    name: "Đầm Dạ Hội & Tiệc",
    slug: "dam-da-hoi",
    description: "Đầm dạ hội lộng lẫy, sang trọng cho sự kiện và tiệc tối",
    iconUrl: "Crown",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    name: "Máy Ảnh Du Lịch & Phụ Kiện",
    slug: "may-anh-du-lich",
    description: "Sony, Canon, Fujifilm nhỏ gọn kèm lens chân dung sắc nét",
    iconUrl: "Camera",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 5,
    name: "Phụ Kiện Chụp Ảnh",
    slug: "phu-kien",
    description: "Túi cói, nón rộng vành, hoa lụa phối đồ thời thượng",
    iconUrl: "ShoppingBag",
    displayOrder: 5,
    isActive: true,
  },
];

export async function getPublicCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return DEFAULT_CATEGORIES;
    }
    const json = await res.json();
    return json.data && json.data.length > 0 ? json.data : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}
