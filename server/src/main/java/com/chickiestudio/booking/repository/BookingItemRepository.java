package com.chickiestudio.booking.repository;

import com.chickiestudio.booking.entity.BookingItem;
import com.chickiestudio.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingItemRepository extends JpaRepository<BookingItem, Long> {

    /**
     * Tìm tất cả booking items thuộc variant và giao thoa với khoảng ngày [rangeStart, rangeEnd],
     * ngoại trừ các đơn có trạng thái CANCELLED.
     */
    @Query("SELECT bi FROM BookingItem bi " +
           "JOIN FETCH bi.booking b " +
           "WHERE bi.variant.id = :variantId " +
           "AND b.status != :excludeStatus " +
           "AND bi.rentalStartDate <= :rangeEnd " +
           "AND bi.rentalEndDate >= :rangeStart")
    List<BookingItem> findOverlappingItems(
            @Param("variantId") Long variantId,
            @Param("rangeStart") LocalDate rangeStart,
            @Param("rangeEnd") LocalDate rangeEnd,
            @Param("excludeStatus") BookingStatus excludeStatus
    );

    /**
     * Tìm tất cả booking items thuộc sản phẩm (tất cả variants) và giao thoa với khoảng ngày [rangeStart, rangeEnd],
     * ngoại trừ các đơn có trạng thái CANCELLED.
     */
    @Query("SELECT bi FROM BookingItem bi " +
           "JOIN FETCH bi.booking b " +
           "JOIN FETCH bi.variant pv " +
           "WHERE pv.product.id = :productId " +
           "AND b.status != :excludeStatus " +
           "AND bi.rentalStartDate <= :rangeEnd " +
           "AND bi.rentalEndDate >= :rangeStart")
    List<BookingItem> findOverlappingItemsByProduct(
            @Param("productId") Long productId,
            @Param("rangeStart") LocalDate rangeStart,
            @Param("rangeEnd") LocalDate rangeEnd,
            @Param("excludeStatus") BookingStatus excludeStatus
    );

    /**
     * Lấy các booking items cho dòng thời gian Timeline trong khoảng ngày [rangeStart, rangeEnd],
     * ngoại trừ các đơn có trạng thái CANCELLED (BOK-006).
     */
    @Query("SELECT bi FROM BookingItem bi " +
           "JOIN FETCH bi.booking b " +
           "JOIN FETCH bi.productItem pi " +
           "JOIN FETCH bi.variant pv " +
           "JOIN FETCH pv.product p " +
           "LEFT JOIN FETCH p.category c " +
           "WHERE b.status != :excludeStatus " +
           "AND bi.rentalStartDate <= :rangeEnd " +
           "AND bi.rentalEndDate >= :rangeStart " +
           "ORDER BY bi.rentalStartDate ASC")
    List<BookingItem> findTimelineEvents(
            @Param("rangeStart") LocalDate rangeStart,
            @Param("rangeEnd") LocalDate rangeEnd,
            @Param("excludeStatus") BookingStatus excludeStatus
    );

    /**
     * Tìm tất cả booking items thuộc về một món đồ cụ thể (product_item_id)
     * giao thoa với khoảng ngày [rangeStart, rangeEnd], ngoại trừ các đơn CANCELLED.
     */
    @Query("SELECT bi FROM BookingItem bi " +
           "JOIN FETCH bi.booking b " +
           "WHERE bi.productItem.id = :productItemId " +
           "AND b.status != :excludeStatus " +
           "AND bi.rentalStartDate <= :rangeEnd " +
           "AND bi.rentalEndDate >= :rangeStart")
    List<BookingItem> findOverlappingItemsByProductItem(
            @Param("productItemId") Long productItemId,
            @Param("rangeStart") LocalDate rangeStart,
            @Param("rangeEnd") LocalDate rangeEnd,
            @Param("excludeStatus") BookingStatus excludeStatus
    );
}
