package com.chickiestudio.booking.dto;

import com.chickiestudio.booking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatusHistoryResponse {

    private Long id;
    private BookingStatus fromStatus;
    private BookingStatus toStatus;
    private String action;
    private String changedBy;
    private String note;
    private LocalDateTime createdAt;
}
