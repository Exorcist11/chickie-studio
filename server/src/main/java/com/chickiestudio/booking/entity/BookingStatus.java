package com.chickiestudio.booking.entity;

import java.util.Set;

/**
 * Trạng thái của đơn đặt thuê (BOK-003 State Machine).
 */
public enum BookingStatus {
    PENDING,
    CONFIRMED,
    DEPOSITED,
    DELIVERED,
    RETURNED,
    COMPLETED,
    CANCELLED,
    OVERDUE;

    /**
     * Lấy tập hợp các trạng thái hợp lệ kế tiếp mà trạng thái hiện tại có thể chuyển sang (BOK-003).
     *
     * @return Set các trạng thái kế tiếp được phép chuyển đổi
     */
    public Set<BookingStatus> getValidNextStatuses() {
        return switch (this) {
            case PENDING -> Set.of(CONFIRMED, CANCELLED);
            case CONFIRMED -> Set.of(DEPOSITED, CANCELLED);
            case DEPOSITED -> Set.of(DELIVERED, CANCELLED);
            case DELIVERED -> Set.of(RETURNED, OVERDUE);
            case OVERDUE -> Set.of(RETURNED);
            case RETURNED -> Set.of(COMPLETED);
            case COMPLETED, CANCELLED -> Set.of();
        };
    }

    /**
     * Kiểm tra tính hợp lệ của việc chuyển đổi trạng thái đơn thuê.
     *
     * @param targetStatus Trạng thái đích muốn chuyển sang
     * @return true nếu chuyển đổi hợp lệ theo State Machine, false nếu vi phạm
     */
    public boolean canTransitionTo(BookingStatus targetStatus) {
        if (targetStatus == null || this == targetStatus) {
            return true;
        }

        return getValidNextStatuses().contains(targetStatus);
    }
}
