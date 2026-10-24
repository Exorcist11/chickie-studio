package com.chickiestudio.product.repository;

import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    Optional<Product> findByProductCode(String productCode);

    boolean existsByProductCode(String productCode);

    boolean existsByProductCodeAndIdNot(String productCode, Long id);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    @Query(value = """
        SELECT p FROM Product p
        JOIN FETCH p.category c
        WHERE (:categoryId IS NULL OR c.id = :categoryId)
          AND (:status IS NULL OR p.status = :status)
          AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
                             OR LOWER(p.productCode) LIKE LOWER(CONCAT('%', :search, '%')))
        """,
        countQuery = """
        SELECT COUNT(p) FROM Product p
        WHERE (:categoryId IS NULL OR p.category.id = :categoryId)
          AND (:status IS NULL OR p.status = :status)
          AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
                             OR LOWER(p.productCode) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Product> searchProducts(
            @Param("categoryId") Long categoryId,
            @Param("status") ProductStatus status,
            @Param("search") String search,
            Pageable pageable
    );
}
