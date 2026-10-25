package com.chickiestudio.booking.repository;

import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.booking.entity.BookingStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Tiêu chí tìm kiếm và lọc động danh sách đơn đặt thuê cho Admin/CRM (BOK-004).
 */
public class BookingSpecification {

    public static Specification<Booking> filterBookings(
            BookingStatus status,
            String search,
            LocalDate startDate,
            LocalDate endDate,
            Boolean todayDeliver,
            Boolean todayReturn,
            Boolean overdue
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            LocalDate today = LocalDate.now();

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate codeMatch = cb.like(cb.lower(root.get("bookingCode")), pattern);
                Predicate nameMatch = cb.like(cb.lower(root.get("customerName")), pattern);
                Predicate phoneMatch = cb.like(cb.lower(root.get("customerPhone")), pattern);
                predicates.add(cb.or(codeMatch, nameMatch, phoneMatch));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rentalStartDate"), startDate));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("rentalEndDate"), endDate));
            }

            if (Boolean.TRUE.equals(todayDeliver)) {
                predicates.add(cb.equal(root.get("rentalStartDate"), today));
            }

            if (Boolean.TRUE.equals(todayReturn)) {
                predicates.add(cb.equal(root.get("rentalEndDate"), today));
            }

            if (Boolean.TRUE.equals(overdue)) {
                // Đơn hàng DELIVERED và rentalEndDate < ngày hôm nay
                predicates.add(cb.equal(root.get("status"), BookingStatus.DELIVERED));
                predicates.add(cb.lessThan(root.get("rentalEndDate"), today));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
