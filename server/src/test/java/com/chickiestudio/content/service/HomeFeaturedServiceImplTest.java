package com.chickiestudio.content.service;

import com.chickiestudio.category.dto.CategoryResponse;
import com.chickiestudio.category.entity.CategoryType;
import com.chickiestudio.category.service.CategoryService;
import com.chickiestudio.content.dto.HomeFeaturedResponse;
import com.chickiestudio.content.service.impl.HomeFeaturedServiceImpl;
import com.chickiestudio.product.dto.ProductListResponse;
import com.chickiestudio.product.entity.ProductStatus;
import com.chickiestudio.product.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HomeFeaturedServiceImplTest {

    @Mock
    private CategoryService categoryService;

    @Mock
    private ProductService productService;

    @InjectMocks
    private HomeFeaturedServiceImpl homeFeaturedService;

    @Test
    @DisplayName("getHomeFeaturedData - Lấy dữ liệu tổng hợp trang chủ thành công")
    void getHomeFeaturedData_Success() {
        // Given
        CategoryResponse cat1 = new CategoryResponse(
                1L,
                "Váy Thiết Kế",
                "vay-thiet-ke",
                CategoryType.COSTUME,
                "Mô tả",
                null,
                1,
                true,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
        when(categoryService.getPublicCategories()).thenReturn(List.of(cat1));

        ProductListResponse prod1 = ProductListResponse.builder()
                .id(10L)
                .name("Váy Trắng Nàng Thơ")
                .slug("vay-trang-nang-tho")
                .rentalPrice(new BigDecimal("250000"))
                .status(ProductStatus.ACTIVE)
                .build();
        when(productService.getProducts(
                isNull(),
                isNull(),
                eq(ProductStatus.ACTIVE),
                isNull(),
                any(PageRequest.class)
        )).thenReturn(new PageImpl<>(List.of(prod1)));

        // When
        HomeFeaturedResponse result = homeFeaturedService.getHomeFeaturedData();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getCategories()).hasSize(1);
        assertThat(result.getCategories().get(0).name()).isEqualTo("Váy Thiết Kế");
        assertThat(result.getTopProducts()).hasSize(1);
        assertThat(result.getTopProducts().get(0).getName()).isEqualTo("Váy Trắng Nàng Thơ");

        // Curated sections check
        assertThat(result.getHeroBanners()).isNotEmpty();
        assertThat(result.getHeroBanners().get(0).getTitle()).isEqualTo("More than just a dress");
        assertThat(result.getServices()).hasSize(3);
        assertThat(result.getRentalSteps()).hasSize(4);
        assertThat(result.getRentalSteps().get(0).getStepNumber()).isEqualTo(1);
        assertThat(result.getTestimonials()).isNotEmpty();

        verify(categoryService).getPublicCategories();
        verify(productService).getProducts(isNull(), isNull(), eq(ProductStatus.ACTIVE), isNull(), any(PageRequest.class));
    }
}
