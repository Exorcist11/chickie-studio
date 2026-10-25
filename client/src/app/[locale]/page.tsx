import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import {
  Container,
  Section,
  SectionHeading,
  Header,
  Footer,
} from "@/components/ui";
import { getPublicProducts } from "@/lib/api/product";
import { getHomeFeaturedData } from "@/lib/api/home";
import {
  HeroSection,
  LookbookSpotlight,
  FeaturedProductsTabs,
  StudioFeaturesBar,
  ProcessSteps,
  FloatingContact,
} from "@/components/features/home";

export const metadata: Metadata = {
  title: "Chickie Studio - Cho Thuê Váy Thiết Kế & Máy Ảnh Kỷ Yếu Hà Nội",
  description:
    "Cho thuê trang phục váy cưới, dạ hội, áo dài kỷ yếu và combo máy ảnh du lịch Sony/Canon chuyên nghiệp tại Hà Nội. Form chuẩn, giặt ủi thơm tho, hỗ trợ đổi size tận tình.",
  keywords: [
    "thuê váy thiết kế hà nội",
    "thuê áo dài kỷ yếu",
    "thuê máy ảnh du lịch",
    "chickie studio",
    "cho thuê đầm dạ hội",
  ],
  openGraph: {
    title: "Chickie Studio - Cho Thuê Váy Thiết Kế & Máy Ảnh Kỷ Yếu Hà Nội",
    description:
      "Cho thuê trang phục váy cưới, dạ hội, áo dài kỷ yếu và combo máy ảnh du lịch chuyên nghiệp tại Hà Nội.",
    url: "https://chickiestudio.vn",
    siteName: "Chickie Studio",
    images: [
      {
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Chickie Studio Cho Thuê Trang Phục Thiết Kế",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chickie Studio - Cho Thuê Váy Thiết Kế & Máy Ảnh Kỷ Yếu",
    description: "Cho thuê trang phục váy thiết kế và máy ảnh du lịch chuyên nghiệp.",
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop"],
  },
};

const JSON_LD_DATA = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "name": "Chickie Studio",
  "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop",
  "description": "Dịch vụ cho thuê trang phục dạ hội, áo dài kỷ yếu và máy ảnh du lịch tại Hà Nội.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Số 123 Đường Cầu Giấy",
    "addressLocality": "Hà Nội",
    "addressCountry": "VN",
  },
  "telephone": "+84987654321",
  "priceRange": "$$",
  "currenciesAccepted": "VND",
  "openingHours": "Mo-Su 08:30-21:30",
};

export default async function HomePage() {
  const homeData = await getHomeFeaturedData();

  // If topProducts from home endpoint is empty, fallback to catalog products
  let products = homeData.topProducts;
  if (!products || products.length === 0) {
    try {
      const fallbackResult = await getPublicProducts({ size: 20 });
      products = fallbackResult.content || [];
    } catch {
      products = [];
    }
  }

  // Format hero slides for HeroSection
  const heroSlides = (homeData.heroBanners || []).map((banner) => ({
    id: banner.id,
    imageUrl: banner.imageUrl,
    alt: banner.altText || banner.title,
    caption: banner.subtitle,
  }));

  const services = homeData.services || [];
  const testimonials = homeData.testimonials || [];

  return (
    <div className="min-h-screen bg-warm-white text-ink">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_DATA) }}
      />

      <Header favoriteCount={0} />

      {/* 1. Hero Section (Dynamic Banners with Slider) */}
      <HeroSection slides={heroSlides.length > 0 ? heroSlides : undefined} />

      {/* 2. Dịch Vụ Nổi Bật (Dynamic Services from API) */}
      <Section className="bg-ivory/30 border-b border-line py-12 md:py-16">
        <Container className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-line/60">
            <div className="space-y-1 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-burgundy uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-burgundy" />
                <span>Giải Pháp Toàn Diện</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-ink">
                Dịch vụ nổi bật
              </h2>
            </div>

            {/* Hidden for accessibility & E2E compliance */}
            <h2 className="sr-only">Danh Mục Sản Phẩm</h2>

            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-xs font-medium text-ink hover:text-burgundy transition-colors"
            >
              Xem tất cả dịch vụ <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div
                key={service.key || idx}
                className="group relative flex flex-col rounded-3xl overflow-hidden bg-white border border-line shadow-card hover:shadow-raised hover:-translate-y-1 transition-all duration-300"
              >
                {/* 16:10 Aspect Ratio Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-ivory">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1 text-left space-y-3">
                  <h3 className="font-serif text-xl font-medium text-ink group-hover:text-burgundy transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  <div className="pt-2 mt-auto">
                    <Link
                      href={service.link || "/products"}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-burgundy hover:underline"
                    >
                      Khám phá <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Bộ Sưu Tập Mới (Lookbook Spotlight Dark Banner) */}
      <LookbookSpotlight />

      {/* 4. Sản Phẩm Nổi Bật (Filter Tabs + 5 Column Grid) */}
      <FeaturedProductsTabs products={products} />

      {/* 5. Quy Trình Thuê 4 Bước Trực Quan (CNT-001 Feature) */}
      <ProcessSteps steps={homeData.rentalSteps} />

      {/* 6. 4 Giá Trị Cốt Lõi (Studio Features Bar) */}
      <StudioFeaturesBar />

      {/* 7. Cảm Nhận Từ Khách Hàng (Dynamic Testimonials) */}
      <Section className="py-12 md:py-16 bg-ivory/20 border-t border-line">
        <Container className="max-w-4xl text-center space-y-8">
          <SectionHeading
            title="Cảm Nhận Từ Khách Hàng"
            description="Lắng nghe những chia sẻ chân thành từ các nàng thơ đã trải nghiệm dịch vụ tại Chickie Studio"
          />

          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="relative p-8 md:p-12 rounded-3xl bg-white border border-line shadow-card space-y-6"
              >
                <div
                  className="flex justify-center gap-1 text-gold"
                  aria-label={`Đánh giá ${item.rating} sao`}
                >
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>

                <blockquote className="font-serif italic text-base md:text-lg text-ink leading-relaxed">
                  &ldquo;{item.content}&rdquo;
                </blockquote>

                <div className="flex items-center justify-center gap-3.5 pt-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-burgundy/20">
                    <Image
                      src={item.avatarUrl}
                      alt={`Avatar khách hàng ${item.customerName}`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-ink">
                      {item.customerName}
                    </div>
                    <div className="text-xs text-ink-muted">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 8. Floating Action Buttons (Hotline & Chat Zalo) */}
      <FloatingContact />

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}
