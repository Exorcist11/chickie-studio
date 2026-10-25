package com.chickiestudio.booking.service;

import com.chickiestudio.booking.dto.BookingItemResponse;
import com.chickiestudio.booking.dto.BookingResponse;
import com.chickiestudio.booking.dto.BookingStatusHistoryResponse;
import com.chickiestudio.booking.dto.BookingTrackingRequest;
import com.chickiestudio.booking.dto.CreateBookingRequest;
import com.chickiestudio.booking.dto.UpdateBookingStatusRequest;
import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.booking.entity.BookingItem;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.entity.BookingStatusHistory;
import com.chickiestudio.booking.repository.BookingItemRepository;
import com.chickiestudio.booking.repository.BookingRepository;
import com.chickiestudio.booking.repository.BookingSpecification;
import com.chickiestudio.booking.repository.BookingStatusHistoryRepository;
import com.chickiestudio.category.entity.CategoryType;
import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.notification.service.EmailNotificationService;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductItem;
import com.chickiestudio.product.entity.ProductItemStatus;
import com.chickiestudio.product.entity.ProductVariant;
import com.chickiestudio.product.repository.ProductItemRepository;
import com.chickiestudio.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingItemRepository bookingItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductItemRepository productItemRepository;
    private final BookingStatusHistoryRepository bookingStatusHistoryRepository;
    private final EmailNotificationService emailNotificationService;

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        LocalDate today = LocalDate.now();
        if (request.getRentalStartDate().isBefore(today)) {
            throw new BadRequestException("Ngày nhận đồ không thể ở quá khứ");
        }
        if (request.getRentalEndDate().isBefore(request.getRentalStartDate())) {
            throw new BadRequestException("Ngày trả đồ không thể trước ngày nhận đồ");
        }

        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Biến thể sản phẩm không tồn tại với id: " + request.getVariantId()));

        Product product = variant.getProduct();

        // Calculate rental days
        int durationDays = (int) ChronoUnit.DAYS.between(request.getRentalStartDate(), request.getRentalEndDate()) + 1;
        if (durationDays < 1) {
            durationDays = 1;
        }

        // Determine buffer days (1 for costume/dress, 0 for camera/photography) (BOK-002)
        int bufferDays = calculateBufferDays(product);

        // Active physical items with Pessimistic Write Lock (BOK-002) to prevent concurrent double-booking
        List<ProductItem> activeItems = productItemRepository.findActiveItemsForUpdate(variant.getId());

        if (activeItems.isEmpty()) {
            List<ProductItem> allItems = productItemRepository.findByVariantIdOrderByIdAsc(variant.getId());
            if (allItems.isEmpty()) {
                ProductItem autoItem1 = ProductItem.builder()
                        .variant(variant)
                        .itemCode(variant.getSku() + "-01")
                        .status(ProductItemStatus.AVAILABLE)
                        .rentalCount(0)
                        .note("Sẵn sàng tại Studio Chickie")
                        .build();
                ProductItem autoItem2 = ProductItem.builder()
                        .variant(variant)
                        .itemCode(variant.getSku() + "-02")
                        .status(ProductItemStatus.AVAILABLE)
                        .rentalCount(1)
                        .note("Món đồ dự phòng sẵn sàng tại Studio Chickie")
                        .build();
                try {
                    productItemRepository.saveAll(List.of(autoItem1, autoItem2));
                    activeItems = productItemRepository.findActiveItemsForUpdate(variant.getId());
                } catch (Exception ex) {
                    activeItems = productItemRepository.findActiveItemsForUpdate(variant.getId());
                }
            }
        }

        if (activeItems.isEmpty()) {
            throw new ConflictException("Biến thể " + (variant.getSize() != null ? variant.getSize() : "") +
                    " của sản phẩm này hiện chưa có món đồ vật lý khả dụng trong kho");
        }

        // Find overlapping bookings
        List<BookingItem> overlappingBookings = bookingItemRepository.findOverlappingItems(
                variant.getId(),
                request.getRentalStartDate().minusDays(bufferDays + 14),
                request.getRentalEndDate().plusDays(bufferDays + 14),
                BookingStatus.CANCELLED
        );

        Set<Long> busyItemIds = new HashSet<>();
        for (BookingItem bi : overlappingBookings) {
            if (bi.getProductItem() == null) continue;
            boolean overlaps = isIntervalOverlappingWithBuffer(
                    request.getRentalStartDate(), request.getRentalEndDate(),
                    bi.getRentalStartDate(), bi.getRentalEndDate(),
                    bufferDays
            );
            if (overlaps) {
                busyItemIds.add(bi.getProductItem().getId());
            }
        }

        // Pick first available physical item
        ProductItem allocatedItem = null;
        for (ProductItem item : activeItems) {
            if (!busyItemIds.contains(item.getId())) {
                allocatedItem = item;
                break;
            }
        }

        if (allocatedItem == null) {
            throw new ConflictException(
                    "Rất tiếc, sản phẩm '" + product.getName() + "' (Size " +
                    (variant.getSize() != null ? variant.getSize() : "Chuẩn") +
                    ") đã kín lịch trong khoảng thời gian từ " +
                    request.getRentalStartDate() + " đến " + request.getRentalEndDate() +
                    ". Vui lòng chọn ngày khác hoặc mẫu khác."
            );
        }

        // Calculate pricing
        BigDecimal rentalPricePerDay = product.getRentalPrice() != null ? product.getRentalPrice() : BigDecimal.ZERO;
        BigDecimal totalRentalPrice = rentalPricePerDay.multiply(BigDecimal.valueOf(durationDays));

        BigDecimal depositPrice = product.getDepositPrice() != null ? product.getDepositPrice() : BigDecimal.ZERO;

        // Generate unique booking code: BKyyyyMMdd-XXXX
        String bookingCode = generateUniqueBookingCode();

        // Build Booking entity
        Booking booking = Booking.builder()
                .bookingCode(bookingCode)
                .customerName(request.getCustomerName().trim())
                .customerPhone(request.getCustomerPhone().trim())
                .customerEmail(request.getCustomerEmail() != null ? request.getCustomerEmail().trim() : null)
                .deliveryMethod(request.getDeliveryMethod() != null ? request.getDeliveryMethod() : "PICKUP_STORE")
                .deliveryAddress(request.getDeliveryAddress() != null ? request.getDeliveryAddress().trim() : null)
                .rentalStartDate(request.getRentalStartDate())
                .rentalEndDate(request.getRentalEndDate())
                .status(BookingStatus.PENDING)
                .totalRentalPrice(totalRentalPrice)
                .totalDepositPrice(depositPrice)
                .note(request.getNote() != null ? request.getNote().trim() : null)
                .build();

        // Build BookingItem entity
        BookingItem bookingItem = BookingItem.builder()
                .booking(booking)
                .productItem(allocatedItem)
                .variant(variant)
                .rentalStartDate(request.getRentalStartDate())
                .rentalEndDate(request.getRentalEndDate())
                .rentalPrice(totalRentalPrice)
                .depositPrice(depositPrice)
                .build();

        booking.getItems().add(bookingItem);

        Booking savedBooking = bookingRepository.save(booking);

        BookingStatusHistory initialHistory = BookingStatusHistory.builder()
                .booking(savedBooking)
                .fromStatus(null)
                .toStatus(BookingStatus.PENDING)
                .changedBy("CUSTOMER")
                .note("Đơn đặt thuê tạo trực tuyến trên website")
                .build();
        bookingStatusHistoryRepository.save(initialHistory);

        log.info("Đã tạo thành công đơn đặt thuê {} cho khách hàng {} (Item #{})",
                bookingCode, request.getCustomerName(), allocatedItem.getId());

        // Kích hoạt gửi email xác nhận đặt lịch tự động nếu khách có nhập email (SET-003 & BOK-001)
        emailNotificationService.sendBookingConfirmation(savedBooking);

        return mapToResponse(savedBooking, durationDays);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getBookingsForAdmin(
            BookingStatus status,
            String search,
            LocalDate startDate,
            LocalDate endDate,
            Boolean todayDeliver,
            Boolean todayReturn,
            Boolean overdue,
            Pageable pageable
    ) {
        Specification<Booking> spec = BookingSpecification.filterBookings(
                status, search, startDate, endDate, todayDeliver, todayReturn, overdue
        );
        Page<Booking> page = bookingRepository.findAll(spec, pageable);
        return page.map(b -> {
            int durationDays = (int) ChronoUnit.DAYS.between(b.getRentalStartDate(), b.getRentalEndDate()) + 1;
            if (durationDays < 1) durationDays = 1;
            return mapToResponse(b, durationDays);
        });
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt thuê với ID: " + id));

        int durationDays = (int) ChronoUnit.DAYS.between(booking.getRentalStartDate(), booking.getRentalEndDate()) + 1;
        if (durationDays < 1) durationDays = 1;

        return mapToResponse(booking, durationDays);
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long id, UpdateBookingStatusRequest request, String changedBy) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt thuê với ID: " + id));

        BookingStatus currentStatus = booking.getStatus();
        BookingStatus targetStatus = request.getStatus();

        if (!currentStatus.canTransitionTo(targetStatus)) {
            throw new BadRequestException(String.format("Không thể chuyển đổi trạng thái đơn thuê từ %s sang %s", currentStatus, targetStatus));
        }

        if (targetStatus == BookingStatus.CANCELLED && (request.getNote() == null || request.getNote().trim().isEmpty())) {
            throw new BadRequestException("Vui lòng cung cấp lý do khi hủy đơn thuê");
        }

        booking.setStatus(targetStatus);

        // Đồng bộ trạng thái món đồ thực tế (ProductItem)
        if (booking.getItems() != null) {
            for (BookingItem bi : booking.getItems()) {
                ProductItem item = bi.getProductItem();
                if (item != null) {
                    switch (targetStatus) {
                        case DELIVERED -> {
                            item.setStatus(ProductItemStatus.RENTED);
                            productItemRepository.save(item);
                            log.info("Món đồ #{} chuyển sang trạng thái RENTED", item.getItemCode());
                        }
                        case RETURNED -> {
                            item.setStatus(ProductItemStatus.LAUNDRY);
                            item.setRentalCount(item.getRentalCount() + 1);
                            productItemRepository.save(item);
                            log.info("Món đồ #{} chuyển sang trạng thái LAUNDRY, rentalCount={}", item.getItemCode(), item.getRentalCount());
                        }
                        case COMPLETED -> {
                            if (item.getStatus() == ProductItemStatus.LAUNDRY || item.getStatus() == ProductItemStatus.RENTED) {
                                item.setStatus(ProductItemStatus.AVAILABLE);
                                productItemRepository.save(item);
                                log.info("Món đồ #{} hoàn tất đơn và chuyển về AVAILABLE", item.getItemCode());
                            }
                        }
                        case CANCELLED -> {
                            if (item.getStatus() == ProductItemStatus.RENTED) {
                                item.setStatus(ProductItemStatus.AVAILABLE);
                                productItemRepository.save(item);
                                log.info("Đơn hủy: Giải phóng món đồ #{} về AVAILABLE", item.getItemCode());
                            }
                        }
                        default -> {}
                    }
                }
            }
        }

        BookingStatusHistory history = BookingStatusHistory.builder()
                .booking(booking)
                .fromStatus(currentStatus)
                .toStatus(targetStatus)
                .changedBy(changedBy != null ? changedBy : "SYSTEM")
                .note(request.getNote())
                .build();
        bookingStatusHistoryRepository.save(history);

        Booking saved = bookingRepository.save(booking);
        log.info("Cập nhật trạng thái đơn thuê ID {} ({}) từ {} sang {} bởi {}",
                saved.getId(), saved.getBookingCode(), currentStatus, targetStatus, changedBy);

        // Kích hoạt gửi email tự động tương ứng theo trạng thái đơn (SET-003)
        emailNotificationService.sendBookingStatusNotification(saved, targetStatus);

        int durationDays = (int) ChronoUnit.DAYS.between(saved.getRentalStartDate(), saved.getRentalEndDate()) + 1;
        if (durationDays < 1) durationDays = 1;

        return mapToResponse(saved, durationDays);
    }

    /**
     * Tự động quét và cập nhật trạng thái các đơn thuê DELIVERED đã quá hạn ngày trả sang OVERDUE (BOK-003).
     *
     * @param currentDate Ngày hiện tại để đối chiếu (mặc định LocalDate.now())
     * @return Số lượng đơn thuê đã được đánh dấu OVERDUE
     */
    @Transactional
    public int markOverdueBookings(LocalDate currentDate) {
        LocalDate dateToCheck = currentDate != null ? currentDate : LocalDate.now();
        List<Booking> overdueBookings = bookingRepository.findByStatusAndRentalEndDateBefore(BookingStatus.DELIVERED, dateToCheck);
        int count = 0;
        for (Booking booking : overdueBookings) {
            booking.setStatus(BookingStatus.OVERDUE);
            BookingStatusHistory history = BookingStatusHistory.builder()
                    .booking(booking)
                    .fromStatus(BookingStatus.DELIVERED)
                    .toStatus(BookingStatus.OVERDUE)
                    .changedBy("SYSTEM")
                    .note("Tự động đánh dấu quá hạn trả đồ (Ngày hẹn trả: " + booking.getRentalEndDate() + ")")
                    .build();
            bookingStatusHistoryRepository.save(history);
            bookingRepository.save(booking);
            count++;
            log.warn("Đơn thuê {} ({}) đã quá ngày trả {}, tự động chuyển trạng thái OVERDUE",
                    booking.getId(), booking.getBookingCode(), booking.getRentalEndDate());
        }
        return count;
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByCode(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt thuê với mã: " + bookingCode));

        int durationDays = (int) ChronoUnit.DAYS.between(booking.getRentalStartDate(), booking.getRentalEndDate()) + 1;
        if (durationDays < 1) durationDays = 1;

        return mapToResponse(booking, durationDays);
    }

    @Transactional(readOnly = true)
    public BookingResponse trackBooking(BookingTrackingRequest request) {
        String code = request.getBookingCode() != null ? request.getBookingCode().trim() : "";
        Booking booking = bookingRepository.findByBookingCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt thuê phù hợp. Vui lòng kiểm tra lại mã đơn và số điện thoại"));

        // Match phone with normalization (BR-01)
        if (!isPhoneMatching(booking.getCustomerPhone(), request.getPhone())) {
            throw new ResourceNotFoundException("Không tìm thấy đơn đặt thuê phù hợp. Vui lòng kiểm tra lại mã đơn và số điện thoại");
        }

        int durationDays = (int) ChronoUnit.DAYS.between(booking.getRentalStartDate(), booking.getRentalEndDate()) + 1;
        if (durationDays < 1) durationDays = 1;

        BookingResponse response = mapToResponse(booking, durationDays);

        // Sanitize sensitive admin/staff info for guest customer tracking (BR-02)
        if (response.getStatusHistories() != null) {
            List<BookingStatusHistoryResponse> sanitizedHistories = response.getStatusHistories().stream()
                    .map(h -> {
                        String displayActor = "CUSTOMER".equalsIgnoreCase(h.getChangedBy()) ? "CUSTOMER" : "CHICKIE_STUDIO";
                        return BookingStatusHistoryResponse.builder()
                                .id(h.getId())
                                .fromStatus(h.getFromStatus())
                                .toStatus(h.getToStatus())
                                .changedBy(displayActor)
                                .note(h.getNote())
                                .createdAt(h.getCreatedAt())
                                .build();
                    })
                    .toList();
            response.setStatusHistories(sanitizedHistories);
        }

        return response;
    }

    boolean isPhoneMatching(String phone1, String phone2) {
        if (phone1 == null || phone2 == null) return false;
        String p1 = phone1.replaceAll("[^0-9]", "");
        String p2 = phone2.replaceAll("[^0-9]", "");
        if (p1.startsWith("84")) p1 = "0" + p1.substring(2);
        if (p2.startsWith("84")) p2 = "0" + p2.substring(2);
        return p1.equals(p2);
    }

    private String generateUniqueBookingCode() {
        String datePrefix = DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDate.now());
        for (int i = 0; i < 10; i++) {
            String randomSuffix = UUID.randomUUID().toString().replace("-", "").substring(0, 4).toUpperCase();
            String code = "BK" + datePrefix + "-" + randomSuffix;
            if (!bookingRepository.existsByBookingCode(code)) {
                return code;
            }
        }
        return "BK" + datePrefix + "-" + System.currentTimeMillis() % 10000;
    }

    private BookingResponse mapToResponse(Booking booking, int durationDays) {
        List<BookingItemResponse> itemResponses = new ArrayList<>();
        if (booking.getItems() != null) {
            for (BookingItem bi : booking.getItems()) {
                String prodName = bi.getVariant() != null && bi.getVariant().getProduct() != null ?
                        bi.getVariant().getProduct().getName() : "";
                String size = bi.getVariant() != null ? bi.getVariant().getSize() : null;
                String color = bi.getVariant() != null ? bi.getVariant().getColor() : null;
                String itemCode = bi.getProductItem() != null ? bi.getProductItem().getItemCode() : null;
                Long itemId = bi.getProductItem() != null ? bi.getProductItem().getId() : null;
                Long variantId = bi.getVariant() != null ? bi.getVariant().getId() : null;

                itemResponses.add(BookingItemResponse.builder()
                        .id(bi.getId())
                        .productItemId(itemId)
                        .productItemCode(itemCode)
                        .variantId(variantId)
                        .productName(prodName)
                        .variantSize(size)
                        .variantColor(color)
                        .rentalStartDate(bi.getRentalStartDate())
                        .rentalEndDate(bi.getRentalEndDate())
                        .rentalPrice(bi.getRentalPrice())
                        .depositPrice(bi.getDepositPrice())
                        .build());
            }
        }

        List<BookingStatusHistoryResponse> historyResponses = new ArrayList<>();
        if (booking.getId() != null) {
            historyResponses = bookingStatusHistoryRepository
                    .findByBookingIdOrderByCreatedAtDesc(booking.getId())
                    .stream()
                    .map(h -> BookingStatusHistoryResponse.builder()
                            .id(h.getId())
                            .fromStatus(h.getFromStatus())
                            .toStatus(h.getToStatus())
                            .changedBy(h.getChangedBy())
                            .note(h.getNote())
                            .createdAt(h.getCreatedAt())
                            .build())
                    .toList();
        }

        BigDecimal totalAmount = (booking.getTotalRentalPrice() != null ? booking.getTotalRentalPrice() : BigDecimal.ZERO)
                .add(booking.getTotalDepositPrice() != null ? booking.getTotalDepositPrice() : BigDecimal.ZERO);

        List<BookingStatus> nextValidStatuses = booking.getStatus() != null
                ? new ArrayList<>(booking.getStatus().getValidNextStatuses())
                : Collections.emptyList();

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .customerName(booking.getCustomerName())
                .customerPhone(booking.getCustomerPhone())
                .customerEmail(booking.getCustomerEmail())
                .deliveryMethod(booking.getDeliveryMethod())
                .deliveryAddress(booking.getDeliveryAddress())
                .rentalStartDate(booking.getRentalStartDate())
                .rentalEndDate(booking.getRentalEndDate())
                .durationDays(durationDays)
                .status(booking.getStatus())
                .totalRentalPrice(booking.getTotalRentalPrice())
                .totalDepositPrice(booking.getTotalDepositPrice())
                .totalAmount(totalAmount)
                .note(booking.getNote())
                .createdAt(booking.getCreatedAt())
                .items(itemResponses)
                .statusHistories(historyResponses)
                .nextValidStatuses(nextValidStatuses)
                .build();
    }

    /**
     * Tính toán số ngày đệm giặt ủi an toàn (BR-01, BOK-002):
     * - Trang phục (Váy, Áo dài): 1 ngày đệm sau ngày trả để giặt hấp sấy.
     * - Máy ảnh, thiết bị hoặc dịch vụ chụp ảnh: 0 ngày đệm (chỉ kiểm tra pin/thẻ nhớ).
     */
    public int calculateBufferDays(Product product) {
        if (product != null && product.getCategory() != null && product.getCategory().getType() != null) {
            CategoryType type = product.getCategory().getType();
            if (type == CategoryType.PHOTOGRAPHY || type == CategoryType.CAMERA) {
                return 0;
            }
        }
        return 1;
    }

    /**
     * Kiểm tra giao thoa giữa 2 khoảng thời gian thuê có tính ngày đệm giặt ủi (BOK-002).
     * Hai khoảng thời gian [StartA, EndA + buffer] và [StartB, EndB + buffer] giao thoa khi:
     * StartA <= EndB + buffer VÀ StartB <= EndA + buffer.
     */
    public boolean isIntervalOverlappingWithBuffer(
            LocalDate startA, LocalDate endA,
            LocalDate startB, LocalDate endB,
            int bufferDays
    ) {
        LocalDate blockedEndA = endA.plusDays(bufferDays);
        LocalDate blockedEndB = endB.plusDays(bufferDays);
        return !startA.isAfter(blockedEndB) && !startB.isAfter(blockedEndA);
    }
}
