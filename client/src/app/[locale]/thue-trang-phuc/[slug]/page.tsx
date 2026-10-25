import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicProductDetail, getPublicProducts } from "@/lib/api/product";
import { ProductDetailView } from "@/components/features/products";

interface CostumeDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CostumeDetailPageProps): Promise<Metadata> {
  const product = await getPublicProductDetail(params.slug);

  if (!product) {
    return {
      title: "Trang Phục Không Tồn Tại | Chickie Studio",
    };
  }

  return {
    title: `${product.name} | Thuê Trang Phục Chickie Studio`,
    description:
      product.description ||
      `Thuê trang phục thiết kế ${product.name} cao cấp, giặt ủi thơm tho, hỗ trợ thử đồ và đổi size tại Chickie Studio.`,
  };
}

export default async function CostumeDetailPage({ params }: CostumeDetailPageProps) {
  const product = await getPublicProductDetail(params.slug);

  if (!product) {
    notFound();
  }

  const relatedResult = await getPublicProducts({
    categoryId: product.categoryId,
    type: "COSTUME",
    size: 4,
  });

  const relatedProducts = relatedResult.content
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      pillarBasePath="/thue-trang-phuc"
    />
  );
}
