import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Container,
  Section,
  ProductCard,
  Header,
  Footer,
  EmptyState,
  Button,
} from "@/components/ui";
import { ChevronRight, Sparkles, Shirt, ArrowLeft } from "lucide-react";
import { getPublicCategories } from "@/lib/api/category";
import { getPublicProducts, formatImageUrl } from "@/lib/api/product";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const categories = await getPublicCategories();
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    return {
      title: "Danh Mục Không Tồn Tại | Chickie Studio",
    };
  }

  return {
    title: `${category.name} | Chickie Studio`,
    description:
      category.description ||
      `Thuê ${category.name} cao cấp, form chuẩn chụp ảnh tại Chickie Studio Hà Nội.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categories = await getPublicCategories();
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const productsResult = await getPublicProducts({
    categoryId: category.id,
    size: 24,
  });

  const products = productsResult.content;

  return (
    <div className="min-h-screen bg-warm-white text-ink flex flex-col justify-between">
      <div>
        <Header favoriteCount={0} />

        {/* Breadcrumb & Category Hero */}
        <section className="bg-gradient-to-b from-ivory/80 via-ivory/40 to-warm-white py-10 md:py-14 border-b border-line">
          <Container className="space-y-4">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-ink-muted"
            >
              <Link href="/" className="hover:text-burgundy transition-colors">
                Trang chủ
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
              <Link href="/products" className="hover:text-burgundy transition-colors">
                Bộ sưu tập
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
              <span className="text-ink font-medium">{category.name}</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-burgundy" />
                <span>Danh Mục Chickie Studio</span>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl font-semibold text-ink">
                {category.name}
              </h1>

              {category.description && (
                <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
          </Container>
        </section>

        {/* Products Listing */}
        <Section className="py-10">
          <Container className="space-y-8">
            <div className="flex items-center justify-between text-xs text-ink-muted pb-4 border-b border-line">
              <span>
                Hiển thị <strong className="text-ink">{products.length}</strong> mẫu thiết kế
              </span>
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-burgundy hover:underline font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Xem tất cả danh mục
              </Link>
            </div>

            {products.length === 0 ? (
              <EmptyState
                icon={<Shirt className="w-7 h-7 stroke-[1.5]" />}
                title="Danh mục đang được cập nhật thêm mẫu mới"
                description="Các mẫu thiết kế mới cho danh mục này đang trong quá trình giặt ủi và hoàn thiện lookbook."
                action={
                  <Link href="/products">
                    <Button variant="secondary" size="sm">
                      Khám phá danh mục khác
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    imageUrl={formatImageUrl(p.thumbnailUrl)}
                    price={p.rentalPrice}
                    rating={5.0}
                    reviewCount={28}
                    colors={[
                      { name: "Tiêu chuẩn", hex: "#641D2B" },
                      { name: "Trắng", hex: "#FFFFFF" },
                    ]}
                  />
                ))}
              </div>
            )}
          </Container>
        </Section>
      </div>

      <Footer />
    </div>
  );
}
