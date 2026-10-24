import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Truck,
  RotateCcw,
  ShieldCheck,
  HardDrive,
  Sliders,
  FolderCheck,
  Camera,
  CheckCircle2,
  Palette,
  Cpu,
  Sparkle,
} from "lucide-react";

export type BusinessPillar = "COSTUME" | "CAMERA" | "PHOTOGRAPHY";

export interface PillarGuarantee {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface PillarBookingConfig {
  title: string;
  subtitle: string;
  variantLabel: string;
  showSizeGuide: boolean;
  colorLabel: string;
  dateRangeLabel: string;
  durationUnitLabel: string;
  studioCheckboxTitle: string;
  studioCheckboxAddress: string;
  deliveryAddressLabel: string;
  deliveryAddressPlaceholder: string;
  noteLabel: string;
  notePlaceholder: string;
  depositSummaryLabel: string;
  depositSummaryNote: string;
  submitBtnText: string;
  successModalTitle: string;
  successModalSubtitle: string;
  successItemLabel: string;
  successVariantLabel: string;
  successFollowupNote: string;
  successContinueBtnText: string;
}

export interface PillarConfig {
  pillar: BusinessPillar;
  pillarBadgeLabel: string;
  availabilityLabel: string;
  priceUnit: string;
  depositBadge: (formattedDeposit: string) => string;
  ratingSubtitle: string;
  specs: {
    materialLabel: string;
    occasionLabel: string;
    materialIcon: LucideIcon;
    occasionIcon: LucideIcon;
  };
  descriptionTitle: string;
  guarantees: PillarGuarantee[];
  booking: PillarBookingConfig;
  relatedHeading: {
    title: string;
    description: string;
  };
}

export function resolveProductPillar(
  type?: string,
  categoryName?: string
): BusinessPillar {
  if (type) {
    const upper = type.toUpperCase();
    if (upper === "CAMERA") return "CAMERA";
    if (upper === "PHOTOGRAPHY") return "PHOTOGRAPHY";
    if (upper === "COSTUME") return "COSTUME";
  }

  if (categoryName) {
    const cat = categoryName.toLowerCase();
    if (
      cat.includes("máy ảnh") ||
      cat.includes("camera") ||
      cat.includes("ống kính") ||
      cat.includes("lens") ||
      cat.includes("phụ kiện")
    ) {
      return "CAMERA";
    }
    if (
      cat.includes("chụp ảnh") ||
      cat.includes("gói chụp") ||
      cat.includes("photography") ||
      cat.includes("concept")
    ) {
      return "PHOTOGRAPHY";
    }
  }

  return "COSTUME";
}

export const PILLAR_CONFIGS: Record<BusinessPillar, PillarConfig> = {
  COSTUME: {
    pillar: "COSTUME",
    pillarBadgeLabel: "Thuê Trang Phục",
    availabilityLabel: "Sẵn sàng cho thuê (Đã tiệt trùng)",
    priceUnit: "/ngày",
    depositBadge: (formattedDeposit) =>
      `Tiền cọc: ${formattedDeposit}đ (Hoàn 100% khi trả đồ)`,
    ratingSubtitle: "Hơn 120+ lượt thuê thành công",
    specs: {
      materialLabel: "Chất liệu cao cấp:",
      occasionLabel: "Dịp phù hợp:",
      materialIcon: Sparkle,
      occasionIcon: Sparkles,
    },
    descriptionTitle: "Mô tả thiết kế & Phom dáng",
    guarantees: [
      {
        icon: Sparkles,
        title: "Giặt hấp tiệt trùng trước khi giao",
        description: "Khử khuẩn bằng công nghệ hơi nước thơm tho",
      },
      {
        icon: Truck,
        title: "Giao hỏa tốc nội thành Hà Nội",
        description: "Nhận đồ đúng hẹn, đóng gói cẩn thận 2 lớp",
      },
      {
        icon: RotateCcw,
        title: "Hỗ trợ đổi size linh hoạt trong ngày",
        description: "Đổi size tận nơi nếu mặc không vừa vặn",
      },
    ],
    booking: {
      title: "Đặt Lịch Thuê & Thử Váy",
      subtitle: "Giữ lịch nhanh chóng • Nhận đồ thơm tho • Hỗ trợ đổi size tận tình",
      variantLabel: "Kích cỡ (Size)",
      showSizeGuide: true,
      colorLabel: "Màu sắc:",
      dateRangeLabel: "Thời gian thuê trang phục",
      durationUnitLabel: "ngày",
      studioCheckboxTitle: "Thử đồ trực tiếp tại Studio:",
      studioCheckboxAddress:
        "Số 18 Ngõ 120 Hoàng Hoa Thám, Ba Đình, Hà Nội (Mở cửa 8:30 - 21:00)",
      deliveryAddressLabel: "Địa chỉ nhận hàng (Giao tận nơi)",
      deliveryAddressPlaceholder: "Nhập địa chỉ nhận đồ tại Hà Nội hoặc tỉnh...",
      noteLabel: "Ghi chú thêm (chiều cao, cân nặng, thời gian nhận)",
      notePlaceholder: "Ví dụ: Cao 1m62 nặng 48kg, cần giao trước 9h sáng thứ 7...",
      depositSummaryLabel: "Tiền cọc bảo hiểm (Hoàn 100%):",
      depositSummaryNote: "(Đã gồm tiền cọc, cọc hoàn lại khi trả đồ)",
      submitBtnText: "Xác Nhận Đặt Thuê Ngay",
      successModalTitle: "Đặt Lịch Thuê Thành Công!",
      successModalSubtitle: "Chickie Studio đã nhận được thông tin đăng ký của bạn.",
      successItemLabel: "Trang phục:",
      successVariantLabel: "Kích cỡ / Màu:",
      successFollowupNote:
        "Chuyên viên tiệm sẽ gọi hoặc nhắn tin Zalo tới số điện thoại của bạn trong vòng 15 phút để chốt lịch và chuẩn bị đồ thơm tho!",
      successContinueBtnText: "Tiếp tục khám phá đồ đẹp",
    },
    relatedHeading: {
      title: "Mẫu Thiết Kế Tương Tự",
      description: "Khám phá thêm các mẫu váy và trang phục cùng phong cách",
    },
  },

  CAMERA: {
    pillar: "CAMERA",
    pillarBadgeLabel: "Thuê Máy Ảnh & Thiết Bị",
    availabilityLabel: "Thiết bị sẵn sàng (Đã test kỹ thuật 100%)",
    priceUnit: "/ngày",
    depositBadge: (formattedDeposit) =>
      `Cọc thiết bị: ${formattedDeposit}đ (Hoàn 100% khi hoàn trả)`,
    ratingSubtitle: "Hơn 85+ lượt thuê máy an tâm",
    specs: {
      materialLabel: "Thông số & Tình trạng:",
      occasionLabel: "Mục đích sử dụng:",
      materialIcon: Cpu,
      occasionIcon: Camera,
    },
    descriptionTitle: "Thông số kỹ thuật & Giới thiệu thiết bị",
    guarantees: [
      {
        icon: ShieldCheck,
        title: "Kiểm tra kỹ thuật 100% trước bàn giao",
        description: "Sensor sạch bóng, thấu kính không trầy xước hay mốc rễ",
      },
      {
        icon: HardDrive,
        title: "Kèm đầy đủ phụ kiện tác nghiệp",
        description: "Tặng kèm túi chống sốc, 2 pin, sạc và thẻ nhớ tốc độ cao",
      },
      {
        icon: Sliders,
        title: "Hỗ trợ set màu máy & hướng dẫn sử dụng",
        description: "Chuyên viên hướng dẫn thao tác chụp/quay và set màu tối ưu",
      },
    ],
    booking: {
      title: "Đặt Thuê Máy Ảnh & Thiết Bị",
      subtitle: "Kiểm tra máy trực tiếp • Phụ kiện đầy đủ • Sẵn sàng tác nghiệp",
      variantLabel: "Phiên bản / Bộ Combo",
      showSizeGuide: false,
      colorLabel: "Tùy chọn / Màu máy:",
      dateRangeLabel: "Thời gian thuê thiết bị",
      durationUnitLabel: "ngày",
      studioCheckboxTitle: "Nhận & test máy trực tiếp tại Studio:",
      studioCheckboxAddress:
        "Số 18 Ngõ 120 Hoàng Hoa Thám, Ba Đình, Hà Nội (Mở cửa 8:30 - 21:00)",
      deliveryAddressLabel: "Địa chỉ giao máy (Hỗ trợ bàn giao & kiểm tra)",
      deliveryAddressPlaceholder: "Nhập địa chỉ nhận máy tại Hà Nội...",
      noteLabel: "Ghi chú thêm (loại thẻ nhớ cần dùng, nhu cầu chụp/quay)",
      notePlaceholder: "Ví dụ: Đi chụp kỷ yếu ngoại cảnh, cần hướng dẫn set màu film...",
      depositSummaryLabel: "Tiền cọc thiết bị (Hoàn 100%):",
      depositSummaryNote: "(Đã gồm tiền cọc, hoàn lại ngay khi kiểm tra xong)",
      submitBtnText: "Xác Nhận Thuê Thiết Bị",
      successModalTitle: "Đặt Thuê Thiết Bị Thành Công!",
      successModalSubtitle: "Chickie Studio đã nhận thông tin đặt thuê thiết bị của bạn.",
      successItemLabel: "Thiết bị:",
      successVariantLabel: "Combo / Tùy chọn:",
      successFollowupNote:
        "Kỹ thuật viên Chickie sẽ liên hệ với bạn trong vòng 15 phút để chốt danh sách phụ kiện và thời gian bàn giao thiết bị!",
      successContinueBtnText: "Khám phá thêm thiết bị",
    },
    relatedHeading: {
      title: "Thiết Bị & Phụ Kiện Tương Tự",
      description: "Khám phá thêm các dòng máy ảnh mirrorless, ống kính và combo tác nghiệp",
    },
  },

  PHOTOGRAPHY: {
    pillar: "PHOTOGRAPHY",
    pillarBadgeLabel: "Dịch Vụ Chụp Ảnh",
    availabilityLabel: "Lịch chụp đang mở (Nhận book lịch trước)",
    priceUnit: "/gói",
    depositBadge: (formattedDeposit) =>
      `Cọc giữ lịch: ${formattedDeposit}đ (Trừ trực tiếp khi thanh toán)`,
    ratingSubtitle: "Hơn 60+ buổi chụp hài lòng",
    specs: {
      materialLabel: "Quyền lợi gói chụp:",
      occasionLabel: "Địa điểm & Concept:",
      materialIcon: CheckCircle2,
      occasionIcon: Palette,
    },
    descriptionTitle: "Chi tiết quyền lợi & Quy trình gói chụp",
    guarantees: [
      {
        icon: FolderCheck,
        title: "Bàn giao 100% file ảnh gốc trong 24h",
        description: "Toàn bộ file chụp gốc độ phân giải cao gửi qua Google Drive",
      },
      {
        icon: Camera,
        title: "Photographer chuyên nghiệp & nhiệt tình",
        description: "Nhiếp ảnh gia giàu kinh nghiệm, hướng dẫn tạo dáng từ A-Z",
      },
      {
        icon: Sparkles,
        title: "Retouch da & màu kỹ lưỡng",
        description: "Chỉnh sửa tone màu yêu thích, hỗ trợ sửa đến khi ưng ý",
      },
    ],
    booking: {
      title: "Đăng Ký & Đặt Lịch Chụp Ảnh",
      subtitle: "Giữ lịch với photographer • Tư vấn concept • Trả ảnh đúng hẹn",
      variantLabel: "Quy mô gói chụp",
      showSizeGuide: false,
      colorLabel: "Tone màu & Concept chụp:",
      dateRangeLabel: "Ngày chụp dự kiến",
      durationUnitLabel: "buổi chụp",
      studioCheckboxTitle: "Chụp tại Studio của Chickie:",
      studioCheckboxAddress:
        "Số 18 Ngõ 120 Hoàng Hoa Thám, Ba Đình, Hà Nội (Trang bị sẵn bối cảnh)",
      deliveryAddressLabel: "Địa điểm chụp mong muốn (Ngoại cảnh / Quán cafe / Phim trường)",
      deliveryAddressPlaceholder: "Ví dụ: Bờ hồ Hoàn Kiếm, Cafe đường tàu, Thảo Nguyên Hoa...",
      noteLabel: "Ghi chú concept, số lượng người, mong muốn buổi chụp",
      notePlaceholder: "Ví dụ: Chụp ảnh sinh nhật 2 người, muốn tone màu vintage hoài niệm...",
      depositSummaryLabel: "Tiền cọc giữ lịch (Trừ vào hóa đơn):",
      depositSummaryNote: "(Chi phí dự kiến, cọc được trừ trực tiếp vào hóa đơn buổi chụp)",
      submitBtnText: "Xác Nhận Đặt Lịch Chụp",
      successModalTitle: "Đăng Ký Lịch Chụp Thành Công!",
      successModalSubtitle: "Chickie Studio đã nhận thông tin đăng ký gói chụp của bạn.",
      successItemLabel: "Gói dịch vụ:",
      successVariantLabel: "Quy mô / Concept:",
      successFollowupNote:
        "Photographer hoặc CSKH sẽ liên hệ với bạn trong vòng 15 phút để thảo luận chi tiết concept và thời gian chụp cụ thể!",
      successContinueBtnText: "Khám phá thêm gói chụp",
    },
    relatedHeading: {
      title: "Gói Chụp & Dịch Vụ Khác",
      description: "Tham khảo thêm các concept chụp ảnh ngoại cảnh, kỷ yếu và studio nghệ thuật",
    },
  },
};
