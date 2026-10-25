package com.chickiestudio.product.repository;

import com.chickiestudio.product.entity.ProductItem;
import com.chickiestudio.product.entity.ProductItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
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

    List<ProductItem> findByVariantProductIdOrderByIdAsc(Long productId);

    List<ProductItem> findByVariantProductIdAndStatus(Long productId, ProductItemStatus status);

    @Query("SELECT COUNT(i) FROM ProductItem i WHERE i.variant.id = :variantId")
    long countByVariantId(@Param("variantId") Long variantId);

    @Query("SELECT COUNT(i) FROM ProductItem i WHERE i.variant.product.id = :productId AND i.status = :status")
    long countByProductIdAndStatus(@Param("productId") Long productId, @Param("status") ProductItemStatus status);
}
