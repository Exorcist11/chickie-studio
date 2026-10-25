package com.chickiestudio.product.repository;

import com.chickiestudio.product.entity.ProductItem;
import com.chickiestudio.product.entity.ProductItemStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {

    boolean existsByItemCode(String itemCode);

    Optional<ProductItem> findByItemCode(String itemCode);

    List<ProductItem> findByVariantIdOrderByIdAsc(Long variantId);

    /**
     * Khóa bi quan danh sách món đồ khả dụng của biến thể khi bắt đầu giao dịch đặt hàng,
     * ngăn chặn Race Condition (trùng lịch) giữa nhiều khách hàng đặt cùng lúc (BOK-002).
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM ProductItem p WHERE p.variant.id = :variantId " +
           "AND p.status NOT IN (com.chickiestudio.product.entity.ProductItemStatus.RETIRED, com.chickiestudio.product.entity.ProductItemStatus.MAINTENANCE) " +
           "ORDER BY p.id ASC")
    List<ProductItem> findActiveItemsForUpdate(@Param("variantId") Long variantId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM ProductItem p WHERE p.variant.id = :variantId AND p.status = com.chickiestudio.product.entity.ProductItemStatus.AVAILABLE ORDER BY p.id ASC")
    List<ProductItem> findAvailableItemsForUpdate(@Param("variantId") Long variantId);

    List<ProductItem> findByVariantProductIdOrderByIdAsc(Long productId);

    List<ProductItem> findByVariantProductIdAndStatus(Long productId, ProductItemStatus status);

    @Query("SELECT COUNT(i) FROM ProductItem i WHERE i.variant.id = :variantId")
    long countByVariantId(@Param("variantId") Long variantId);

    @Query("SELECT COUNT(i) FROM ProductItem i WHERE i.variant.product.id = :productId AND i.status = :status")
    long countByProductIdAndStatus(@Param("productId") Long productId, @Param("status") ProductItemStatus status);
}
