package com.chickiestudio.product.entity;

import com.chickiestudio.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Đại diện cho một món đồ vật lý cụ thể (Item Instance) được gắn tem Barcode trong kho (CAT-003).
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product_items")
public class ProductItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Column(name = "item_code", nullable = false, unique = true, length = 50)
    private String itemCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ProductItemStatus status = ProductItemStatus.AVAILABLE;

    @Column(name = "rental_count", nullable = false)
    @Builder.Default
    private int rentalCount = 0;

    @Column(length = 255)
    private String note;

    /**
     * Tăng số lần thuê thực tế khi món đồ hoàn thành 1 chu kỳ thuê.
     */
    public void incrementRentalCount() {
        this.rentalCount++;
    }
}
