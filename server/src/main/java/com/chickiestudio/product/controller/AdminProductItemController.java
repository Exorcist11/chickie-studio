package com.chickiestudio.product.controller;

import com.chickiestudio.common.dto.ApiResponse;
import com.chickiestudio.product.dto.CreateItemRequest;
import com.chickiestudio.product.dto.ProductItemResponse;
import com.chickiestudio.product.dto.UpdateItemStatusRequest;
import com.chickiestudio.product.service.ProductItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Controller quản lý món đồ vật lý (Item Instance) và vòng đời trạng thái (CAT-003).
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminProductItemController {

    private final ProductItemService productItemService;

    @GetMapping("/products/{productId}/items")
    public ResponseEntity<ApiResponse<List<ProductItemResponse>>> getItemsByProduct(
            @PathVariable Long productId
    ) {
        List<ProductItemResponse> items = productItemService.getItemsByProduct(productId);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/product-variants/{variantId}/items")
    public ResponseEntity<ApiResponse<List<ProductItemResponse>>> getItemsByVariant(
            @PathVariable Long variantId
    ) {
        List<ProductItemResponse> items = productItemService.getItemsByVariant(variantId);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/product-variants/{variantId}/suggest-code")
    public ResponseEntity<ApiResponse<Map<String, String>>> suggestItemCode(
            @PathVariable Long variantId
    ) {
        String suggestedCode = productItemService.generateItemCode(variantId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("suggestedCode", suggestedCode)));
    }

    @GetMapping("/product-items/{id}")
    public ResponseEntity<ApiResponse<ProductItemResponse>> getItemById(
            @PathVariable Long id
    ) {
        ProductItemResponse item = productItemService.getItemById(id);
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @PostMapping("/product-variants/{variantId}/items")
    public ResponseEntity<ApiResponse<ProductItemResponse>> createItem(
            @PathVariable Long variantId,
            @Valid @RequestBody(required = false) CreateItemRequest request
    ) {
        ProductItemResponse created = productItemService.createItem(variantId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm món đồ vật lý vào kho thành công", created));
    }

    @PatchMapping("/product-items/{id}/status")
    public ResponseEntity<ApiResponse<ProductItemResponse>> updateItemStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateItemStatusRequest request
    ) {
        ProductItemResponse updated = productItemService.updateItemStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái món đồ thành công", updated));
    }

    @DeleteMapping("/product-items/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(
            @PathVariable Long id
    ) {
        productItemService.deleteItem(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa món đồ vật lý khỏi kho thành công", null));
    }
}
