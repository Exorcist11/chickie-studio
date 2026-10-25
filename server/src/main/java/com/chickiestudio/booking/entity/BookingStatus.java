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
     * Kiểm tra tính hợp lệ của việc chuyển đổi trạng thái đơn thuê.
     *
     * @param targetStatus Trạng thái đích muốn chuyển sang
     * @return true nếu chuyển đổi hợp lệ theo State Machine, false nếu vi phạm
     */
    public boolean canTransitionTo(BookingStatus targetStatus) {
        if (targetStatus == null || this == targetStatus) {
            return true;
        }

        return switch (this) {
            case PENDING -> Set.of(CONFIRMED, CANCELLED).contains(targetStatus);
            case CONFIRMED -> Set.of(DEPOSITED, CANCELLED).contains(targetStatus);
            case DEPOSITED -> Set.of(DELIVERED, CANCELLED).contains(targetStatus);
            case DELIVERED -> Set.of(RETURNED, OVERDUE).contains(targetStatus);
            case OVERDUE -> Set.of(RETURNED).contains(targetStatus);
            case RETURNED -> Set.of(COMPLETED).contains(targetStatus);
            case COMPLETED, CANCELLED -> false;
        };
    }
}
