package com.chickiestudio.product.service;

import com.chickiestudio.product.dto.CreateProductRequest;
import com.chickiestudio.product.dto.ProductDetailResponse;
import com.chickiestudio.product.dto.ProductListResponse;
import com.chickiestudio.product.dto.UpdateProductRequest;
import com.chickiestudio.product.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    ProductDetailResponse createProduct(CreateProductRequest request);

    ProductDetailResponse updateProduct(Long id, UpdateProductRequest request);

    ProductDetailResponse getProductById(Long id);

    ProductDetailResponse getProductBySlug(String slug);

    Page<ProductListResponse> getProductsForAdmin(
            Long categoryId,
            ProductStatus status,
            String search,
            Pageable pageable
    );

    void deleteProduct(Long id);
}
