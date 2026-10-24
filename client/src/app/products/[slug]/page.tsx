import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Container,
  Section,
  SectionHeading,
  ProductCard,
  Header,
  Footer,
  Rating,
  Badge,
} from "@/components/ui";
import {
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkle,
  CheckCircle,
} from "lucide-react";
import { getPublicProductDetail, getPublicProducts, formatImageUrl } from "@/lib/api/product";
import { LookbookGallery } from "@/components/features/products/LookbookGallery";
import { BookingForm } from "@/components/features/products/BookingForm";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const product = await getPublicProductDetail(params.slug);

  if (!product) {
    return {
      title: "Sản Phẩm Không Tồn Tại | Chickie Studio",
    };
  }

  return {
    title: `${product.name} | Chickie Studio`,
    description:
      product.description ||
      `Thuê ${product.name} chất liệu cao cấp, chụp ảnh kỷ yếu, sự kiện tiệc tối tại Chickie Studio.`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getPublicProductDetail(params.slug);

  if (!product) {
    notFound();
  }

  // Related products from same category or general
  const relatedResult = await getPublicProducts({
    categoryId: product.categoryId,
    size: 4,
  });

  const relatedProducts = relatedResult.content.filter((p) => p.slug !== product.slug).slice(0, 3);

  const formattedPrice = new Intl.NumberFormat("vi-VN").format(product.rentalPrice);
  const formattedDeposit = new Intl.NumberFormat("vi-VN").format(product.depositPrice);

  return (
    <div className="min-h-screen bg-warm-white text-ink flex flex-col justify-between">
      <div>
        <Header favoriteCount={0} />

        {/* Breadcrumbs */}
        <div className="bg-ivory/50 border-b border-line py-3.5">
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-ink-muted overflow-x-auto no-scrollbar"
            >
              <Link href="/" className="hover:text-burgundy transition-colors whitespace-nowrap">
                Trang chủ
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-ink-muted shrink-0" />
              <Link href="/products" className="hover:text-burgundy transition-colors whitespace-nowrap">
                Bộ sưu tập
              </Link>
              {product.categoryName && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                  <span className="text-ink-muted whitespace-nowrap">{product.categoryName}</span>
                </>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-ink-muted shrink-0" />
              <span className="text-ink font-medium truncate max-w-[200px] sm:max-w-none">
                {product.name}
              </span>
            </nav>
          </Container>
        </div>

        {/* Main Product Layout */}
        <Section className="py-8 md:py-12">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Lookbook Gallery (5/12 cols) */}
              <div className="lg:col-span-6 xl:col-span-5 lg:sticky lg:top-24">
                <LookbookGallery
                  productName={product.name}
                  images={product.images}
                />
              </div>

              {/* Right Column: Product Info & Booking Form (7/12 cols) */}
              <div className="lg:col-span-6 xl:col-span-7 space-y-6">
                {/* Header Information */}
                <div className="space-y-3 pb-6 border-b border-line">
                  <div className="flex flex-wrap items-center gap-2">
                    {product.categoryName && (
                      <Badge variant="primary">
                        {product.categoryName}
                      </Badge>
                    )}
                    <span className="text-xs font-mono text-ink-muted">
                      MÃ: {product.productCode}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-success font-medium ml-auto">
                      <CheckCircle className="w-3.5 h-3.5" /> Sẵn sàng cho thuê
                    </span>
                  </div>

                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-ink leading-tight">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-3">
                    <Rating score={5.0} reviewCount={48} showCount={true} size="sm" />
                    <span className="text-ink-muted text-xs">•</span>
                    <span className="text-xs text-ink-muted">Hơn 120+ lượt thuê thành công</span>
                  </div>

                  {/* Price Block */}
                  <div className="pt-2 flex flex-wrap items-baseline gap-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-burgundy">{formattedPrice}đ</span>
                      <span className="text-sm text-ink-muted">/ngày</span>
                    </div>

                    <div className="text-xs text-ink-muted bg-ivory px-3 py-1.5 rounded-full border border-line">
                      Tiền cọc: <strong className="text-ink">{formattedDeposit}đ</strong> (Hoàn 100% khi trả đồ)
                    </div>
                  </div>
                </div>

                {/* Highlights / Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {product.material && (
                    <div className="p-3.5 rounded-xl bg-ivory/50 border border-line space-y-1">
                      <span className="text-ink-muted font-medium block">Chất liệu cao cấp:</span>
                      <span className="font-medium text-ink">{product.material}</span>
                    </div>
                  )}

                  {product.occasion && (
                    <div className="p-3.5 rounded-xl bg-ivory/50 border border-line space-y-1">
                      <span className="text-ink-muted font-medium block">Dịp phù hợp:</span>
                      <span className="font-medium text-ink">{product.occasion}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div className="space-y-2 text-xs sm:text-sm text-ink-muted leading-relaxed">
                    <h3 className="font-semibold text-ink text-sm">Mô tả thiết kế</h3>
                    <p>{product.description}</p>
                  </div>
                )}

                {/* Integrated Booking Form */}
                <div className="pt-2">
                  <BookingForm
                    productId={product.id}
                    productName={product.name}
                    rentalPrice={product.rentalPrice}
                    depositPrice={product.depositPrice}
                    variants={product.variants}
                  />
                </div>

                {/* Studio Guarantees */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-line text-xs">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-line">
                    <Sparkle className="w-4 h-4 text-burgundy shrink-0" />
                    <span className="text-ink-muted font-medium">Giặt hấp tiệt trùng trước khi giao</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-line">
                    <Truck className="w-4 h-4 text-burgundy shrink-0" />
                    <span className="text-ink-muted font-medium">Giao hỏa tốc nội thành Hà Nội</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-line">
                    <RotateCcw className="w-4 h-4 text-burgundy shrink-0" />
                    <span className="text-ink-muted font-medium">Hỗ trợ đổi size trong ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Similar Products Section */}
        {relatedProducts.length > 0 && (
          <Section className="bg-ivory/30 border-t border-line py-12">
            <Container className="space-y-8">
              <SectionHeading
                title="Mẫu Thiết Kế Tương Tự"
                description="Khám phá thêm các mẫu váy và combo chụp ảnh cùng phong cách"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    imageUrl={formatImageUrl(p.thumbnailUrl)}
                    price={p.rentalPrice}
                    rating={5.0}
                    reviewCount={32}
                    colors={[
                      { name: "Tiêu chuẩn", hex: "#641D2B" },
                      { name: "Trắng", hex: "#FFFFFF" },
                    ]}
                  />
                ))}
              </div>
            </Container>
          </Section>
        )}
      </div>

      <Footer />
    </div>
  );
}
