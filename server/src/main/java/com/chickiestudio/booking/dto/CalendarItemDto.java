package com.chickiestudio.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarItemDto {

    private Long bookingItemId;
    private Long itemId;
    private String barcode;
    private String productName;
    private String variantInfo;
    private BigDecimal rentalPrice;
}
