package com.chickiestudio.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingItemResponse {
    private Long id;
    private Long productItemId;
    private String productItemCode;
    private Long variantId;
    private String productName;
    private String variantSize;
    private String variantColor;
    private LocalDate rentalStartDate;
    private LocalDate rentalEndDate;
    private BigDecimal rentalPrice;
    private BigDecimal depositPrice;
}
