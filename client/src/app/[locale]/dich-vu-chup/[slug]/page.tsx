import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicProductDetail, getPublicProducts } from "@/lib/api/product";
import { ProductDetailView } from "@/components/features/products";

interface PhotographyDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PhotographyDetailPageProps): Promise<Metadata> {
  const product = await getPublicProductDetail(params.slug);

  if (!product) {
    return {
      title: "Gói Dịch Vụ Không Tồn Tại | Chickie Studio",
    };
  }

  return {
    title: `${product.name} | Dịch Vụ Chụp Ảnh Chickie Studio`,
    description:
      product.description ||
      `Đăng ký gói chụp ảnh ${product.name} trọn gói, photographer chuyên nghiệp hướng dẫn tạo dáng tận tình tại Chickie Studio.`,
  };
}

export default async function PhotographyDetailPage({ params }: PhotographyDetailPageProps) {
  const product = await getPublicProductDetail(params.slug);

  if (!product) {
    notFound();
  }

  const relatedResult = await getPublicProducts({
    categoryId: product.categoryId,
    type: "PHOTOGRAPHY",
    size: 4,
  });

  const relatedProducts = relatedResult.content
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      pillarBasePath="/dich-vu-chup"
    />
  );
}
