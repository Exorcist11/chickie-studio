"use client";

import * as React from "react";
import { Phone, MessageCircle, Facebook, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "../Logo";
import { Container } from "../Container";
import { LanguageSwitcher } from "../LanguageSwitcher";

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
  tagline,
  copyright,
  className,
}) => {
  const tFooter = useTranslations("footer");

  const effectiveTagline = tagline || tFooter("tagline");
  const effectiveCopyright = copyright || tFooter("copyright");

  return (
    <footer className={cn("w-full bg-ink text-warm-white py-12 md:py-16 text-left", className)}>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-12 border-b border-rose/20">
          {/* Brand info */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <Logo variant="mono" href="/" showTagline={false} />
            <p className="font-serif italic text-rose/90 text-sm mt-1">
              {effectiveTagline}
            </p>
            <p className="text-xs text-rose/70 leading-relaxed mt-2">
              {tFooter("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-base font-medium text-warm-white">
              {tFooter("servicesTitle")}
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-rose/80">
              <li>
                <Link href="/products" className="hover:text-warm-white transition-colors">
                  {tFooter("dressRental")}
                </Link>
              </li>
              <li>
                <Link href="/products?type=camera" className="hover:text-warm-white transition-colors">
                  {tFooter("cameraRental")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-warm-white transition-colors">
                  {tFooter("comboRental")}
                </Link>
              </li>
              <li>
                <Link href="/products?type=photography" className="hover:text-warm-white transition-colors">
                  {tFooter("photoPackage")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & FAQ */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-base font-medium text-warm-white">
              {tFooter("policiesTitle")}
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-rose/80">
              <li>
                <Link href="/chinh-sach-thue-do" className="hover:text-warm-white transition-colors">
                  {tFooter("policyLink")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-warm-white transition-colors">
                  {tFooter("faqLink")}
                </Link>
              </li>
              <li>
                <Link href="/tra-cuu-don" className="hover:text-warm-white transition-colors">
                  {tFooter("trackingLink")}
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="hover:text-warm-white transition-colors">
                  {tFooter("aboutLink")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Fast Channels */}
          <div className="flex flex-col gap-3">
            <h4 className="font-serif text-base font-medium text-warm-white">
              {tFooter("contactTitle")}
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-rose/80">
              <a
                href={`tel:${hotline.replace(/\./g, "")}`}
                className="flex items-center gap-2 hover:text-warm-white transition-colors"
              >
                <Phone className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                <span>{tFooter("hotline")}</span>
              </a>

              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-warm-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                <span>{tFooter("contactZalo")}</span>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-warm-white transition-colors"
              >
                <Facebook className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
                <span>{tFooter("contactFacebook")}</span>
              </a>

              <div className="flex items-start gap-2 pt-1 text-xs text-rose/70">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" aria-hidden="true" />
                <span>{address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Language Switcher */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-rose/60 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <p>{effectiveCopyright}</p>
            <div className="hidden sm:block h-3.5 w-px bg-rose/20" />
            <LanguageSwitcher variant="compact" />
          </div>
          <p className="font-serif italic text-gold">{tFooter("designedFor")}</p>
        </div>
      </Container>
    </footer>
  );
};
