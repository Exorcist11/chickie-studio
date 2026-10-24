"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button, Container } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface LookbookSpotlightProps {
  className?: string;
}

export const LookbookSpotlight: React.FC<LookbookSpotlightProps> = ({ className }) => {
  return (
    <section className={cn("py-10 md:py-14 bg-warm-white", className)}>
      <Container>
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#22161A] via-[#2D1B22] to-[#1B1216] text-white border border-line/30 shadow-raised">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center min-h-[320px] md:min-h-[380px]">
            {/* Left Content Column */}
            <div className="md:col-span-6 p-8 md:p-12 space-y-5 z-10 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Xu Hướng Mới Nhất</span>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-warm-white">
                  Bộ sưu tập mới
                </h2>
                <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md">
                  Những thiết kế thời trang hot nhất hiện nay, chất vải tơ lụa mềm mại sẵn sàng cho mọi bữa tiệc và buổi chụp hình.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-5 sm:gap-6">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-burgundy hover:bg-burgundy/90 text-warm-white text-xs sm:text-sm font-medium tracking-wide shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-white"
                >
                  Xem ngay <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Slide indicator 01 / 04 */}
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <span className="font-bold text-white">01</span>
                  <span>/</span>
                  <span>04</span>
                  <div className="flex gap-1 ml-2">
                    <span className="w-6 h-1 rounded-full bg-burgundy inline-block" />
                    <span className="w-2 h-1 rounded-full bg-white/30 inline-block" />
                    <span className="w-2 h-1 rounded-full bg-white/30 inline-block" />
                    <span className="w-2 h-1 rounded-full bg-white/30 inline-block" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Fashion Model Image Column */}
            <div className="md:col-span-6 relative h-64 md:h-full min-h-[280px] md:min-h-[380px]">
              <Image
                src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&auto=format&fit=crop"
                alt="Người mẫu diện đầm dạ hội sang trọng Chickie Studio"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top opacity-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#22161A] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
