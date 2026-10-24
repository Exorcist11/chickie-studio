import {
  ProductListItem,
  ProductDetail,
  ProductQueryParams,
  PageResult,
} from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function formatImageUrl(url?: string): string {
  if (!url) {
    return "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop";
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${API_BASE_URL}${cleanUrl}`;
}

export const DEFAULT_FEATURED_PRODUCTS: ProductListItem[] = [
  {
    id: 1,
    categoryId: 1,
    categoryName: "Váy Thiết Kế",
    productCode: "VTK-001",
    name: "Đầm maxi voan xòe tiểu thư dáng dài chụp ngoại cảnh",
    slug: "dam-maxi-voan-xoe-tieu-thu",
    rentalPrice: 180000,
    depositPrice: 500000,
    status: "ACTIVE",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
    variantCount: 4,
  },
  {
    id: 2,
    categoryId: 2,
    categoryName: "Áo Dài Truyền Thống & Cách Tân",
    productCode: "AD-002",
    name: "Áo dài cách tân hoa sen thêu tay kỷ yếu thanh lịch",
    slug: "ao-dai-cach-tan-hoa-sen",
    rentalPrice: 220000,
    depositPrice: 600000,
    status: "ACTIVE",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop",
    variantCount: 6,
  },
  {
    id: 3,
    categoryId: 3,
    categoryName: "Đầm Dạ Hội & Tiệc",
    productCode: "DDH-003",
    name: "Đầm dạ hội satin trễ vai sang trọng dự tiệc tối",
    slug: "dam-da-hoi-satin-tre-vai",
    rentalPrice: 250000,
    depositPrice: 800000,
    status: "ACTIVE",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop",
    variantCount: 3,
  },
  {
    id: 4,
    categoryId: 1,
    categoryName: "Váy Thiết Kế",
    productCode: "VTK-004",
    name: "Váy ren trắng đính ngọc dáng xòe công chúa cổ điển",
    slug: "vay-ren-trang-dinh-ngoc",
    rentalPrice: 210000,
    depositPrice: 600000,
    status: "ACTIVE",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop",
    variantCount: 4,
  },
  {
    id: 5,
    categoryId: 4,
    categoryName: "Máy Ảnh Du Lịch & Phụ Kiện",
    productCode: "MA-005",
    name: "Combo Máy ảnh Sony A6400 kèm lens 50mm f1.8 du lịch chân dung",
    slug: "combo-sony-a6400-lens-50mm",
    rentalPrice: 290000,
    depositPrice: 2000000,
    status: "ACTIVE",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop",
    variantCount: 1,
  },
  {
    id: 6,
    categoryId: 2,
    categoryName: "Áo Dài Truyền Thống & Cách Tân",
    productCode: "AD-006",
    name: "Áo dài gấm đỏ truyền thống cưới hỏi thêu chim hỷ tước",
    slug: "ao-dai-gam-do-truyen-thong",
    rentalPrice: 260000,
    depositPrice: 700000,
    status: "ACTIVE",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop",
    variantCount: 3,
  },
];

export const DEFAULT_PRODUCT_DETAILS: Record<string, ProductDetail> = {
  "dam-maxi-voan-xoe-tieu-thu": {
    id: 1,
    categoryId: 1,
    categoryName: "Váy Thiết Kế",
    productCode: "VTK-001",
    name: "Đầm maxi voan xòe tiểu thư dáng dài chụp ngoại cảnh",
    slug: "dam-maxi-voan-xoe-tieu-thu",
    description:
      "Thiết kế váy maxi xòe bồng bềnh chất liệu voan tơ Hàn Quốc cao cấp, nhẹ tênh bay trong gió. Lớp lót lụa mềm mại chống dính, tay bồng thanh thoát giúp che khuyết điểm bắp tay hoàn hảo.",
    material: "Voan tơ tằm kết hợp lụa habutai 2 lớp cao cấp",
    occasion: "Chụp ảnh kỷ yếu, du lịch biển, tiệc ngoài trời, picnic sống ảo",
    rentalPrice: 180000,
    depositPrice: 500000,
    status: "ACTIVE",
    variants: [
      { id: 101, size: "S", color: "Trắng Ngọc Trai", sku: "VTK001-S-WHT" },
      { id: 102, size: "M", color: "Trắng Ngọc Trai", sku: "VTK001-M-WHT" },
      { id: 103, size: "S", color: "Đỏ Burgundy", sku: "VTK001-S-BUR" },
      { id: 104, size: "M", color: "Đỏ Burgundy", sku: "VTK001-M-BUR" },
    ],
    images: [
      {
        id: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
        isThumbnail: true,
        displayOrder: 1,
      },
      {
        id: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop",
        isThumbnail: false,
        displayOrder: 2,
      },
      {
        id: 3,
        imageUrl:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop",
        isThumbnail: false,
        displayOrder: 3,
      },
    ],
  },
  "ao-dai-cach-tan-hoa-sen": {
    id: 2,
    categoryId: 2,
    categoryName: "Áo Dài Truyền Thống & Cách Tân",
    productCode: "AD-002",
    name: "Áo dài cách tân hoa sen thêu tay kỷ yếu thanh lịch",
    slug: "ao-dai-cach-tan-hoa-sen",
    description:
      "Tà áo dài 4 tà thướt tha, điểm xuyết hoa sen thêu thủ công tinh xảo trên ngực áo. Dáng áo ôm nhẹ tôn vòng eo con kiến nhưng vẫn đảm bảo thoải mái khi di chuyển chụp hình cả ngày.",
    material: "Lụa tơ tằm Tây Hồ mềm mượt, co giãn nhẹ",
    occasion: "Kỷ yếu đại học, chụp cúc họa mi, sự kiện lễ tết truyền thống",
    rentalPrice: 220000,
    depositPrice: 600000,
    status: "ACTIVE",
    variants: [
      { id: 201, size: "S", color: "Hồng Nude", sku: "AD002-S-NUD" },
      { id: 202, size: "M", color: "Hồng Nude", sku: "AD002-M-NUD" },
      { id: 203, size: "L", color: "Hồng Nude", sku: "AD002-L-NUD" },
      { id: 204, size: "S", color: "Trắng Tinh Khôi", sku: "AD002-S-WHT" },
    ],
    images: [
      {
        id: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop",
        isThumbnail: true,
        displayOrder: 1,
      },
      {
        id: 5,
        imageUrl:
          "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop",
        isThumbnail: false,
        displayOrder: 2,
      },
    ],
  },
};

export async function getPublicProducts(
  params?: ProductQueryParams
): Promise<PageResult<ProductListItem>> {
  const query = new URLSearchParams();
  if (params?.categoryId !== undefined && params.categoryId !== "") {
    query.append("categoryId", String(params.categoryId));
  }
  if (params?.search) {
    query.append("search", params.search);
  }
  if (params?.page !== undefined) {
    query.append("page", String(params.page));
  }
  if (params?.size !== undefined) {
    query.append("size", String(params.size));
  }

  const defaultResult: PageResult<ProductListItem> = {
    content: DEFAULT_FEATURED_PRODUCTS,
    totalElements: DEFAULT_FEATURED_PRODUCTS.length,
    totalPages: 1,
    size: params?.size || 20,
    number: params?.page || 0,
  };

  try {
    const queryString = query.toString();
    const endpoint = `${API_BASE_URL}/api/public/products${
      queryString ? `?${queryString}` : ""
    }`;
    const res = await fetch(endpoint, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return filterDefaultProducts(params, defaultResult);
    }

    const json = await res.json();
    const pageData = json.data;

    if (!pageData || !Array.isArray(pageData.content)) {
      return filterDefaultProducts(params, defaultResult);
    }

    return {
      content: pageData.content,
      totalElements: pageData.totalElements ?? pageData.content.length,
      totalPages: pageData.totalPages ?? 1,
      size: pageData.size ?? 20,
      number: pageData.number ?? 0,
    };
  } catch {
    return filterDefaultProducts(params, defaultResult);
  }
}

function filterDefaultProducts(
  params: ProductQueryParams | undefined,
  defaultResult: PageResult<ProductListItem>
): PageResult<ProductListItem> {
  let list = [...DEFAULT_FEATURED_PRODUCTS];

  if (params?.categoryId) {
    list = list.filter((p) => String(p.categoryId) === String(params.categoryId));
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
    );
  }

  if (params?.size) {
    list = list.slice(0, params.size);
  }

  return {
    ...defaultResult,
    content: list,
    totalElements: list.length,
  };
}

export async function getPublicProductDetail(
  idOrSlug: string
): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/products/${idOrSlug}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return json.data;
      }
    }
  } catch {
    // Fallback to default detail if available
  }

  // Fallback by slug
  if (DEFAULT_PRODUCT_DETAILS[idOrSlug]) {
    return DEFAULT_PRODUCT_DETAILS[idOrSlug];
  }

  // Fallback by ID
  const found = Object.values(DEFAULT_PRODUCT_DETAILS).find(
    (d) => String(d.id) === String(idOrSlug)
  );
  if (found) {
    return found;
  }

  // Fallback construct from default list
  const listMatch = DEFAULT_FEATURED_PRODUCTS.find(
    (p) => String(p.id) === String(idOrSlug) || p.slug === idOrSlug
  );

  if (listMatch) {
    return {
      id: listMatch.id,
      categoryId: listMatch.categoryId,
      categoryName: listMatch.categoryName,
      productCode: listMatch.productCode,
      name: listMatch.name,
      slug: listMatch.slug,
      description: `Thiết kế cao cấp độc quyền từ Chickie Studio. Trang phục được giặt khô là hơi khử khuẩn thơm tho trước khi giao tới khách hàng.`,
      material: "Chất liệu cao cấp, mềm mại và tôn dáng",
      occasion: "Chụp ảnh kỷ yếu, tiệc cưới, sự kiện, dạo phố sống ảo",
      rentalPrice: listMatch.rentalPrice,
      depositPrice: listMatch.depositPrice,
      status: listMatch.status,
      variants: [
        { id: 1, size: "S", color: "Tiêu chuẩn", sku: `${listMatch.productCode}-S` },
        { id: 2, size: "M", color: "Tiêu chuẩn", sku: `${listMatch.productCode}-M` },
        { id: 3, size: "L", color: "Tiêu chuẩn", sku: `${listMatch.productCode}-L` },
      ],
      images: [
        {
          id: 1,
          imageUrl:
            listMatch.thumbnailUrl ||
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
          isThumbnail: true,
          displayOrder: 1,
        },
      ],
    };
  }

  return null;
}
