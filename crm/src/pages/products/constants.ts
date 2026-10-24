import React from "react";
import { Shirt, Camera, Sparkles } from "lucide-react";
import { CategoryType } from "../../types/category";

export interface PillarProductConfig {
  type: CategoryType;
  name: string;
  badgeLabel: string;
  modalSubtitle: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  specsTabLabel: string;
  generalCardSubtitle: string;
  codePlaceholder: string;
  namePlaceholder: string;
  rentalPriceLabel: string;
  depositPriceLabel: string;
  depositPresets: { label: string; calculate: (rentalPrice: number) => number }[];
  variantsTitle: string;
  variantsSubtitle: string;
  quickChipsLabel: string;
  quickChips: string[];
  defaultVariant: { size: string; color: string; sku?: string };
  sizeFieldLabel: string;
  sizePlaceholder: string;
  colorFieldLabel: string;
  colorPlaceholder: string;
  mediaTitle: string;
  mediaSubtitle: string;
  mediaEmptyNotice: string;
  specsTitle: string;
  specsSubtitle: string;
  materialLabel: string;
  materialPlaceholder: string;
  occasionLabel: string;
  occasionPlaceholder: string;
}

export const PILLAR_PRODUCT_CONFIG: Record<CategoryType, PillarProductConfig> = {
  COSTUME: {
    type: "COSTUME",
    name: "Thuê trang phục",
    badgeLabel: "LOOKBOOK TRANG PHỤC",
    modalSubtitle: "Thêm mẫu váy dạ hội, áo dài hoặc trang phục thiết kế vào kho đồ",
    icon: Shirt,
    specsTabLabel: "Chất liệu & Dịp",
    generalCardSubtitle: "Tên trang phục, danh mục thời trang và mã định danh Lookbook",
    codePlaceholder: "VD: VAY-DAHOI-01",
    namePlaceholder: "Ví dụ: Váy Lụa Trắng Cổ Yếm",
    rentalPriceLabel: "Giá thuê trang phục / ngày",
    depositPriceLabel: "Tiền cọc trang phục",
    depositPresets: [
      { label: "100% giá thuê", calculate: (r) => r * 1 },
      { label: "200% giá thuê", calculate: (r) => r * 2 },
      { label: "500k", calculate: () => 500000 },
      { label: "1 Triệu", calculate: () => 1000000 },
    ],
    variantsTitle: "Biến thể trang phục (Kích cỡ & Màu sắc)",
    variantsSubtitle: "Quản lý các size may đo và màu sắc có sẵn trong kho",
    quickChipsLabel: "+ Thêm nhanh Size:",
    quickChips: ["Freesize", "S", "M", "L", "XL"],
    defaultVariant: { size: "Freesize", color: "Trắng", sku: "" },
    sizeFieldLabel: "Kích cỡ",
    sizePlaceholder: "Chọn kích cỡ (S, M, L, Freesize...)",
    colorFieldLabel: "Màu sắc",
    colorPlaceholder: "Màu sắc (ví dụ: Trắng ngà, Đỏ rượu, Đen tuyền...)",
    mediaTitle: "3. Thư viện hình ảnh Lookbook",
    mediaSubtitle: "Tải ảnh mẫu mặc thực tế, chi tiết form dáng từ máy tính lên máy chủ",
    mediaEmptyNotice: "Chưa có hình ảnh nào được tải lên cho mẫu Lookbook này",
    specsTitle: "4. Đặc tính trang phục",
    specsSubtitle: "Chất liệu may mặc và các dịp sự kiện chụp ảnh phù hợp",
    materialLabel: "Chất liệu vải",
    materialPlaceholder: "Ví dụ: Lụa tơ tằm cao cấp, Voan kính, Gấm thêu hoa...",
    occasionLabel: "Dịp sự kiện phù hợp",
    occasionPlaceholder: "Ví dụ: Tiệc tối, Kỷ yếu thanh xuân, Tiệc cưới, Lookbook cá nhân...",
  },
  CAMERA: {
    type: "CAMERA",
    name: "Thuê máy ảnh",
    badgeLabel: "THIẾT BỊ MÁY ẢNH",
    modalSubtitle: "Thêm máy ảnh, ống kính hoặc thiết bị quay chụp vào kho thiết bị",
    icon: Camera,
    specsTabLabel: "Thông số thiết bị",
    generalCardSubtitle: "Tên thiết bị (Model máy/Ống kính), danh mục và mã tài sản",
    codePlaceholder: "VD: CAM-SONY-A6400",
    namePlaceholder: "Ví dụ: Sony Alpha A6400 kèm Kit 16-50mm",
    rentalPriceLabel: "Giá thuê thiết bị / ngày",
    depositPriceLabel: "Tiền cọc thiết bị / máy ảnh",
    depositPresets: [
      { label: "100% giá thuê", calculate: (r) => r * 1 },
      { label: "300% giá thuê", calculate: (r) => r * 3 },
      { label: "1 Triệu", calculate: () => 1000000 },
      { label: "2 Triệu", calculate: () => 2000000 },
    ],
    variantsTitle: "Phiên bản thiết bị (Combo / Ống kính kèm theo)",
    variantsSubtitle: "Tùy chọn thân máy riêng hoặc bộ kit kèm thẻ nhớ, pin phụ",
    quickChipsLabel: "+ Thêm nhanh Bộ Kit:",
    quickChips: ["Body Only", "Kit 16-50mm", "Kit 18-55mm", "Combo 2 Pin"],
    defaultVariant: { size: "Body Only", color: "Đen", sku: "" },
    sizeFieldLabel: "Phiên bản / Bộ Kit",
    sizePlaceholder: "Phiên bản/Bộ kit (vd: Body Only, Kèm Lens 16-50mm...)",
    colorFieldLabel: "Màu máy / Tình trạng",
    colorPlaceholder: "Màu máy/Tình trạng (vd: Đen, Bạc Silver, Mới 99%)...",
    mediaTitle: "3. Hình ảnh thiết bị & Phụ kiện thực tế",
    mediaSubtitle: "Ảnh chụp cận cảnh thân máy, ống kính, cảm biến và phụ kiện đi kèm",
    mediaEmptyNotice: "Chưa có hình ảnh nào được tải lên cho thiết bị máy ảnh này",
    specsTitle: "4. Thông số kỹ thuật & Tình trạng thiết bị",
    specsSubtitle: "Phụ kiện đi kèm trong bộ cho thuê và mục đích quay chụp nổi bật",
    materialLabel: "Phụ kiện kèm theo & Tình trạng máy",
    materialPlaceholder: "Ví dụ: Máy mới 98%, kèm 2 pin zin, sạc đôi, thẻ 64GB 170MB/s, túi chống sốc...",
    occasionLabel: "Mục đích sử dụng & Tính năng nổi bật",
    occasionPlaceholder: "Ví dụ: Chụp chân dung xóa phông, quay Vlog 4K chống rung, chụp du lịch đường phố...",
  },
  PHOTOGRAPHY: {
    type: "PHOTOGRAPHY",
    name: "Dịch vụ chụp ảnh",
    badgeLabel: "GÓI DỊCH VỤ CHỤP",
    modalSubtitle: "Thêm gói dịch vụ chụp ảnh ngoại cảnh, kỷ yếu hoặc concept studio",
    icon: Sparkles,
    specsTabLabel: "Quy cách gói chụp",
    generalCardSubtitle: "Tên gói chụp, danh mục dịch vụ và mã gói dịch vụ",
    codePlaceholder: "VD: PHOTO-NGOAICANH-01",
    namePlaceholder: "Ví dụ: Gói Chụp Ngoại Cảnh Nàng Thơ",
    rentalPriceLabel: "Giá trọn gói dịch vụ chụp",
    depositPriceLabel: "Tiền cọc giữ lịch chụp",
    depositPresets: [
      { label: "30% giá gói", calculate: (r) => Math.round(r * 0.3) },
      { label: "50% giá gói", calculate: (r) => Math.round(r * 0.5) },
      { label: "500k", calculate: () => 500000 },
      { label: "1 Triệu", calculate: () => 1000000 },
    ],
    variantsTitle: "Phân loại gói chụp (Quy mô & Địa điểm)",
    variantsSubtitle: "Tùy chọn số lượng người chụp và địa điểm/phong cách",
    quickChipsLabel: "+ Thêm nhanh Quy mô:",
    quickChips: ["Gói Cá Nhân", "Gói Cặp Đôi", "Gói Nhóm 3-5 Người", "Gói Gia Đình"],
    defaultVariant: { size: "Gói Cá Nhân", color: "Ngoại Cảnh", sku: "" },
    sizeFieldLabel: "Quy mô gói",
    sizePlaceholder: "Quy mô gói (vd: Cá nhân 1 người, Cặp đôi, Nhóm 3-5 bạn...)",
    colorFieldLabel: "Địa điểm / Concept",
    colorPlaceholder: "Địa điểm/Concept (vd: Ngoại cảnh Hồ Tây, Concept Studio, Phim trường...)",
    mediaTitle: "3. Bộ ảnh mẫu Concept & Portfolio demo",
    mediaSubtitle: "Tải ảnh sản phẩm demo từ các buổi chụp thực tế để khách hàng tham khảo phong cách",
    mediaEmptyNotice: "Chưa có hình ảnh demo nào cho gói dịch vụ chụp này",
    specsTitle: "4. Quyền lợi dịch vụ & Quy cách gói chụp",
    specsSubtitle: "Số lượng ảnh trả khách, chính sách hậu kỳ retouch và thời lượng chụp",
    materialLabel: "Quyền lợi gói chụp (File ảnh & Hậu kỳ)",
    materialPlaceholder: "Ví dụ: Trả 100% file gốc, blend màu 30 ảnh, retouch da chuyên sâu 10 ảnh, hỗ trợ đạo cụ...",
    occasionLabel: "Thời lượng chụp & Địa điểm / Makeup",
    occasionPlaceholder: "Ví dụ: 2 giờ chụp, miễn phí makeup & làm tóc cơ bản, 1 concept trang phục...",
  },
};
