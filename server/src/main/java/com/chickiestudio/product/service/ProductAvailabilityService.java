package com.chickiestudio.product.service;

import com.chickiestudio.booking.entity.BookingItem;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.repository.BookingItemRepository;
import com.chickiestudio.category.entity.CategoryType;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.product.dto.DayAvailabilityDto;
import com.chickiestudio.product.dto.ProductAvailabilityResponse;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductItem;
import com.chickiestudio.product.entity.ProductItemStatus;
import com.chickiestudio.product.entity.ProductVariant;
import com.chickiestudio.product.repository.ProductItemRepository;
import com.chickiestudio.product.repository.ProductRepository;
import com.chickiestudio.product.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductAvailabilityService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductItemRepository productItemRepository;
    private final BookingItemRepository bookingItemRepository;

    @Transactional(readOnly = true)
    public ProductAvailabilityResponse checkAvailability(String idOrSlug, Long variantId, String monthStr) {
        Product product;
        if (idOrSlug.matches("^\\d+$")) {
            product = productRepository.findById(Long.parseLong(idOrSlug))
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với id: " + idOrSlug));
        } else {
            product = productRepository.findBySlug(idOrSlug)
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với slug: " + idOrSlug));
        }

        // Parse month
        YearMonth yearMonth;
        if (monthStr != null && !monthStr.isBlank()) {
            try {
                yearMonth = YearMonth.parse(monthStr);
            } catch (DateTimeParseException e) {
                yearMonth = YearMonth.now();
            }
        } else {
            yearMonth = YearMonth.now();
        }

        // Determine variant
        ProductVariant variant = null;
        if (variantId != null) {
            variant = productVariantRepository.findById(variantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Biến thể không tồn tại với id: " + variantId));
            if (!variant.getProduct().getId().equals(product.getId())) {
                throw new IllegalArgumentException("Biến thể không thuộc sản phẩm này");
            }
        } else {
            List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
            if (!variants.isEmpty()) {
                variant = variants.get(0);
            }
        }

        // Determine buffer days: 1 day for costume/dress to launder; 0 day for camera or photography service
        int bufferDays = 1;
        if (product.getCategory() != null && product.getCategory().getType() != null) {
            CategoryType type = product.getCategory().getType();
            if (type == CategoryType.PHOTOGRAPHY || type == CategoryType.CAMERA) {
                bufferDays = 0;
            }
        }

        // Physical item instances
        List<ProductItem> items;
        if (variant != null) {
            items = productItemRepository.findByVariantIdOrderByIdAsc(variant.getId());
        } else {
            items = productItemRepository.findByVariantProductIdOrderByIdAsc(product.getId());
        }

        int totalItems = items.size();
        // Usable items (exclude retired or maintenance)
        List<ProductItem> activeItems = items.stream()
                .filter(i -> i.getStatus() != ProductItemStatus.RETIRED &&
                             i.getStatus() != ProductItemStatus.MAINTENANCE)
                .toList();

        int availableInventory = activeItems.size();
        Set<Long> activeItemIds = new HashSet<>();
        for (ProductItem pi : activeItems) {
            activeItemIds.add(pi.getId());
        }

        LocalDate startOfMonth = yearMonth.atDay(1);
        LocalDate endOfMonth = yearMonth.atEndOfMonth();

        // Fetch overlapping bookings
        List<BookingItem> overlappingBookings;
        if (variant != null) {
            overlappingBookings = bookingItemRepository.findOverlappingItems(
                    variant.getId(),
                    startOfMonth.minusDays(bufferDays + 14),
                    endOfMonth,
                    BookingStatus.CANCELLED
            );
        } else {
            overlappingBookings = bookingItemRepository.findOverlappingItemsByProduct(
                    product.getId(),
                    startOfMonth.minusDays(bufferDays + 14),
                    endOfMonth,
                    BookingStatus.CANCELLED
            );
        }

        LocalDate today = LocalDate.now();
        List<DayAvailabilityDto> days = new ArrayList<>(yearMonth.lengthOfMonth());

        for (int day = 1; day <= yearMonth.lengthOfMonth(); day++) {
            LocalDate date = yearMonth.atDay(day);

            if (date.isBefore(today)) {
                days.add(DayAvailabilityDto.builder()
                        .date(date)
                        .available(false)
                        .remainingCount(0)
                        .reason("PAST_DATE")
                        .build());
                continue;
            }

            if (availableInventory == 0) {
                days.add(DayAvailabilityDto.builder()
                        .date(date)
                        .available(false)
                        .remainingCount(0)
                        .reason("MAINTENANCE")
                        .build());
                continue;
            }

            // Count distinct item instances busy on this day (including buffer days)
            Set<Long> busyItemIds = new HashSet<>();
            for (BookingItem bi : overlappingBookings) {
                if (activeItemIds.contains(bi.getProductItem().getId())) {
                    LocalDate blockedEnd = bi.getRentalEndDate().plusDays(bufferDays);
                    if (!date.isBefore(bi.getRentalStartDate()) && !date.isAfter(blockedEnd)) {
                        busyItemIds.add(bi.getProductItem().getId());
                    }
                }
            }

            int remaining = Math.max(0, availableInventory - busyItemIds.size());
            boolean isAvailable = remaining > 0;
            String reason = isAvailable ? "AVAILABLE" : "FULLY_BOOKED";

            days.add(DayAvailabilityDto.builder()
                    .date(date)
                    .available(isAvailable)
                    .remainingCount(remaining)
                    .reason(reason)
                    .build());
        }

        String variantName = null;
        Long selectedVariantId = null;
        if (variant != null) {
            selectedVariantId = variant.getId();
            variantName = (variant.getSize() != null ? variant.getSize() : "") +
                    (variant.getColor() != null ? " - " + variant.getColor() : "");
        }

        return ProductAvailabilityResponse.builder()
                .productId(product.getId())
                .slug(product.getSlug())
                .productName(product.getName())
                .variantId(selectedVariantId)
                .variantName(variantName)
                .month(yearMonth.toString())
                .totalItems(totalItems)
                .availableItems(availableInventory)
                .bufferDays(bufferDays)
                .days(days)
                .build();
    }
}
