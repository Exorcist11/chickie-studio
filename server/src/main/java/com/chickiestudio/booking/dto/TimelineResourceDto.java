package com.chickiestudio.booking.dto;

import com.chickiestudio.category.entity.CategoryType;
import com.chickiestudio.product.entity.ProductItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelineResourceDto {

    private Long itemId;
    private String barcode;
    private String productName;
    private String variantInfo;
    private CategoryType categoryType;
    private ProductItemStatus itemStatus;

    @Builder.Default
    private List<TimelineEventDto> events = new ArrayList<>();
}
