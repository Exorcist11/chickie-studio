package com.chickiestudio.booking.service;

import com.chickiestudio.booking.dto.BookingItemResponse;
import com.chickiestudio.booking.dto.BookingResponse;
import com.chickiestudio.booking.dto.CreateBookingRequest;
import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.booking.entity.BookingItem;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.repository.BookingItemRepository;
import com.chickiestudio.booking.repository.BookingRepository;
import com.chickiestudio.category.entity.CategoryType;
import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductItem;
import com.chickiestudio.product.entity.ProductItemStatus;
import com.chickiestudio.product.entity.ProductVariant;
import com.chickiestudio.product.repository.ProductItemRepository;
import com.chickiestudio.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
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

        // Determine buffer days (1 for costume/dress, 0 for camera/photography)
        int bufferDays = 1;
        if (product.getCategory() != null && product.getCategory().getType() != null) {
            CategoryType type = product.getCategory().getType();
            if (type == CategoryType.PHOTOGRAPHY || type == CategoryType.CAMERA) {
                bufferDays = 0;
            }
        }

        // Active physical items
        List<ProductItem> allItems = productItemRepository.findByVariantIdOrderByIdAsc(variant.getId());
        List<ProductItem> activeItems = allItems.stream()
                .filter(i -> i.getStatus() != ProductItemStatus.RETIRED && i.getStatus() != ProductItemStatus.MAINTENANCE)
                .toList();

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
                allItems = productItemRepository.saveAll(List.of(autoItem1, autoItem2));
                activeItems = allItems;
            } catch (Exception ex) {
                allItems = productItemRepository.findByVariantIdOrderByIdAsc(variant.getId());
                activeItems = allItems.stream()
                        .filter(i -> i.getStatus() != ProductItemStatus.RETIRED && i.getStatus() != ProductItemStatus.MAINTENANCE)
                        .toList();
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
            LocalDate blockedEnd = bi.getRentalEndDate().plusDays(bufferDays);
            LocalDate newBlockedEnd = request.getRentalEndDate().plusDays(bufferDays);

            // Check mutual overlap with buffer
            boolean overlaps = !request.getRentalStartDate().isAfter(blockedEnd) &&
                               !newBlockedEnd.isBefore(bi.getRentalStartDate());
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

        log.info("Đã tạo thành công đơn đặt thuê {} cho khách hàng {} (Item #{})",
                bookingCode, request.getCustomerName(), allocatedItem.getId());

        return mapToResponse(savedBooking, durationDays);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByCode(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt thuê với mã: " + bookingCode));

        int durationDays = (int) ChronoUnit.DAYS.between(booking.getRentalStartDate(), booking.getRentalEndDate()) + 1;
        if (durationDays < 1) durationDays = 1;

        return mapToResponse(booking, durationDays);
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

        BigDecimal totalAmount = (booking.getTotalRentalPrice() != null ? booking.getTotalRentalPrice() : BigDecimal.ZERO)
                .add(booking.getTotalDepositPrice() != null ? booking.getTotalDepositPrice() : BigDecimal.ZERO);

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .customerName(booking.getCustomerName())
                .customerPhone(booking.getCustomerPhone())
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
                .build();
    }
}
