package com.chickiestudio.booking.dto;

import com.chickiestudio.booking.entity.BookingStatus;
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
public class TimelineEventDto {

    private Long bookingId;
    private Long bookingItemId;
    private String bookingCode;
    private String customerName;
    private String customerPhone;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate bufferEndDate;
    private int bufferDays;
    private BookingStatus status;
    private BigDecimal rentalPrice;
    private BigDecimal depositPrice;
}
