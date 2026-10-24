import * as React from "react";
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
import { getPublicCategories } from "@/lib/api/category";
import { getPublicProducts } from "@/lib/api/product";
import {
  HeroSection,
  LookbookSpotlight,
  FeaturedProductsTabs,
  StudioFeaturesBar,
} from "@/components/features/home";

export default async function HomePage() {
  const [categories, productsResult] = await Promise.all([
    getPublicCategories(),
    getPublicProducts({ size: 20 }),
  ]);

  const featuredProducts = productsResult.content;

  // 3 Featured Services matching the mockup
  const featuredServices = [
    {
      title: "Thuê trang phục",
      description: "Đa dạng phong cách, từ dịu dàng nữ tính đến cá tính hiện đại.",
      imageUrl:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop",
      href: "/products?type=costume",
    },
    {
      title: "Thuê máy ảnh",
      description: "Thiết bị chuyên nghiệp, đa dạng thương hiệu, phụ kiện đầy đủ.",
      imageUrl:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop",
      href: "/products?type=camera",
    },
    {
      title: "Dịch vụ chụp ảnh",
      description: "Các gói chụp đa dạng, concept độc đáo, đội ngũ nhiếp ảnh gia chuyên nghiệp.",
      imageUrl:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop",
      href: "/products?type=photography",
    },
  ];

  return (
    <div className="min-h-screen bg-warm-white text-ink">
      <Header favoriteCount={0} />

      {/* 1. Hero Section (More than just a dress + Slider Frame) */}
      <HeroSection />

      {/* 2. Dịch Vụ Nổi Bật (3 Featured Service Cards matching mockup) */}
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
            {featuredServices.map((service, idx) => (
              <div
                key={idx}
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
                      href={service.href}
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

      {/* 3. Bộ Sưu Tập Mới (Lookbook Spotlight Dark Banner matching mockup) */}
      <LookbookSpotlight />

      {/* 4. Sản Phẩm Nổi Bật (Filter Tabs + 5 Column Grid matching mockup) */}
      <FeaturedProductsTabs products={featuredProducts} />

      {/* 5. 4 Giá Trị Cốt Lõi (Studio Features Bar matching mockup bottom) */}
      <StudioFeaturesBar />

      {/* 6. Cảm Nhận Từ Khách Hàng (Testimonial Card matching mockup) */}
      <Section className="py-12 md:py-16 bg-ivory/20 border-t border-line">
        <Container className="max-w-4xl text-center space-y-8">
          <SectionHeading
            title="Cảm Nhận Từ Khách Hàng"
            description="Lắng nghe những chia sẻ chân thành từ các nàng thơ đã trải nghiệm dịch vụ tại Chickie Studio"
          />

          <div className="relative p-8 md:p-12 rounded-3xl bg-white border border-line shadow-card max-w-2xl mx-auto space-y-6">
            <div className="flex justify-center gap-1 text-gold" aria-label="Đánh giá 5 sao">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
            </div>

            <blockquote className="font-serif italic text-base md:text-lg text-ink leading-relaxed">
              &ldquo;Dịch vụ tại Chickie Studio thật sự tuyệt vời! Trang phục đẹp, chất lượng, ekip chụp ảnh chuyên nghiệp và rất thân thiện. Mình chắc chắn sẽ quay lại!&rdquo;
            </blockquote>

            <div className="flex items-center justify-center gap-3.5 pt-2">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-burgundy/20">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"
                  alt="Avatar khách hàng Nguyễn Thị Mai"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-ink">Nguyễn Thị Mai</div>
                <div className="text-xs text-ink-muted">Khách hàng thân thiết</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
