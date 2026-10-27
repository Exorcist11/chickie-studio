package com.chickiestudio.booking.controller;

import com.chickiestudio.booking.dto.AvailableReplacementDto;
import com.chickiestudio.booking.dto.CalendarDispatchResponse;
import com.chickiestudio.booking.dto.ReassignItemRequest;
import com.chickiestudio.booking.dto.ReassignItemResponse;
import com.chickiestudio.booking.dto.RescheduleBookingRequest;
import com.chickiestudio.booking.dto.RescheduleBookingResponse;
import com.chickiestudio.booking.dto.TimelineDispatchResponse;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.service.DispatchService;
import com.chickiestudio.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/dispatch")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminDispatchController {

    private final DispatchService dispatchService;

    /**
     * Lấy dữ liệu đơn thuê cho giao diện Calendar (BOK-006).
     */
    @GetMapping("/calendar")
    public ResponseEntity<ApiResponse<CalendarDispatchResponse>> getCalendarData(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String search
    ) {
        CalendarDispatchResponse response = dispatchService.getCalendarData(startDate, endDate, status, search);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Lấy dữ liệu dòng thời gian Gantt Timeline kho đồ (BOK-006).
     */
    @GetMapping("/timeline")
    public ResponseEntity<ApiResponse<TimelineDispatchResponse>> getTimelineData(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search
    ) {
        TimelineDispatchResponse response = dispatchService.getTimelineData(startDate, endDate, categoryId, search);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Tìm danh sách món đồ cùng biến thể khả dụng để thay thế điều phối (BOK-006).
     */
    @GetMapping("/available-replacements")
    public ResponseEntity<ApiResponse<List<AvailableReplacementDto>>> getAvailableReplacements(
            @RequestParam Long bookingItemId
    ) {
        List<AvailableReplacementDto> replacements = dispatchService.getAvailableReplacements(bookingItemId);
        return ResponseEntity.ok(ApiResponse.success(replacements));
    }

    /**
     * Thực hiện điều phối đổi món đồ vật lý (BOK-006).
     */
    @PostMapping("/reassign-item")
    public ResponseEntity<ApiResponse<ReassignItemResponse>> reassignItem(
            @Valid @RequestBody ReassignItemRequest request,
            Authentication authentication
    ) {
        String username = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "STAFF";

        ReassignItemResponse response = dispatchService.reassignItem(request, username);
        return ResponseEntity.ok(ApiResponse.success("Điều phối đổi món đồ thành công", response));
    }

    /**
     * Dời ngày thuê của đơn hàng (BOK-006).
     */
    @PostMapping("/reschedule")
    public ResponseEntity<ApiResponse<RescheduleBookingResponse>> rescheduleBooking(
            @Valid @RequestBody RescheduleBookingRequest request,
            Authentication authentication
    ) {
        String username = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : "STAFF";

        RescheduleBookingResponse response = dispatchService.rescheduleBooking(request, username);
        return ResponseEntity.ok(ApiResponse.success("Dời ngày thuê thành công", response));
    }
}
