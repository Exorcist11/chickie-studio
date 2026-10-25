import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicProductDetail, getPublicProducts } from "@/lib/api/product";
import { ProductDetailView } from "@/components/features/products";

interface CameraDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CameraDetailPageProps): Promise<Metadata> {
  const product = await getPublicProductDetail(params.slug);

  if (!product) {
    return {
      title: "Thiết Bị Không Tồn Tại | Chickie Studio",
    };
  }

  return {
    title: `${product.name} | Thuê Máy Ảnh Chickie Studio`,
    description:
      product.description ||
      `Thuê máy ảnh ${product.name} chính hãng, test kỹ 100%, đầy đủ 2 pin, sạc và thẻ nhớ tốc độ cao tại Chickie Studio.`,
  };
}

export default async function CameraDetailPage({ params }: CameraDetailPageProps) {
  const product = await getPublicProductDetail(params.slug);

  if (!product) {
    notFound();
  }

  const relatedResult = await getPublicProducts({
    categoryId: product.categoryId,
    type: "CAMERA",
    size: 4,
  });

  const relatedProducts = relatedResult.content
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      pillarBasePath="/thue-may-anh"
    />
  );
}
