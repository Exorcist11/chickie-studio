export const productItemKeys = {
  all: ["productItems"] as const,
  byProduct: (productId: number) => [...productItemKeys.all, "product", productId] as const,
  byVariant: (variantId: number) => [...productItemKeys.all, "variant", variantId] as const,
  detail: (id: number) => [...productItemKeys.all, "detail", id] as const,
};
