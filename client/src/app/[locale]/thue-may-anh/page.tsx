import * as React from "react";
import type { Metadata } from "next";
import { Container, Section, Header, Footer } from "@/components/ui";
import { Camera, Sparkles } from "lucide-react";
import { getPublicCategories } from "@/lib/api/category";
import { getPublicProducts } from "@/lib/api/product";
import { ProductCatalogView } from "@/components/features/products";

export const metadata: Metadata = {
  title: "Thuê Máy Ảnh & Thiết Bị Quay Chụp Du Lịch Chuyên Nghiệp | Chickie Studio",
  description:
    "Cho thuê combo máy ảnh Sony, Canon, Fujifilm, lens và phụ kiện quay chụp du lịch, sự kiện, kỷ yếu uy tín, kiểm tra kỹ thuật 100% kèm phụ kiện tác nghiệp tại Hà Nội.",
};

interface CameraRentalPageProps {
  searchParams?: {
    category?: string;
    search?: string;
    page?: string;
  };
}

export default async function CameraRentalPage({ searchParams }: CameraRentalPageProps) {
  const currentCategorySlug = searchParams?.category || "";
  const searchKeyword = searchParams?.search || "";

  const [categories, productsResult] = await Promise.all([
    getPublicCategories(),
    getPublicProducts({ size: 40 }),
  ]);

  const products = productsResult.content;

  return (
    <div className="min-h-screen bg-warm-white text-ink flex flex-col justify-between">
      <div>
        <Header activeHref="/thue-may-anh" favoriteCount={0} />

        {/* Page Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-ivory/80 via-ivory/40 to-warm-white py-10 md:py-14 border-b border-line">
          <Container className="text-center max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-burgundy" />
              <span>Chickie Studio Camera Rental</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-ink">
              Thuê Máy Ảnh & Phụ Kiện Du Lịch Chuyên Nghiệp
            </h1>

            <p className="text-xs md:text-sm text-ink-muted max-w-xl mx-auto leading-relaxed">
              Dịch vụ cho thuê combo máy ảnh Sony, Canon, Fujifilm du lịch chuyên nghiệp kèm pin sạc, túi chống sốc và thẻ nhớ tốc độ cao tại Hà Nội.
            </p>
          </Container>
        </section>

        {/* Main Catalog View with initialType="camera" */}
        <Section className="py-8 md:py-12">
          <Container>
            <ProductCatalogView
              products={products}
              categories={categories}
              initialCategorySlug={currentCategorySlug}
              initialType="camera"
              initialSearch={searchKeyword}
            />
          </Container>
        </Section>
      </div>

      <Footer />
    </div>
  );
}
