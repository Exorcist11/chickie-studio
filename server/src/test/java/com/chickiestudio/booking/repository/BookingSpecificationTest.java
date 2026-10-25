package com.chickiestudio.booking.repository;

import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.booking.entity.BookingStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class BookingSpecificationTest {

    @Test
    @DisplayName("filterBookings với đầy đủ tham số tạo các Predicate tương ứng")
    void filterBookings_WithAllParameters() {
        Root<Booking> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);

        Path statusPath = mock(Path.class);
        Path codePath = mock(Path.class);
        Path namePath = mock(Path.class);
        Path phonePath = mock(Path.class);
        Path startDatePath = mock(Path.class);
        Path endDatePath = mock(Path.class);

        when(root.get("status")).thenReturn(statusPath);
        when(root.get("bookingCode")).thenReturn(codePath);
        when(root.get("customerName")).thenReturn(namePath);
        when(root.get("customerPhone")).thenReturn(phonePath);
        when(root.get("rentalStartDate")).thenReturn(startDatePath);
        when(root.get("rentalEndDate")).thenReturn(endDatePath);

        Predicate predicate = mock(Predicate.class);
        when(cb.equal(any(), any())).thenReturn(predicate);
        when(cb.like(any(), anyString())).thenReturn(predicate);
        when(cb.lower(any())).thenReturn(mock(jakarta.persistence.criteria.Expression.class));
        when(cb.or(any(Predicate[].class))).thenReturn(predicate);
        when(cb.greaterThanOrEqualTo(any(), any(LocalDate.class))).thenReturn(predicate);
        when(cb.lessThanOrEqualTo(any(), any(LocalDate.class))).thenReturn(predicate);
        when(cb.lessThan(any(), any(LocalDate.class))).thenReturn(predicate);
        when(cb.and(any(Predicate[].class))).thenReturn(predicate);

        LocalDate now = LocalDate.now();
        Specification<Booking> spec = BookingSpecification.filterBookings(
                BookingStatus.PENDING,
                "BK01",
                now,
                now.plusDays(3),
                true,
                true,
                true
        );

        Predicate result = spec.toPredicate(root, query, cb);

        assertThat(result).isNotNull();
        verify(cb).equal(statusPath, BookingStatus.PENDING);
        verify(cb).greaterThanOrEqualTo(startDatePath, now);
        verify(cb).lessThanOrEqualTo(endDatePath, now.plusDays(3));
        verify(cb).equal(startDatePath, now);
        verify(cb).equal(endDatePath, now);
    }

    @Test
    @DisplayName("filterBookings với tham số null tạo Predicate rỗng")
    void filterBookings_WithNullParameters() {
        Root<Booking> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);

        Predicate predicate = mock(Predicate.class);
        when(cb.and(any(Predicate[].class))).thenReturn(predicate);

        Specification<Booking> spec = BookingSpecification.filterBookings(
                null, null, null, null, null, null, null
        );

        Predicate result = spec.toPredicate(root, query, cb);

        assertThat(result).isNotNull();
        verify(cb).and(new Predicate[0]);
    }
}
