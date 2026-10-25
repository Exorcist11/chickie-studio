package com.chickiestudio.booking.dto;

import com.chickiestudio.booking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingCode;
    private String customerName;
    private String customerPhone;
    private String deliveryMethod;
    private String deliveryAddress;
    private LocalDate rentalStartDate;
    private LocalDate rentalEndDate;
    private Integer durationDays;
    private BookingStatus status;
    private BigDecimal totalRentalPrice;
    private BigDecimal totalDepositPrice;
    private BigDecimal totalAmount;
    private String note;
    private LocalDateTime createdAt;

    @Builder.Default
    private List<BookingItemResponse> items = new ArrayList<>();

    @Builder.Default
    private List<BookingStatusHistoryResponse> statusHistories = new ArrayList<>();

    @Builder.Default
    private List<BookingStatus> nextValidStatuses = new ArrayList<>();
}
