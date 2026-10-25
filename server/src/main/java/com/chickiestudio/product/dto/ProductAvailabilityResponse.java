package com.chickiestudio.product.dto;

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
public class ProductAvailabilityResponse {
    private Long productId;
    private String slug;
    private String productName;
    private Long variantId;
    private String variantName;
    private String month; // YYYY-MM
    private int totalItems;
    private int availableItems;
    private int bufferDays;
    private List<DayAvailabilityDto> days;
}
