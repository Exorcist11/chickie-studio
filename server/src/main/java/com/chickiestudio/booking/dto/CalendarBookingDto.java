package com.chickiestudio.booking.dto;

import com.chickiestudio.booking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarBookingDto {

    private Long id;
    private String bookingCode;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private BookingStatus status;
    private LocalDate rentalStartDate;
    private LocalDate rentalEndDate;
    private BigDecimal totalRentalPrice;
    private BigDecimal totalDepositPrice;
    private BigDecimal totalAmount;
    private int itemCount;

    @Builder.Default
    private List<CalendarItemDto> items = new ArrayList<>();
}
