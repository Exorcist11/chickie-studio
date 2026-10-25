package com.chickiestudio.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayAvailabilityDto {
    private LocalDate date;
    private boolean available;
    private int remainingCount;
    private String reason; // "AVAILABLE", "FULLY_BOOKED", "MAINTENANCE", "PAST_DATE"
}
