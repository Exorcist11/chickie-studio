"use client";

import * as React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FloatingContactProps {
  hotline?: string;
  hotlineDisplay?: string;
  zaloUrl?: string;
  className?: string;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({
  hotline = "0987654321",
  hotlineDisplay = "0987.654.321",
  zaloUrl = "https://zalo.me/0987654321",
  className,
}) => {
  return (
    <aside
      aria-label="Kênh hỗ trợ và tư vấn nhanh"
      className={cn(
        "fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none",
        className
      )}
    >
      {/* Hotline Button */}
      <a
        href={`tel:${hotline}`}
        aria-label={`Gọi hotline tư vấn trực tiếp: ${hotlineDisplay}`}
        className="pointer-events-auto group flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full bg-white text-ink border border-line shadow-raised hover:border-burgundy/40 hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
      >
        <div className="w-8 h-8 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center group-hover:bg-burgundy group-hover:text-warm-white transition-colors duration-200">
          <Phone className="w-4 h-4" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[10px] uppercase font-bold text-ink-muted tracking-wider leading-none">
            Hotline
          </div>
          <div className="text-xs font-semibold text-ink leading-tight font-mono">
            {hotlineDisplay}
          </div>
        </div>
      </a>

      {/* Zalo Button */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn tin tư vấn trực tiếp qua Zalo"
        className="pointer-events-auto group flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full bg-burgundy text-warm-white border border-burgundy shadow-raised hover:bg-burgundy/90 hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
      >
        <div className="w-8 h-8 rounded-full bg-warm-white/20 flex items-center justify-center text-warm-white group-hover:scale-110 transition-transform duration-200">
          <MessageCircle className="w-4 h-4" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[10px] uppercase font-bold text-warm-white/80 tracking-wider leading-none">
            Hỗ trợ 24/7
          </div>
          <div className="text-xs font-semibold text-warm-white leading-tight">
            Chat qua Zalo
          </div>
        </div>
      </a>
    </aside>
  );
};
