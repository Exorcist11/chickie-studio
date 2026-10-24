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
    search?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
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
        <Header favoriteCount={0} />

        {/* Page Banner (Matching Mockup & E2E) */}
        <section className="relative overflow-hidden bg-gradient-to-b from-ivory/80 via-ivory/40 to-warm-white py-10 md:py-14 border-b border-line">
          <Container className="text-center max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-burgundy" />
              <span>Chickie Studio Lookbook</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-ink">
              Thuê Trang Phục & Thiết Bị
            </h1>

            <p className="text-xs md:text-sm text-ink-muted max-w-xl mx-auto leading-relaxed">
              Khám phá bộ sưu tập thời trang phong phú và đa dạng phong cách, từ đầm dạ hội sang trọng đến áo dài truyền thống cách tân.
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
              initialSearch={searchKeyword}
            />
          </Container>
        </Section>
      </div>

      <Footer />
    </div>
  );
}
