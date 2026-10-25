package com.chickiestudio.content.dto;

import com.chickiestudio.category.dto.CategoryResponse;
import com.chickiestudio.product.dto.ProductListResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeFeaturedResponse {
    private List<HeroBannerDto> heroBanners;
    private List<CategoryResponse> categories;
    private List<ProductListResponse> topProducts;
    private List<FeaturedServiceDto> services;
    private List<RentalStepDto> rentalSteps;
    private List<TestimonialDto> testimonials;
}
