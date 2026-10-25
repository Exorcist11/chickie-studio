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
}
