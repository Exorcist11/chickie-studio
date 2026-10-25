package com.chickiestudio.product.service;

import com.chickiestudio.product.dto.CreateItemRequest;
import com.chickiestudio.product.dto.ProductItemResponse;
import com.chickiestudio.product.dto.UpdateItemStatusRequest;

import java.util.List;

public interface ProductItemService {

    List<ProductItemResponse> getItemsByProduct(Long productId);

    List<ProductItemResponse> getItemsByVariant(Long variantId);

    ProductItemResponse getItemById(Long id);

    ProductItemResponse getItemByCode(String itemCode);

    ProductItemResponse createItem(Long variantId, CreateItemRequest request);

    ProductItemResponse updateItemStatus(Long id, UpdateItemStatusRequest request);

    void deleteItem(Long id);

    String generateItemCode(Long variantId);
}
