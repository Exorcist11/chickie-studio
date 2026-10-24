package com.chickiestudio.product.controller;

import com.chickiestudio.common.dto.ApiResponse;
import com.chickiestudio.product.dto.ProductDetailResponse;
import com.chickiestudio.product.dto.ProductListResponse;
import com.chickiestudio.product.entity.ProductStatus;
import com.chickiestudio.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductListResponse>>> getActiveProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ProductListResponse> page = productService.getProductsForAdmin(
                categoryId,
                ProductStatus.ACTIVE,
                search,
                pageable
        );
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/{idOrSlug}")
    public ResponseEntity<ApiResponse<ProductDetailResponse>> getProductDetails(@PathVariable String idOrSlug) {
        ProductDetailResponse response;
        if (idOrSlug.matches("^\\d+$")) {
            response = productService.getProductById(Long.parseLong(idOrSlug));
        } else {
            response = productService.getProductBySlug(idOrSlug);
        }
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
