import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  href: string;
  icon?: React.ReactNode;
  actionText?: string;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  href,
  icon,
  actionText = "Khám phá",
  className,
}) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col bg-warm-white rounded-card overflow-hidden border border-line shadow-card transition-all duration-200 hover:shadow-raised hover:-translate-y-1 text-left",
        className
      )}
    >
      {/* Horizontal Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ivory">
        <Image
          src={imageUrl}
          alt={imageAlt || title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {icon && (
          <div
            className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-rose/90 backdrop-blur-xs text-ink flex items-center justify-center shadow-xs"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-medium text-ink group-hover:text-burgundy transition-colors">
            {title}
          </h3>
          <p className="text-sm text-ink-muted line-clamp-2 mt-1">
            {description}
          </p>
        </div>

        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-burgundy hover:underline underline-offset-4 group/link"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};
