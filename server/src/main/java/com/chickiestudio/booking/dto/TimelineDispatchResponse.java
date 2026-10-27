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
public class TimelineDispatchResponse {

    private LocalDate startDate;
    private LocalDate endDate;

    @Builder.Default
    private List<TimelineResourceDto> resources = new ArrayList<>();
}
