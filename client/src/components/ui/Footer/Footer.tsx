import * as React from "react";
import Link from "next/link";
import { Phone, MessageCircle, Facebook, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "../Logo";
import { Container } from "../Container";

export interface FooterProps {
  hotline?: string;
  address?: string;
  zaloUrl?: string;
  facebookUrl?: string;
  tagline?: string;
  copyright?: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  hotline = "0987.654.321",
  address = "Số 12 ngõ 80 Chùa Láng, Đống Đa, Hà Nội",
  zaloUrl = "https://zalo.me",
  facebookUrl = "https://facebook.com",
  tagline = "More than just a dress",
  copyright = "© 2026 Chickie Studio. All rights reserved.",
  className,
}) => {
  return (
    <footer className={cn("w-full bg-ink text-warm-white py-12 md:py-16 text-left", className)}>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-12 border-b border-rose/20">
          {/* Brand info */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <Logo variant="mono" href="/" showTagline={false} />
            <p className="font-serif italic text-rose/90 text-sm mt-1">
              {tagline}
            </p>
            <p className="text-xs text-rose/70 leading-relaxed mt-2">
              Dịch vụ cho thuê váy thiết kế, áo dài kỷ yếu và combo máy ảnh chụp ảnh ngoại cảnh hàng đầu tại Hà Nội.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-base font-medium text-warm-white">Dịch vụ</h4>
            <ul className="flex flex-col gap-2 text-sm text-rose/80">
              <li>
                <Link href="/products" className="hover:text-warm-white transition-colors">
                  Cho thuê váy thiết kế
                </Link>
              </li>
              <li>
                <Link href="/cameras" className="hover:text-warm-white transition-colors">
                  Cho thuê máy ảnh du lịch
                </Link>
              </li>
              <li>
                <Link href="/combos" className="hover:text-warm-white transition-colors">
                  Combo váy & máy ảnh
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-warm-white transition-colors">
                  Gói chụp ảnh kỷ yếu
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & FAQ */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-base font-medium text-warm-white">Chính sách</h4>
            <ul className="flex flex-col gap-2 text-sm text-rose/80">
              <li>
                <Link href="/chinh-sach-thue-do" className="hover:text-warm-white transition-colors">
                  Chính sách đặt cọc & trả đồ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-warm-white transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/tra-cuu-don" className="hover:text-warm-white transition-colors">
                  Tra cứu đơn thuê online
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="hover:text-warm-white transition-colors">
                  Về Chickie Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Fast Channels */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-base font-medium text-warm-white">Liên hệ nhanh</h4>
            <div className="flex flex-col gap-2.5 text-sm text-rose/80">
              <a
                href={`tel:${hotline.replace(/\./g, "")}`}
                className="flex items-center gap-2 hover:text-warm-white transition-colors"
              >
                <Phone className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                <span>Hotline: {hotline}</span>
              </a>

              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-warm-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                <span>Nhắn tin Zalo tư vấn</span>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-warm-white transition-colors"
              >
                <Facebook className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                <span>Fanpage Facebook</span>
              </a>

              <div className="flex items-start gap-2 pt-1 text-xs text-rose/70">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" aria-hidden="true" />
                <span>{address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-rose/60 gap-3">
          <p>{copyright}</p>
          <p className="font-serif italic text-gold">Designed for Chickie Studio</p>
        </div>
      </Container>
    </footer>
  );
};
