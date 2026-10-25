import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productItemService } from "../../services/productItem.service";
import {
  CreateProductItemInput,
  ProductItem,
  UpdateProductItemStatusInput,
} from "../../types/productItem";
import { productItemKeys } from "./productItemKeys";

export function useProductItemsByProduct(productId: number | undefined, enabled = true) {
  return useQuery<ProductItem[]>({
    queryKey: productItemKeys.byProduct(productId || 0),
    queryFn: () => productItemService.getItemsByProduct(productId!),
    enabled: enabled && !!productId,
  });
}

export function useProductItemsByVariant(variantId: number | undefined, enabled = true) {
  return useQuery<ProductItem[]>({
    queryKey: productItemKeys.byVariant(variantId || 0),
    queryFn: () => productItemService.getItemsByVariant(variantId!),
    enabled: enabled && !!variantId,
  });
}

export function useCreateProductItemMutation(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantId, input }: { variantId: number; input: CreateProductItemInput }) =>
      productItemService.createItem(variantId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productItemKeys.byProduct(productId) });
      queryClient.invalidateQueries({ queryKey: productItemKeys.all });
    },
  });
}

export function useUpdateProductItemStatusMutation(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateProductItemStatusInput }) =>
      productItemService.updateItemStatus(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productItemKeys.byProduct(productId) });
      queryClient.invalidateQueries({ queryKey: productItemKeys.all });
    },
  });
}

export function useDeleteProductItemMutation(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productItemService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productItemKeys.byProduct(productId) });
      queryClient.invalidateQueries({ queryKey: productItemKeys.all });
    },
  });
}
