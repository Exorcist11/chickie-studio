import * as React from "react";
import type { Metadata } from "next";
import { Container, Section, Header, Footer } from "@/components/ui";
import { Sparkles } from "lucide-react";
import { getPublicCategories } from "@/lib/api/category";
import { getPublicProducts } from "@/lib/api/product";
import { ProductCatalogView } from "@/components/features/products";

export const metadata: Metadata = {
  title: "Danh Sách Sản Phẩm | Chickie Studio",
  description:
    "Bộ sưu tập váy dạ hội, áo dài kỷ yếu, váy cưới và combo máy ảnh Sony/Canon cho thuê tại Hà Nội.",
};

interface ProductsPageProps {
  searchParams?: {
    category?: string;
    type?: string;
    search?: string;
    page?: string;
  };
}

function getBannerInfo(type?: string) {
  switch (type?.toLowerCase()) {
    case "costume":
      return {
        badge: "Chickie Studio Wardrobe",
        title: "Thuê Trang Phục Thiết Kế",
        desc: "Bộ sưu tập váy dạ hội, áo dài kỷ yếu, váy cưới và phụ kiện thiết kế cao cấp cho các buổi chụp ảnh và sự kiện.",
      };
    case "camera":
      return {
        badge: "Chickie Studio Camera Rental",
        title: "Thuê Máy Ảnh & Thiết Bị Quay Chụp",
        desc: "Dịch vụ cho thuê combo máy ảnh Sony, Canon, Fujifilm du lịch chuyên nghiệp kèm pin sạc và thẻ nhớ tốc độ cao.",
      };
    case "photography":
      return {
        badge: "Chickie Studio Photography",
        title: "Dịch Vụ Chụp Ảnh Ngoại Cảnh & Studio",
        desc: "Các gói chụp ảnh kỷ yếu, nàng thơ ngoại cảnh và concept studio trọn gói với ekip tận tâm, chuyên nghiệp.",
      };
    default:
      return {
        badge: "Chickie Studio Lookbook",
        title: "Thuê Trang Phục, Máy Ảnh & Dịch Vụ Chụp",
        desc: "Khám phá bộ sưu tập thời trang thiết kế cao cấp, combo máy ảnh du lịch chuyên nghiệp và các gói chụp ảnh ngoại cảnh kỷ yếu trọn gói.",
      };
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const currentCategorySlug = searchParams?.category || "";
  const currentType = searchParams?.type || "";
  const searchKeyword = searchParams?.search || "";

  const [categories, productsResult] = await Promise.all([
    getPublicCategories(),
    getPublicProducts({ size: 40 }),
  ]);

  const products = productsResult.content;
  const bannerInfo = getBannerInfo(currentType);

  return (
    <div className="min-h-screen bg-warm-white text-ink flex flex-col justify-between">
      <div>
        <Header currentType={currentType} favoriteCount={0} />

        {/* Page Banner (Matching Mockup & E2E) */}
        <section className="relative overflow-hidden bg-gradient-to-b from-ivory/80 via-ivory/40 to-warm-white py-10 md:py-14 border-b border-line">
          <Container className="text-center max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-burgundy" />
              <span>{bannerInfo.badge}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-ink">
              {bannerInfo.title}
            </h1>

            <p className="text-xs md:text-sm text-ink-muted max-w-xl mx-auto leading-relaxed">
              {bannerInfo.desc}
            </p>
          </Container>
        </section>

        {/* Main Catalog View with Sidebar Filter & Sort Dropdown */}
        <Section className="py-8 md:py-12">
          <Container>
            <ProductCatalogView
              products={products}
              categories={categories}
              initialCategorySlug={currentCategorySlug}
              initialType={currentType}
              initialSearch={searchKeyword}
            />
          </Container>
        </Section>
      </div>

      <Footer />
    </div>
  );
}
