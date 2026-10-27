package com.chickiestudio.booking.dto;

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
public class ReassignItemResponse {

    private Long bookingItemId;
    private String bookingCode;
    private String oldBarcode;
    private String newBarcode;
    private String changedBy;
    private LocalDateTime updatedAt;
    private String message;
}
