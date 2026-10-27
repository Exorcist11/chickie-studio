package com.chickiestudio.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarDispatchResponse {

    private LocalDate startDate;
    private LocalDate endDate;
    private int totalBookings;

    @Builder.Default
    private List<CalendarBookingDto> bookings = new ArrayList<>();
}
