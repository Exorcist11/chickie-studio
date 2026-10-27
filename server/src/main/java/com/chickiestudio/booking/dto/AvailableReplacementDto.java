package com.chickiestudio.booking.dto;

import com.chickiestudio.product.entity.ProductItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailableReplacementDto {

    private Long itemId;
    private String barcode;
    private String productName;
    private String variantInfo;
    private ProductItemStatus itemStatus;
    private int rentalCount;
    private String note;
    private boolean isCurrent;
    private boolean isAvailable;
}
