package com.chickiestudio.booking.service;

import com.chickiestudio.booking.dto.AvailableReplacementDto;
import com.chickiestudio.booking.dto.CalendarBookingDto;
import com.chickiestudio.booking.dto.CalendarDispatchResponse;
import com.chickiestudio.booking.dto.CalendarItemDto;
import com.chickiestudio.booking.dto.ReassignItemRequest;
import com.chickiestudio.booking.dto.ReassignItemResponse;
import com.chickiestudio.booking.dto.RescheduleBookingRequest;
import com.chickiestudio.booking.dto.RescheduleBookingResponse;
import com.chickiestudio.booking.dto.TimelineDispatchResponse;
import com.chickiestudio.booking.dto.TimelineEventDto;
import com.chickiestudio.booking.dto.TimelineResourceDto;
import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.booking.entity.BookingItem;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.entity.BookingStatusHistory;
import com.chickiestudio.booking.repository.BookingItemRepository;
import com.chickiestudio.booking.repository.BookingRepository;
import com.chickiestudio.booking.repository.BookingStatusHistoryRepository;
import com.chickiestudio.category.entity.Category;
import com.chickiestudio.category.entity.CategoryType;
import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductItem;
import com.chickiestudio.product.entity.ProductItemStatus;
import com.chickiestudio.product.entity.ProductVariant;
import com.chickiestudio.product.repository.ProductItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class DispatchService {

    private final BookingRepository bookingRepository;
    private final BookingItemRepository bookingItemRepository;
    private final ProductItemRepository productItemRepository;
    private final BookingStatusHistoryRepository bookingStatusHistoryRepository;
    private final BookingService bookingService;

    /**
     * Lấy dữ liệu danh sách đơn thuê dạng Calendar lưới tháng / tuần (BOK-006).
     */
    @Transactional(readOnly = true)
    public CalendarDispatchResponse getCalendarData(LocalDate startDate, LocalDate endDate, BookingStatus status, String search) {
        LocalDate effectiveStart = (startDate != null) ? startDate : LocalDate.now().withDayOfMonth(1);
        LocalDate effectiveEnd = (endDate != null) ? endDate : effectiveStart.plusMonths(1).withDayOfMonth(1).minusDays(1);

        if (effectiveEnd.isBefore(effectiveStart)) {
            throw new BadRequestException("Ngày kết thúc không thể trước ngày bắt đầu");
        }

        String searchKeyword = cleanSearchKeyword(search);

        List<Booking> bookings = bookingRepository.findCalendarBookings(
                effectiveStart, effectiveEnd, status, searchKeyword, BookingStatus.CANCELLED
        );

        List<CalendarBookingDto> dtos = bookings.stream().map(b -> {
            BigDecimal rental = b.getTotalRentalPrice() != null ? b.getTotalRentalPrice() : BigDecimal.ZERO;
            BigDecimal deposit = b.getTotalDepositPrice() != null ? b.getTotalDepositPrice() : BigDecimal.ZERO;
            BigDecimal totalAmount = rental.add(deposit);

            List<CalendarItemDto> itemDtos = new ArrayList<>();
            if (b.getItems() != null) {
                for (BookingItem bi : b.getItems()) {
                    String barcode = (bi.getProductItem() != null) ? bi.getProductItem().getItemCode() : "";
                    String prodName = (bi.getVariant() != null && bi.getVariant().getProduct() != null)
                            ? bi.getVariant().getProduct().getName()
                            : "";
                    String variantInfo = buildVariantInfo(bi.getVariant());

                    itemDtos.add(CalendarItemDto.builder()
                            .bookingItemId(bi.getId())
                            .itemId(bi.getProductItem() != null ? bi.getProductItem().getId() : null)
                            .barcode(barcode)
                            .productName(prodName)
                            .variantInfo(variantInfo)
                            .rentalPrice(bi.getRentalPrice())
                            .build());
                }
            }

            return CalendarBookingDto.builder()
                    .id(b.getId())
                    .bookingCode(b.getBookingCode())
                    .customerName(b.getCustomerName())
                    .customerPhone(b.getCustomerPhone())
                    .customerEmail(b.getCustomerEmail())
                    .status(b.getStatus())
                    .rentalStartDate(b.getRentalStartDate())
                    .rentalEndDate(b.getRentalEndDate())
                    .totalRentalPrice(rental)
                    .totalDepositPrice(deposit)
                    .totalAmount(totalAmount)
                    .itemCount(b.getItems() != null ? b.getItems().size() : 0)
                    .items(itemDtos)
                    .build();
        }).toList();

        return CalendarDispatchResponse.builder()
                .startDate(effectiveStart)
                .endDate(effectiveEnd)
                .totalBookings(dtos.size())
                .bookings(dtos)
                .build();
    }

    /**
     * Lấy dữ liệu dòng thời gian Gantt Timeline kho đồ (BOK-006).
     */
    @Transactional(readOnly = true)
    public TimelineDispatchResponse getTimelineData(LocalDate startDate, LocalDate endDate, Long categoryId, String search) {
        LocalDate effectiveStart = (startDate != null) ? startDate : LocalDate.now().withDayOfMonth(1);
        LocalDate effectiveEnd = (endDate != null) ? endDate : effectiveStart.plusMonths(1).withDayOfMonth(1).minusDays(1);

        if (effectiveEnd.isBefore(effectiveStart)) {
            throw new BadRequestException("Ngày kết thúc không thể trước ngày bắt đầu");
        }

        String searchKeyword = cleanSearchKeyword(search);

        // 1. Lấy danh sách tài nguyên món đồ
        List<ProductItem> resources = productItemRepository.findTimelineResources(categoryId, searchKeyword);

        // 2. Lấy toàn bộ sự kiện thuê trong khoảng thời gian (kèm biên đệm 7 ngày)
        List<BookingItem> timelineBookings = bookingItemRepository.findTimelineEvents(
                effectiveStart.minusDays(7), effectiveEnd.plusDays(7), BookingStatus.CANCELLED
        );

        Map<Long, List<BookingItem>> eventsByItemId = new HashMap<>();
        for (BookingItem bi : timelineBookings) {
            if (bi.getProductItem() != null) {
                eventsByItemId.computeIfAbsent(bi.getProductItem().getId(), k -> new ArrayList<>()).add(bi);
            }
        }

        // 3. Ghép sự kiện vào từng món đồ
        List<TimelineResourceDto> resourceDtos = new ArrayList<>();
        for (ProductItem item : resources) {
            Product product = (item.getVariant() != null) ? item.getVariant().getProduct() : null;
            Category category = (product != null) ? product.getCategory() : null;
            CategoryType categoryType = (category != null && category.getType() != null) ? category.getType() : CategoryType.COSTUME;

            String productName = (product != null) ? product.getName() : "";
            String variantInfo = buildVariantInfo(item.getVariant());
            int bufferDays = bookingService.calculateBufferDays(product);

            List<TimelineEventDto> eventDtos = new ArrayList<>();
            List<BookingItem> itemBookings = eventsByItemId.getOrDefault(item.getId(), Collections.emptyList());

            for (BookingItem bi : itemBookings) {
                LocalDate eventStart = bi.getRentalStartDate();
                LocalDate eventEnd = bi.getRentalEndDate();
                LocalDate bufferEnd = eventEnd.plusDays(bufferDays);

                // Kiểm tra sự kiện có nằm trong phạm vi hiển thị
                if (!eventStart.isAfter(effectiveEnd) && !bufferEnd.isBefore(effectiveStart)) {
                    eventDtos.add(TimelineEventDto.builder()
                            .bookingId(bi.getBooking().getId())
                            .bookingItemId(bi.getId())
                            .bookingCode(bi.getBooking().getBookingCode())
                            .customerName(bi.getBooking().getCustomerName())
                            .customerPhone(bi.getBooking().getCustomerPhone())
                            .startDate(eventStart)
                            .endDate(eventEnd)
                            .bufferEndDate(bufferEnd)
                            .bufferDays(bufferDays)
                            .status(bi.getBooking().getStatus())
                            .rentalPrice(bi.getRentalPrice())
                            .depositPrice(bi.getDepositPrice())
                            .build());
                }
            }

            resourceDtos.add(TimelineResourceDto.builder()
                    .itemId(item.getId())
                    .barcode(item.getItemCode())
                    .productName(productName)
                    .variantInfo(variantInfo)
                    .categoryType(categoryType)
                    .itemStatus(item.getStatus())
                    .events(eventDtos)
                    .build());
        }

        return TimelineDispatchResponse.builder()
                .startDate(effectiveStart)
                .endDate(effectiveEnd)
                .resources(resourceDtos)
                .build();
    }

    /**
     * Lấy danh sách món đồ cùng biến thể khả dụng để thay thế điều phối (BOK-006).
     */
    @Transactional(readOnly = true)
    public List<AvailableReplacementDto> getAvailableReplacements(Long bookingItemId) {
        BookingItem currentBookingItem = bookingItemRepository.findById(bookingItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món đồ đơn thuê với ID: " + bookingItemId));

        Long variantId = currentBookingItem.getVariant().getId();
        Long currentItemId = currentBookingItem.getProductItem().getId();
        LocalDate start = currentBookingItem.getRentalStartDate();
        LocalDate end = currentBookingItem.getRentalEndDate();

        Product product = currentBookingItem.getVariant().getProduct();
        int bufferDays = bookingService.calculateBufferDays(product);

        List<ProductItem> allItems = productItemRepository.findByVariantIdOrderByIdAsc(variantId);

        List<BookingItem> overlappingBookings = bookingItemRepository.findOverlappingItems(
                variantId,
                start.minusDays(bufferDays + 7),
                end.plusDays(bufferDays + 7),
                BookingStatus.CANCELLED
        );

        Set<Long> busyItemIds = new HashSet<>();
        for (BookingItem otherBi : overlappingBookings) {
            if (otherBi.getId().equals(currentBookingItem.getId()) || otherBi.getProductItem() == null) {
                continue;
            }

            if (bookingService.isIntervalOverlappingWithBuffer(start, end, otherBi.getRentalStartDate(), otherBi.getRentalEndDate(), bufferDays)) {
                busyItemIds.add(otherBi.getProductItem().getId());
            }
        }

        String productName = (product != null) ? product.getName() : "";
        String variantInfo = buildVariantInfo(currentBookingItem.getVariant());

        List<AvailableReplacementDto> result = new ArrayList<>();
        for (ProductItem item : allItems) {
            boolean isCurrent = item.getId().equals(currentItemId);
            boolean isAvailable = !busyItemIds.contains(item.getId())
                    && item.getStatus() != ProductItemStatus.RETIRED
                    && item.getStatus() != ProductItemStatus.MAINTENANCE;

            result.add(AvailableReplacementDto.builder()
                    .itemId(item.getId())
                    .barcode(item.getItemCode())
                    .productName(productName)
                    .variantInfo(variantInfo)
                    .itemStatus(item.getStatus())
                    .rentalCount(item.getRentalCount())
                    .note(item.getNote())
                    .isCurrent(isCurrent)
                    .isAvailable(isAvailable)
                    .build());
        }

        return result;
    }

    /**
     * Thực hiện điều phối đổi món đồ vật lý cho đơn thuê (BR-01, BR-02, BR-03, BOK-006).
     */
    @Transactional
    public ReassignItemResponse reassignItem(ReassignItemRequest request, String username) {
        BookingItem bookingItem = bookingItemRepository.findById(request.getBookingItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món đồ đơn thuê với ID: " + request.getBookingItemId()));

        Booking booking = bookingItem.getBooking();
        if (booking.getStatus() == BookingStatus.CANCELLED
                || booking.getStatus() == BookingStatus.COMPLETED
                || booking.getStatus() == BookingStatus.RETURNED) {
            throw new BadRequestException("Không thể điều phối đổi món đồ cho đơn thuê ở trạng thái " + booking.getStatus());
        }

        ProductItem newItem = productItemRepository.findById(request.getNewItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món đồ thay thế với ID: " + request.getNewItemId()));

        if (newItem.getId().equals(bookingItem.getProductItem().getId())) {
            throw new BadRequestException("Món đồ thay thế phải khác món đồ hiện tại");
        }

        if (newItem.getStatus() == ProductItemStatus.RETIRED || newItem.getStatus() == ProductItemStatus.MAINTENANCE) {
            throw new BadRequestException("Món đồ " + newItem.getItemCode() + " đang ở trạng thái " + newItem.getStatus() + ", không thể điều phối");
        }

        // BR-02: Bắt buộc cùng biến thể (Size/Màu)
        if (!newItem.getVariant().getId().equals(bookingItem.getVariant().getId())) {
            throw new BadRequestException("Món đồ thay thế phải cùng biến thể (Size/Màu) với món đồ ban đầu");
        }

        // BR-01: Kiểm tra xung đột lịch có tính bufferDays
        int bufferDays = bookingService.calculateBufferDays(newItem.getVariant().getProduct());
        List<BookingItem> overlaps = bookingItemRepository.findOverlappingItemsByProductItem(
                newItem.getId(),
                bookingItem.getRentalStartDate().minusDays(bufferDays + 7),
                bookingItem.getRentalEndDate().plusDays(bufferDays + 7),
                BookingStatus.CANCELLED
        );

        for (BookingItem other : overlaps) {
            if (other.getId().equals(bookingItem.getId())) continue;
            if (bookingService.isIntervalOverlappingWithBuffer(
                    bookingItem.getRentalStartDate(), bookingItem.getRentalEndDate(),
                    other.getRentalStartDate(), other.getRentalEndDate(),
                    bufferDays)) {
                throw new ConflictException(String.format(
                        "Món đồ %s đã có người đặt trong khoảng thời gian từ %s đến %s (kèm ngày đệm giặt ủi).",
                        newItem.getItemCode(), other.getRentalStartDate(), other.getRentalEndDate()
                ));
            }
        }

        String oldBarcode = bookingItem.getProductItem().getItemCode();
        bookingItem.setProductItem(newItem);
        bookingItemRepository.save(bookingItem);

        String actor = (username != null && !username.trim().isEmpty()) ? username.trim() : "STAFF";

        // BR-03: Ghi Audit Trail
        BookingStatusHistory history = BookingStatusHistory.builder()
                .booking(booking)
                .fromStatus(booking.getStatus())
                .toStatus(booking.getStatus())
                .action("REASSIGN_ITEM")
                .changedBy(actor)
                .note(String.format("[ĐỔI MÓN ĐỒ] Đổi từ %s sang %s. Lý do: %s",
                        oldBarcode, newItem.getItemCode(), request.getReason().trim()))
                .build();
        bookingStatusHistoryRepository.save(history);

        log.info("Điều phối thành công: Đơn {} đổi món {} sang {} bởi {}",
                booking.getBookingCode(), oldBarcode, newItem.getItemCode(), actor);

        return ReassignItemResponse.builder()
                .bookingItemId(bookingItem.getId())
                .bookingCode(booking.getBookingCode())
                .oldBarcode(oldBarcode)
                .newBarcode(newItem.getItemCode())
                .changedBy(actor)
                .updatedAt(LocalDateTime.now())
                .message("Điều phối đổi sang món đồ " + newItem.getItemCode() + " thành công")
                .build();
    }

    /**
     * Dời ngày thuê (Reschedule) đảm bảo chống trùng lịch và tự động tính lại giá/đệm giặt ủi (BOK-006).
     */
    @Transactional
    public RescheduleBookingResponse rescheduleBooking(RescheduleBookingRequest request, String username) {
        if (request.getNewEndDate().isBefore(request.getNewStartDate())) {
            throw new BadRequestException("Ngày kết thúc không thể trước ngày bắt đầu");
        }

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt thuê với ID: " + request.getBookingId()));

        if (booking.getStatus() == BookingStatus.DELIVERED
                || booking.getStatus() == BookingStatus.RETURNED
                || booking.getStatus() == BookingStatus.COMPLETED
                || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Không thể dời ngày đơn thuê ở trạng thái " + booking.getStatus());
        }

        if (booking.getRentalStartDate().equals(request.getNewStartDate())
                && booking.getRentalEndDate().equals(request.getNewEndDate())) {
            throw new BadRequestException("Khoảng thời gian mới trùng với thời gian hiện tại của đơn");
        }

        // Kiểm tra xung đột lịch cho từng món đồ trong đơn tại dải ngày mới
        if (booking.getItems() != null) {
            for (BookingItem bi : booking.getItems()) {
                ProductItem item = bi.getProductItem();
                if (item == null) continue;

                Product product = (bi.getVariant() != null) ? bi.getVariant().getProduct() : null;
                int bufferDays = bookingService.calculateBufferDays(product);

                List<BookingItem> overlaps = bookingItemRepository.findOverlappingItemsByProductItem(
                        item.getId(),
                        request.getNewStartDate().minusDays(bufferDays + 7),
                        request.getNewEndDate().plusDays(bufferDays + 7),
                        BookingStatus.CANCELLED
                );

                for (BookingItem other : overlaps) {
                    if (other.getBooking().getId().equals(booking.getId())) {
                        continue; // Bỏ qua chính đơn hiện tại
                    }
                    if (bookingService.isIntervalOverlappingWithBuffer(
                            request.getNewStartDate(), request.getNewEndDate(),
                            other.getRentalStartDate(), other.getRentalEndDate(),
                            bufferDays)) {
                        throw new ConflictException(String.format(
                                "Không thể dời ngày: Món đồ %s đã có người đặt trong khoảng thời gian từ %s đến %s (kèm ngày đệm giặt ủi).",
                                item.getItemCode(), other.getRentalStartDate(), other.getRentalEndDate()
                        ));
                    }
                }
            }
        }

        LocalDate oldStart = booking.getRentalStartDate();
        LocalDate oldEnd = booking.getRentalEndDate();

        int newDurationDays = (int) ChronoUnit.DAYS.between(request.getNewStartDate(), request.getNewEndDate()) + 1;
        if (newDurationDays < 1) newDurationDays = 1;

        BigDecimal totalRental = BigDecimal.ZERO;
        if (booking.getItems() != null) {
            for (BookingItem bi : booking.getItems()) {
                bi.setRentalStartDate(request.getNewStartDate());
                bi.setRentalEndDate(request.getNewEndDate());

                BigDecimal dailyPrice = (bi.getVariant() != null && bi.getVariant().getProduct() != null && bi.getVariant().getProduct().getRentalPrice() != null)
                        ? bi.getVariant().getProduct().getRentalPrice()
                        : BigDecimal.ZERO;

                BigDecimal itemRentalPrice = dailyPrice.multiply(BigDecimal.valueOf(newDurationDays));
                bi.setRentalPrice(itemRentalPrice);
                totalRental = totalRental.add(itemRentalPrice);
                bookingItemRepository.save(bi);
            }
        }

        booking.setRentalStartDate(request.getNewStartDate());
        booking.setRentalEndDate(request.getNewEndDate());
        booking.setTotalRentalPrice(totalRental);
        bookingRepository.save(booking);

        String actor = (username != null && !username.trim().isEmpty()) ? username.trim() : "STAFF";

        // BR-03: Ghi Audit Trail
        BookingStatusHistory history = BookingStatusHistory.builder()
                .booking(booking)
                .fromStatus(booking.getStatus())
                .toStatus(booking.getStatus())
                .action("RESCHEDULE_DATES")
                .changedBy(actor)
                .note(String.format("[DỜI NGÀY THUÊ] Dời từ [%s -> %s] sang [%s -> %s]. Lý do: %s",
                        oldStart, oldEnd, request.getNewStartDate(), request.getNewEndDate(), request.getReason().trim()))
                .build();
        bookingStatusHistoryRepository.save(history);

        log.info("Dời lịch thuê đơn {} từ [{} -> {}] sang [{} -> {}] bởi {}",
                booking.getBookingCode(), oldStart, oldEnd, request.getNewStartDate(), request.getNewEndDate(), actor);

        return RescheduleBookingResponse.builder()
                .bookingId(booking.getId())
                .bookingCode(booking.getBookingCode())
                .newStartDate(request.getNewStartDate())
                .newEndDate(request.getNewEndDate())
                .durationDays(newDurationDays)
                .totalRentalPrice(totalRental)
                .changedBy(actor)
                .updatedAt(LocalDateTime.now())
                .message(String.format("Dời lịch thuê đơn %s sang ngày %s đến %s thành công",
                        booking.getBookingCode(), request.getNewStartDate(), request.getNewEndDate()))
                .build();
    }

    private String cleanSearchKeyword(String search) {
        if (search == null || search.trim().isEmpty()) {
            return null;
        }
        return search.trim();
    }

    private String buildVariantInfo(ProductVariant variant) {
        if (variant == null) {
            return "";
        }
        String size = variant.getSize() != null ? variant.getSize() : "";
        String color = variant.getColor() != null ? variant.getColor() : "";
        if (size.isEmpty()) {
            return color;
        }
        return color.isEmpty() ? size : size + " - " + color;
    }
}
