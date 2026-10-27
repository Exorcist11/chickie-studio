package com.chickiestudio.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RescheduleBookingResponse {

    private Long bookingId;
    private String bookingCode;
    private LocalDate newStartDate;
    private LocalDate newEndDate;
    private int durationDays;
    private BigDecimal totalRentalPrice;
    private String changedBy;
    private LocalDateTime updatedAt;
    private String message;
}
