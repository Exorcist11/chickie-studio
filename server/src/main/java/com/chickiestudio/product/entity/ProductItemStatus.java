package com.chickiestudio.product.entity;

import java.util.Set;

/**
 * Trạng thái vòng đời vật lý của một món đồ thực tế (CAT-003).
 */
public enum ProductItemStatus {
    AVAILABLE,     // Sẵn sàng cho thuê
    RENTED,        // Đang được khách thuê
    LAUNDRY,       // Đang giặt ủi tiệt trùng
    MAINTENANCE,   // Đang sửa chữa / bảo dưỡng thiết bị
    RETIRED;       // Đã ngừng cho thuê / thanh lý

    /**
     * Kiểm tra tính hợp lệ của việc chuyển đổi trạng thái (State Machine Guard).
     *
     * @param targetStatus Trạng thái đích muốn chuyển sang
     * @return true nếu hợp lệ, false nếu bất hợp lệ
     */
    public boolean canTransitionTo(ProductItemStatus targetStatus) {
        if (targetStatus == null || this == targetStatus) {
            return true;
        }

        return switch (this) {
            case AVAILABLE -> Set.of(RENTED, MAINTENANCE, RETIRED).contains(targetStatus);
            case RENTED -> Set.of(LAUNDRY).contains(targetStatus);
            case LAUNDRY -> Set.of(AVAILABLE, MAINTENANCE).contains(targetStatus);
            case MAINTENANCE -> Set.of(AVAILABLE, RETIRED).contains(targetStatus);
            case RETIRED -> false; // Trạng thái cuối, không thể phục hồi cho thuê
        };
    }
}
