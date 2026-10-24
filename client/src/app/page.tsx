import * as React from "react";
import Link from "next/link";
import {
  Button,
  Container,
  Section,
  SectionHeading,
  ProductCard,
  ServiceCard,
  TestimonialCard,
  Header,
  Footer,
} from "@/components/ui";
import { Sparkles, ArrowRight, ShieldCheck, CalendarCheck, Shirt, Camera } from "lucide-react";

export default function HomePage() {
  const featuredProducts = [
    {
      id: "prod-1",
      name: "Đầm maxi voan xòe tiểu thư dáng dài chụp ngoại cảnh",
      slug: "dam-maxi-voan-xoe-tieu-thu",
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
      price: 180000,
      rating: 4.9,
      reviewCount: 52,
      colors: [
        { name: "Trắng Ngọc Trai", hex: "#FFFFFF" },
        { name: "Đỏ Burgundy", hex: "#641D2B" },
      ],
    },
    {
      id: "prod-2",
      name: "Áo dài cách tân hoa sen thêu tay kỷ yếu thanh lịch",
      slug: "ao-dai-cach-tan-hoa-sen",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop",
      price: 220000,
      rating: 5.0,
      reviewCount: 38,
      colors: [
        { name: "Hồng Nude", hex: "#DCC8BD" },
        { name: "Trắng", hex: "#FFFFFF" },
      ],
    },
    {
      id: "prod-3",
      name: "Đầm dạ hội satin trễ vai sang trọng dự tiệc tối",
      slug: "dam-da-hoi-satin-tre-vai",
      imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop",
      price: 250000,
      rating: 4.8,
      reviewCount: 29,
      colors: [
        { name: "Đen Dạ Tiệc", hex: "#302528" },
        { name: "Đỏ Burgundy", hex: "#641D2B" },
      ],
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Chọn Mẫu & Size",
      desc: "Duyệt bộ sưu tập váy thiết kế, áo dài và combo máy ảnh chuẩn gu.",
      icon: Shirt,
    },
    {
      step: "02",
      title: "Đặt Lịch & Cọc",
      desc: "Chọn ngày nhận - ngày trả và đặt cọc nhanh chóng, an tâm giữ lịch.",
      icon: CalendarCheck,
    },
    {
      step: "03",
      title: "Nhận Đồ & Tỏa Sáng",
      desc: "Trang phục sạch sẽ, ủi phẳng phiu sẵn sàng cho buổi chụp kỷ yếu, du lịch.",
      icon: Sparkles,
    },
    {
      step: "04",
      title: "Trả Đồ & Hoàn Cọc",
      desc: "Tiệm nhận lại đồ và hoàn trả tiền cọc ngay lập tức qua số tài khoản.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-warm-white text-ink">
      <Header favoriteCount={0} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory/60 to-warm-white py-16 md:py-24 border-b border-line">
        <Container className="text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-burgundy" />
            <span>Chickie Studio • More than just a dress</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-ink font-semibold tracking-tight leading-tight">
            Tỏa Sáng Trong Mọi <br className="hidden md:inline" />
            <span className="italic font-normal text-burgundy">Khoảnh Khắc</span> Đáng Nhớ
          </h1>

          <p className="text-ink-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Cho thuê váy thiết kế cao cấp, áo dài kỷ yếu và combo máy ảnh Sony/Canon chuyên nghiệp tại Hà Nội. Form chuẩn, vải mềm mại, hỗ trợ đổi size tận tình.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dev/components">
              <Button variant="primary" size="md">
                Khám Phá Bộ Sưu Tập <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/dev/components">
              <Button variant="secondary" size="md">
                Xem Design System UI
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Categories / Services Grid */}
      <Section className="bg-white border-b border-line">
        <Container className="space-y-10">
          <SectionHeading
            title="Dịch Vụ Nổi Bật"
            description="Trang phục thiết kế và thiết bị máy ảnh chất lượng cao phục vụ mọi nhu cầu sống ảo"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceCard
              title="Váy Thiết Kế & Áo Dài Kỷ Yếu"
              description="Hơn 200+ mẫu váy maxi, dạ hội tiểu thư, áo dài truyền thống cách tân form tôn dáng, giặt ủi thơm tho trước khi giao."
              imageUrl="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop"
              href="/dev/components"
            />
            <ServiceCard
              title="Combo Máy Ảnh & Phụ Kiện Sống Ảo"
              description="Thuê máy ảnh du lịch Sony, Canon, Fujifilm kèm thẻ nhớ tốc độ cao, chân máy và hướng dẫn sử dụng cho người mới."
              imageUrl="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop"
              href="/dev/components"
            />
          </div>
        </Container>
      </Section>

      {/* Featured Products */}
      <Section className="bg-warm-white border-b border-line">
        <Container className="space-y-10">
          <SectionHeading
            title="Mẫu Váy Được Thuê Nhiều Nhất"
            description="Những thiết kế best-seller được các nàng thơ yêu thích nhất trong tuần qua"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                imageUrl={p.imageUrl}
                price={p.price}
                rating={p.rating}
                reviewCount={p.reviewCount}
                colors={p.colors}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* 4-Step Process */}
      <Section className="bg-white border-b border-line">
        <Container className="space-y-12">
          <SectionHeading
            title="Quy Trình Thuê Đồ Đơn Giản"
            description="Chỉ với 4 bước nhanh chóng, trang phục xinh xắn sẽ được giao tận tay bạn"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="p-6 rounded-card bg-ivory/50 border border-line relative space-y-3"
                >
                  <div className="w-10 h-10 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center font-bold text-sm">
                    <Icon className="w-5 h-5 text-burgundy" />
                  </div>
                  <div className="text-xs font-mono font-semibold text-burgundy">BƯỚC {st.step}</div>
                  <h3 className="font-serif text-lg font-medium text-ink">{st.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section className="bg-warm-white">
        <Container className="space-y-10">
          <SectionHeading
            title="Cảm Nhận Từ Khách Hàng"
            description="Hơn 1,000+ bức ảnh kỷ yếu lung linh đã được ra đời cùng Chickie Studio"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Váy tại Chickie Studio form siêu chuẩn, chất lụa mềm mại cực kỳ tôn da. Chụp ảnh kỷ yếu ở Hoàng Thành ai cũng hỏi địa chỉ thuê!"
              authorName="Nguyễn Thu Trang"
              authorRole="Sinh viên ĐH Quốc Gia Hà Nội"
              rating={5}
            />
            <TestimonialCard
              quote="Lần đầu thuê combo máy ảnh Canon kèm ống kính chân dung, ảnh chụp nét căng không cần chỉnh sửa nhiều. Chị chủ hướng dẫn rất nhiệt tình."
              authorName="Trần Hoàng Yến"
              authorRole="Khách thuê combo máy ảnh"
              rating={5}
            />
            <TestimonialCard
              quote="Đồ sạch sẽ, thơm phức, đóng gói cẩn thận. Mình đổi size gấp mà tiệm vẫn hỗ trợ ship hỏa tốc ngay trong 1 giờ. Rất hài lòng!"
              authorName="Phạm Mai Linh"
              authorRole="Khách thuê váy dự tiệc"
              rating={5}
            />
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
