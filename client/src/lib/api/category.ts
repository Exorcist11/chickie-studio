import { Category } from "@/types/category";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Váy Thiết Kế",
    slug: "vay-thiet-ke",
    type: "COSTUME",
    description: "Váy dạ hội, maxi voan dáng dài cao cấp chụp ảnh ngoại cảnh",
    iconUrl: "Sparkles",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    name: "Áo Dài Truyền Thống & Cách Tân",
    slug: "ao-dai",
    type: "COSTUME",
    description: "Áo dài kỷ yếu, lễ tết, sự kiện thêu tay hoa sen thanh lịch",
    iconUrl: "Flower2",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    name: "Đầm Dạ Hội & Tiệc",
    slug: "dam-da-hoi",
    type: "COSTUME",
    description: "Đầm dạ hội lộng lẫy, sang trọng cho sự kiện và tiệc tối",
    iconUrl: "Crown",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    name: "Máy Ảnh Du Lịch & Phụ Kiện",
    slug: "may-anh-du-lich",
    type: "CAMERA",
    description: "Sony, Canon, Fujifilm nhỏ gọn kèm lens chân dung sắc nét",
    iconUrl: "Camera",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 5,
    name: "Phụ Kiện Chụp Ảnh",
    slug: "phu-kien",
    type: "COSTUME",
    description: "Túi cói, nón rộng vành, hoa lụa phối đồ thời thượng",
    iconUrl: "ShoppingBag",
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 6,
    name: "Gói Chụp Ngoại Cảnh & Kỷ Yếu",
    slug: "chup-anh-ngoai-canh",
    type: "PHOTOGRAPHY",
    description: "Gói chụp ảnh ngoại cảnh, kỷ yếu thanh xuân với nhiếp ảnh gia chuyên nghiệp",
    iconUrl: "Camera",
    displayOrder: 6,
    isActive: true,
  },
  {
    id: 7,
    name: "Gói Chụp Concept Studio & Lookbook",
    slug: "chup-anh-studio",
    type: "PHOTOGRAPHY",
    description: "Gói chụp studio ánh sáng nghệ thuật, lookbook cá nhân kèm makeup",
    iconUrl: "Sparkles",
    displayOrder: 7,
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
