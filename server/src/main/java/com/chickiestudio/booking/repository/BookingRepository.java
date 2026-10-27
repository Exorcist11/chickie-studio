package com.chickiestudio.booking.repository;

import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    Optional<Booking> findByBookingCode(String bookingCode);

    List<Booking> findByCustomerPhoneOrderByCreatedAtDesc(String customerPhone);

    boolean existsByBookingCode(String bookingCode);

    /**
     * Tìm danh sách đơn thuê có trạng thái cụ thể và đã quá hạn ngày trả đồ (BOK-003).
     */
    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.rentalEndDate < :currentDate")
    List<Booking> findByStatusAndRentalEndDateBefore(
            @Param("status") BookingStatus status,
            @Param("currentDate") LocalDate currentDate
    );

    /**
     * Lấy danh sách đơn thuê cho giao diện Calendar trong khoảng ngày [startDate, endDate] (BOK-006).
     */
    @Query("SELECT DISTINCT b FROM Booking b " +
           "LEFT JOIN FETCH b.items bi " +
           "LEFT JOIN FETCH bi.productItem pi " +
           "LEFT JOIN FETCH bi.variant pv " +
           "LEFT JOIN FETCH pv.product p " +
           "WHERE (:status IS NULL OR b.status = :status) " +
           "AND b.status != :excludeStatus " +
           "AND b.rentalStartDate <= :endDate " +
           "AND b.rentalEndDate >= :startDate " +
           "AND (:search IS NULL OR LOWER(b.bookingCode) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(b.customerName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(b.customerPhone) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY b.rentalStartDate ASC, b.id ASC")
    List<Booking> findCalendarBookings(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") BookingStatus status,
            @Param("search") String search,
            @Param("excludeStatus") BookingStatus excludeStatus
    );
}
