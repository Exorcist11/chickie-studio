import {
  ProductListItem,
  ProductDetail,
  ProductQueryParams,
  PageResult,
  ProductAvailabilityResponse,
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
    type: "COSTUME",
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
    type: "COSTUME",
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
    type: "COSTUME",
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
    type: "COSTUME",
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
    type: "CAMERA",
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
    type: "COSTUME",
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
  {
    id: 7,
    categoryId: 4,
    categoryName: "Máy Ảnh Du Lịch & Phụ Kiện",
    type: "CAMERA",
    productCode: "MA-006",
    name: "Máy ảnh Canon EOS R50 kèm lens Kit 18-45mm STM đa dụng",
    slug: "canon-eos-r50-lens-18-45mm",
    rentalPrice: 270000,
    depositPrice: 1800000,
    status: "ACTIVE",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop",
    variantCount: 1,
  },
  {
    id: 8,
    categoryId: 4,
    categoryName: "Máy Ảnh Du Lịch & Phụ Kiện",
    type: "CAMERA",
    productCode: "MA-007",
    name: "Máy ảnh Fujifilm X-T30 II kèm lens XF 35mm f2 tone màu Film vintage",
    slug: "fujifilm-x-t30-ii-lens-35mm",
    rentalPrice: 320000,
    depositPrice: 2500000,
    status: "ACTIVE",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop",
    variantCount: 1,
  },
  {
    id: 9,
    categoryId: 6,
    categoryName: "Gói Chụp Ngoại Cảnh & Kỷ Yếu",
    type: "PHOTOGRAPHY",
    productCode: "DV-001",
    name: "Gói Chụp Ngoại Cảnh Nàng Thơ 2 Giờ (Nhiếp ảnh gia + 20 ảnh Retouch)",
    slug: "goi-chup-ngoai-canh-nang-tho",
    rentalPrice: 890000,
    depositPrice: 300000,
    status: "ACTIVE",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop",
    variantCount: 1,
  },
  {
    id: 10,
    categoryId: 6,
    categoryName: "Gói Chụp Ngoại Cảnh & Kỷ Yếu",
    type: "PHOTOGRAPHY",
    productCode: "DV-002",
    name: "Gói Chụp Kỷ Yếu Nhóm Bạn Thân Thanh Xuân (Kèm thợ chụp + 40 ảnh Retouch)",
    slug: "goi-chup-ky-yeu-thanh-xuan",
    rentalPrice: 1490000,
    depositPrice: 500000,
    status: "ACTIVE",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop",
    variantCount: 1,
  },
  {
    id: 11,
    categoryId: 7,
    categoryName: "Gói Chụp Concept Studio & Lookbook",
    type: "PHOTOGRAPHY",
    productCode: "DV-003",
    name: "Gói Chụp Concept Studio Lookbook Cá Nhân (Studio chuyên nghiệp + Makeup)",
    slug: "goi-chup-studio-lookbook-ca-nhan",
    rentalPrice: 1200000,
    depositPrice: 400000,
    status: "ACTIVE",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop",
    variantCount: 1,
  },
];

export const DEFAULT_PRODUCT_DETAILS: Record<string, ProductDetail> = {
  "dam-maxi-voan-xoe-tieu-thu": {
    id: 1,
    categoryId: 1,
    categoryName: "Váy Thiết Kế",
    type: "COSTUME",
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
    type: "COSTUME",
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
  "combo-sony-a6400-lens-50mm": {
    id: 5,
    categoryId: 4,
    categoryName: "Máy Ảnh Du Lịch & Phụ Kiện",
    type: "CAMERA",
    productCode: "MA-005",
    name: "Combo Máy ảnh Sony A6400 kèm lens 50mm f1.8 du lịch chân dung",
    slug: "combo-sony-a6400-lens-50mm",
    description:
      "Bộ máy ảnh Sony A6400 cảm biến APS-C 24.2MP lấy nét siêu nhanh 0.02s, đi kèm lens chân dung Sony 50mm f1.8 OSS xóa phông mù mịt. Tặng kèm thẻ nhớ 64GB tốc độ cao, 2 pin và túi chống sốc.",
    material: "Cảm biến APS-C 24.2MP, Lens 50mm f1.8 OSS, Tình trạng mới 98%",
    occasion: "Chụp ảnh ngoại cảnh, du lịch, chân dung, kỷ yếu",
    rentalPrice: 290000,
    depositPrice: 2000000,
    status: "ACTIVE",
    variants: [
      { id: 501, size: "Bộ Kit Tiêu Chuẩn", color: "Đen Graphite", sku: "MA005-STD-BLK" },
      { id: 502, size: "Combo 2 Pin + Thẻ 64GB", color: "Đen Graphite", sku: "MA005-COMBO-BLK" },
    ],
    images: [
      {
        id: 6,
        imageUrl:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop",
        isThumbnail: true,
        displayOrder: 1,
      },
      {
        id: 7,
        imageUrl:
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop",
        isThumbnail: false,
        displayOrder: 2,
      },
    ],
  },
  "canon-eos-r50-lens-18-45mm": {
    id: 7,
    categoryId: 4,
    categoryName: "Máy Ảnh Du Lịch & Phụ Kiện",
    type: "CAMERA",
    productCode: "MA-006",
    name: "Máy ảnh Canon EOS R50 kèm lens Kit 18-45mm STM đa dụng",
    slug: "canon-eos-r50-lens-18-45mm",
    description:
      "Canon EOS R50 là dòng máy ảnh mirrorless nhỏ gọn ấn tượng với cảm biến CMOS APS-C 24.2MP và chip xử lý DIGIC X thế hệ mới. Hệ thống lấy nét Dual Pixel CMOS AF II thông minh nhận diện khuôn mặt, ánh mắt người và động vật. Kèm lens kit 18-45mm IS STM chống rung mượt mà, phù hợp chụp ảnh du lịch, chân dung kỷ yếu và quay vlog 4K 30p sắc nét.",
    material: "Cảm biến APS-C 24.2MP, Chip DIGIC X, Lens 18-45mm STM, Tình trạng mới 99%",
    occasion: "Quay Vlog, Du lịch khám phá, Chân dung kỷ yếu, Chụp sự kiện ngoài trời",
    rentalPrice: 270000,
    depositPrice: 1800000,
    status: "ACTIVE",
    variants: [
      { id: 701, size: "Bộ Kit Tiêu Chuẩn", color: "Đen Canon", sku: "R50-KIT-BLK" },
      { id: 702, size: "Combo 2 Pin + Thẻ 64GB", color: "Đen Canon", sku: "R50-COMBO-BLK" },
      { id: 703, size: "Full Combo Kèm Gimbal", color: "Đen Canon", sku: "R50-GIMBAL-BLK" },
    ],
    images: [
      {
        id: 10,
        imageUrl:
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop",
        isThumbnail: true,
        displayOrder: 1,
      },
      {
        id: 11,
        imageUrl:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop",
        isThumbnail: false,
        displayOrder: 2,
      },
      {
        id: 12,
        imageUrl:
          "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop",
        isThumbnail: false,
        displayOrder: 3,
      },
    ],
  },
  "fujifilm-x-t30-ii-lens-35mm": {
    id: 8,
    categoryId: 4,
    categoryName: "Máy Ảnh Du Lịch & Phụ Kiện",
    type: "CAMERA",
    productCode: "MA-007",
    name: "Máy ảnh Fujifilm X-T30 II kèm lens XF 35mm f2 tone màu Film vintage",
    slug: "fujifilm-x-t30-ii-lens-35mm",
    description:
      "Fujifilm X-T30 II sở hữu 18 bộ lọc giả lập màu Film kinh điển của Fuji như Classic Chrome, Classic Neg cho ảnh chụp ra đẹp ngay không cần chỉnh sửa hậu kỳ. Cảm biến X-Trans CMOS 4 26.1MP kết hợp ống kính XF 35mm F2 R WR sắc nét từng chi tiết.",
    material: "Cảm biến X-Trans CMOS 4 26.1MP, Lens XF 35mm F2, Tình trạng 98%",
    occasion: "Chụp ảnh phong cách Film vintage, Dạo phố, Cafe sống ảo, Kỷ yếu",
    rentalPrice: 320000,
    depositPrice: 2500000,
    status: "ACTIVE",
    variants: [
      { id: 801, size: "Bộ Kit Tiêu Chuẩn", color: "Bạc Cổ Điển", sku: "XT30-KIT-SLV" },
      { id: 802, size: "Combo 2 Pin + Thẻ 128GB", color: "Bạc Cổ Điển", sku: "XT30-COMBO-SLV" },
    ],
    images: [
      {
        id: 13,
        imageUrl:
          "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop",
        isThumbnail: true,
        displayOrder: 1,
      },
    ],
  },
  "goi-chup-ngoai-canh-nang-tho": {
    id: 9,
    categoryId: 6,
    categoryName: "Gói Chụp Ngoại Cảnh & Kỷ Yếu",
    type: "PHOTOGRAPHY",
    productCode: "DV-001",
    name: "Gói Chụp Ngoại Cảnh Nàng Thơ 2 Giờ (Nhiếp ảnh gia + 20 ảnh Retouch)",
    slug: "goi-chup-ngoai-canh-nang-tho",
    description:
      "Gói dịch vụ chụp ảnh ngoại cảnh 2 giờ tại các địa điểm thơ mộng Hà Nội. Đội ngũ photographer nhiệt tình hướng dẫn tạo dáng từ A-Z, trả toàn bộ file gốc và 20 ảnh photoshop kỹ lưỡng.",
    material: "Gói dịch vụ chụp ảnh trọn gói (2 giờ chụp + 20 ảnh chỉnh sửa)",
    occasion: "Chụp ảnh cá nhân kỷ niệm, sinh nhật, dạo phố nàng thơ",
    rentalPrice: 890000,
    depositPrice: 300000,
    status: "ACTIVE",
    variants: [
      { id: 901, size: "Cá nhân (1 người)", color: "Tone Nàng Thơ Vintage", sku: "DV001-SINGLE" },
      { id: 902, size: "Cặp đôi (2 người)", color: "Tone Nàng Thơ Vintage", sku: "DV001-COUPLE" },
      { id: 903, size: "Nhóm bạn (3-5 người)", color: "Tone Trong Trẻo Nhật Bản", sku: "DV001-GROUP" },
    ],
    images: [
      {
        id: 8,
        imageUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop",
        isThumbnail: true,
        displayOrder: 1,
      },
      {
        id: 9,
        imageUrl:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop",
        isThumbnail: false,
        displayOrder: 2,
      },
    ],
  },
  "goi-chup-ky-yeu-thanh-xuan": {
    id: 10,
    categoryId: 6,
    categoryName: "Gói Chụp Ngoại Cảnh & Kỷ Yếu",
    type: "PHOTOGRAPHY",
    productCode: "DV-002",
    name: "Gói Chụp Kỷ Yếu Nhóm Bạn Thân Thanh Xuân (Kèm thợ chụp + 40 ảnh Retouch)",
    slug: "goi-chup-ky-yeu-thanh-xuan",
    description:
      "Gói chụp ảnh kỷ yếu thanh xuân dành cho nhóm bạn thân từ 3 đến 8 người. Ekip gồm 1 thợ chính và 1 trợ lý ánh sáng, hỗ trợ đạo cụ (loa cẩm tay, bóng bay, hoa tươi). Bàn giao 100% file gốc ngay trong ngày và 40 ảnh chỉnh sửa tỉ mỉ.",
    material: "Ekip chuyên nghiệp 3 giờ, Hỗ trợ đạo cụ & Concept trọn gói",
    occasion: "Kỷ yếu tốt nghiệp cấp 3, đại học, Nhóm bạn thân dạo phố Hà Nội",
    rentalPrice: 1490000,
    depositPrice: 500000,
    status: "ACTIVE",
    variants: [
      { id: 1001, size: "Nhóm 3 - 5 người", color: "Tone Thanh Xuân Hàn Quốc", sku: "DV002-GRP-5" },
      { id: 1002, size: "Nhóm 6 - 8 người", color: "Tone Thanh Xuân Hàn Quốc", sku: "DV002-GRP-8" },
    ],
    images: [
      {
        id: 14,
        imageUrl:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop",
        isThumbnail: true,
        displayOrder: 1,
      },
    ],
  },
  "goi-chup-studio-lookbook-ca-nhan": {
    id: 11,
    categoryId: 7,
    categoryName: "Gói Chụp Concept Studio & Lookbook",
    type: "PHOTOGRAPHY",
    productCode: "DV-003",
    name: "Gói Chụp Concept Studio Lookbook Cá Nhân (Studio chuyên nghiệp + Makeup)",
    slug: "goi-chup-studio-lookbook-ca-nhan",
    description:
      "Trọn gói chụp ảnh cá nhân profile, lookbook thời trang hoặc sinh nhật tại Studio Chickie. Đã bao gồm thợ trang điểm làm tóc chuyên nghiệp, phòng chụp máy lạnh với hệ thống đèn Profoto chuẩn quốc tế.",
    material: "Studio chuyên nghiệp 2 giờ, Bao gồm Makeup & Làm tóc",
    occasion: "Chụp ảnh sinh nhật cá nhân, Profile nghệ thuật, Lookbook thời trang",
    rentalPrice: 1200000,
    depositPrice: 400000,
    status: "ACTIVE",
    variants: [
      { id: 1101, size: "Gói Cá Nhân Cơ Bản", color: "Concept Tone Trắng Tối Giản", sku: "DV003-BASIC" },
      { id: 1102, size: "Gói Cá Nhân Cao Cấp", color: "Concept Hoa Nghệ Thuật", sku: "DV003-PREMIUM" },
    ],
    images: [
      {
        id: 15,
        imageUrl:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop",
        isThumbnail: true,
        displayOrder: 1,
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
  if (params?.type) {
    query.append("type", params.type.toUpperCase());
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
      signal: typeof AbortSignal !== "undefined" && "timeout" in AbortSignal ? AbortSignal.timeout(3000) : undefined,
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

  if (params?.type) {
    const targetType = params.type.toUpperCase();
    list = list.filter((p) => p.type?.toUpperCase() === targetType);
  }

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
      signal: typeof AbortSignal !== "undefined" && "timeout" in AbortSignal ? AbortSignal.timeout(3000) : undefined,
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
    const isCamera = listMatch.type === "CAMERA";
    const isPhotography = listMatch.type === "PHOTOGRAPHY";

    const defaultDescription = isCamera
      ? `Thiết bị máy ảnh chính hãng đã qua kiểm định kỹ thuật 100% tại Chickie Studio. Sensor sạch, ống kính trong trẻo, đi kèm pin, sạc và thẻ nhớ tốc độ cao.`
      : isPhotography
      ? `Gói dịch vụ chụp ảnh chuyên nghiệp tại Chickie Studio với photographer dày dặn kinh nghiệm, hỗ trợ tạo dáng và trả toàn bộ file gốc cùng ảnh chỉnh sửa nước ảnh cao cấp.`
      : `Thiết kế cao cấp độc quyền từ Chickie Studio. Trang phục được giặt khô là hơi khử khuẩn thơm tho trước khi giao tới khách hàng.`;

    const defaultMaterial = isCamera
      ? "Cảm biến chất lượng cao, ống kính sắc nét, tình trạng 98-99%"
      : isPhotography
      ? "Dịch vụ chụp ảnh trọn gói (Photographer chuyên nghiệp + Retouch)"
      : "Chất liệu cao cấp, mềm mại và tôn dáng";

    const defaultOccasion = isCamera
      ? "Quay Vlog, Du lịch, Chụp chân dung, Kỷ yếu & Sự kiện"
      : isPhotography
      ? "Chụp ảnh kỷ yếu, Sự kiện, Sinh nhật cá nhân, Lookbook thời trang"
      : "Chụp ảnh kỷ yếu, tiệc cưới, sự kiện, dạo phố sống ảo";

    const defaultVariants = isCamera
      ? [
          { id: 1, size: "Bộ Kit Tiêu Chuẩn", color: "Mặc định", sku: `${listMatch.productCode}-STD` },
          { id: 2, size: "Combo 2 Pin + Thẻ Nhớ", color: "Mặc định", sku: `${listMatch.productCode}-COMBO` },
        ]
      : isPhotography
      ? [
          { id: 1, size: "Gói Cá Nhân", color: "Tone Tự Nhiên", sku: `${listMatch.productCode}-SINGLE` },
          { id: 2, size: "Gói Nhóm", color: "Tone Tự Nhiên", sku: `${listMatch.productCode}-GROUP` },
        ]
      : [
          { id: 1, size: "S", color: "Tiêu chuẩn", sku: `${listMatch.productCode}-S` },
          { id: 2, size: "M", color: "Tiêu chuẩn", sku: `${listMatch.productCode}-M` },
          { id: 3, size: "L", color: "Tiêu chuẩn", sku: `${listMatch.productCode}-L` },
        ];

    return {
      id: listMatch.id,
      categoryId: listMatch.categoryId,
      categoryName: listMatch.categoryName,
      type: listMatch.type || "COSTUME",
      productCode: listMatch.productCode,
      name: listMatch.name,
      slug: listMatch.slug,
      description: defaultDescription,
      material: defaultMaterial,
      occasion: defaultOccasion,
      rentalPrice: listMatch.rentalPrice,
      depositPrice: listMatch.depositPrice,
      status: listMatch.status,
      variants: defaultVariants,
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

export async function getPublicProductAvailability(
  slug: string,
  variantId?: number,
  month?: string
): Promise<ProductAvailabilityResponse | null> {
  const currentMonth = month || new Date().toISOString().slice(0, 7);
  const queryParams = new URLSearchParams();
  queryParams.set("month", currentMonth);
  if (variantId) {
    queryParams.set("variantId", variantId.toString());
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/public/products/${encodeURIComponent(slug)}/availability?${queryParams.toString()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        return data.data as ProductAvailabilityResponse;
      }
    }
  } catch (_error) {
    // Fallback to local calculation if backend is unreachable
  }

  // Fallback dynamic generator for offline/demo reliability
  const [yearStr, monthNumStr] = currentMonth.split("-");
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthNumStr, 10);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const todayStr = new Date().toISOString().split("T")[0];

  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isPast = dayStr < todayStr;
    // Simulate realistic bookings on some weekend days
    const dayOfWeek = new Date(year, monthNum - 1, d).getDay();
    const isBusyWeekend = (dayOfWeek === 0 || dayOfWeek === 6) && (d === 14 || d === 15);

    days.push({
      date: dayStr,
      available: !isPast && !isBusyWeekend,
      remainingCount: isPast ? 0 : isBusyWeekend ? 0 : 2,
      reason: isPast ? "PAST_DATE" : isBusyWeekend ? "FULLY_BOOKED" : "AVAILABLE",
    });
  }

  const matchedProduct = DEFAULT_FEATURED_PRODUCTS.find((p) => p.slug === slug);
  const isNonCostume =
    matchedProduct?.type === "CAMERA" ||
    matchedProduct?.type === "PHOTOGRAPHY" ||
    slug.includes("camera") ||
    slug.includes("sony") ||
    slug.includes("canon") ||
    slug.includes("fuji") ||
    slug.includes("chup") ||
    slug.includes("photo");
  const bufferDays = isNonCostume ? 0 : 1;

  return {
    productId: matchedProduct?.id || 1,
    slug,
    productName: matchedProduct?.name || "Sản phẩm",
    variantId,
    month: currentMonth,
    totalItems: 3,
    availableItems: 2,
    bufferDays,
    days,
  };
}

