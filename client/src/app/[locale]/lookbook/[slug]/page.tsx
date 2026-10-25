import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicProductDetail, getPublicProducts } from "@/lib/api/product";
import { ProductDetailView } from "@/components/features/products";

interface LookbookDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: LookbookDetailPageProps): Promise<Metadata> {
  const product = await getPublicProductDetail(params.slug);

  if (!product) {
    return {
      title: "Mẫu Lookbook Không Tồn Tại | Chickie Studio",
    };
  }

  return {
    title: `${product.name} | Lookbook Chickie Studio`,
    description:
      product.description ||
      `Chi tiết thiết kế và hình ảnh lookbook thực tế của ${product.name} tại Chickie Studio.`,
  };
}

export default async function LookbookDetailPage({ params }: LookbookDetailPageProps) {
  const product = await getPublicProductDetail(params.slug);

  if (!product) {
    notFound();
  }

  const relatedResult = await getPublicProducts({
    categoryId: product.categoryId,
    size: 4,
  });

  const relatedProducts = relatedResult.content
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      pillarBasePath="/lookbook"
    />
  );
}
