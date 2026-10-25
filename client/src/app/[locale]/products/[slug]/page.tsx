import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicProductDetail, getPublicProducts } from "@/lib/api/product";
import {
  ProductDetailView,
  resolveProductPillar,
  PILLAR_CONFIGS,
} from "@/components/features/products";

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

  const pillar = resolveProductPillar(product.type, product.categoryName);
  const pillarConfig = PILLAR_CONFIGS[pillar];

  return {
    title: `${product.name} | Chickie Studio`,
    description:
      product.description ||
      `${pillarConfig.pillarBadgeLabel}: ${product.name} chất lượng cao, phục vụ chụp ảnh kỷ yếu, du lịch, sự kiện tại Chickie Studio.`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getPublicProductDetail(params.slug);

  if (!product) {
    notFound();
  }

  const pillar = resolveProductPillar(product.type, product.categoryName);

  const relatedResult = await getPublicProducts({
    categoryId: product.categoryId,
    type: pillar,
    size: 4,
  });

  const relatedProducts = relatedResult.content
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
