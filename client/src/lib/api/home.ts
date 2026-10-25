import { HomeFeaturedData } from "@/types/home";
import { DEFAULT_CATEGORIES } from "./category";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const DEFAULT_HOME_FEATURED: HomeFeaturedData = {
  heroBanners: [
    {
      id: 1,
      title: "More than just a dress",
      subtitle: "Váy cưới thiết kế & Maxi chụp ngoại cảnh",
      imageUrl:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop",
      altText: "Người mẫu mặc váy cưới thiết kế cầm hoa thanh lịch Chickie Studio",
      ctaText: "Khám phá bộ sưu tập",
      ctaLink: "/products",
    },
    {
      id: 2,
      title: "Nét duyên truyền thống",
      subtitle: "Áo dài kỷ yếu & sự kiện truyền thống",
      imageUrl:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop",
      altText: "Áo dài cách tân hoa sen kỷ yếu thướt tha",
      ctaText: "Xem bộ sưu tập áo dài",
      ctaLink: "/products?type=costume",
    },
    {
      id: 3,
      title: "Sang trọng & Quyến rũ",
      subtitle: "Đầm dạ hội cao cấp sang trọng",
      imageUrl:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&auto=format&fit=crop",
      altText: "Đầm dạ hội satin sang trọng tiệc tối",
      ctaText: "Xem đầm dạ hội",
      ctaLink: "/products?type=costume",
    },
  ],
  categories: DEFAULT_CATEGORIES,
  topProducts: [],
  services: [
    {
      key: "costume",
      title: "Thuê trang phục",
      description: "Đa dạng phong cách, từ dịu dàng nữ tính đến cá tính hiện đại.",
      imageUrl:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop",
      link: "/products?type=costume",
    },
    {
      key: "camera",
      title: "Thuê máy ảnh",
      description: "Thiết bị chuyên nghiệp, đa dạng thương hiệu, phụ kiện đầy đủ.",
      imageUrl:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop",
      link: "/products?type=camera",
    },
    {
      key: "photography",
      title: "Dịch vụ chụp ảnh",
      description: "Các gói chụp đa dạng, concept độc đáo, đội ngũ nhiếp ảnh gia chuyên nghiệp.",
      imageUrl:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop",
      link: "/products?type=photography",
    },
  ],
  rentalSteps: [
    {
      stepNumber: 1,
      title: "Chọn mẫu & size",
      description: "Khám phá bộ sưu tập váy áo, máy ảnh và chọn dải ngày nhận/trả đồ thuận tiện.",
      icon: "sparkles",
    },
    {
      stepNumber: 2,
      title: "Đặt cọc giữ đồ",
      description: "Xác nhận thông tin, chuyển khoản cọc nhanh qua VietQR hoặc thanh toán trực tiếp.",
      icon: "calendar",
    },
    {
      stepNumber: 3,
      title: "Nhận đồ xinh",
      description: "Nhận đồ đã được giặt ủi thơm tho phẳng phiu tại tiệm hoặc giao tận nơi.",
      icon: "camera",
    },
    {
      stepNumber: 4,
      title: "Trả đồ & hoàn cọc",
      description: "Gửi trả đồ sau buổi chụp và nhận lại tiền cọc an toàn, nhanh chóng.",
      icon: "check-circle",
    },
  ],
  testimonials: [
    {
      id: 1,
      customerName: "Nguyễn Thị Mai",
      role: "Khách hàng thân thiết",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
      content:
        "Dịch vụ tại Chickie Studio thật sự tuyệt vời! Trang phục đẹp, chất lượng, ekip chụp ảnh chuyên nghiệp và rất thân thiện. Mình chắc chắn sẽ quay lại!",
      rating: 5,
    },
  ],
};

export async function getHomeFeaturedData(): Promise<HomeFeaturedData> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/home/featured`, {
      next: { revalidate: 60 },
      signal: typeof AbortSignal !== "undefined" && "timeout" in AbortSignal ? AbortSignal.timeout(3000) : undefined,
    });
    if (!res.ok) {
      return DEFAULT_HOME_FEATURED;
    }
    const json = await res.json();
    return json.data || DEFAULT_HOME_FEATURED;
  } catch {
    return DEFAULT_HOME_FEATURED;
  }
}
