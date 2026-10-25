package com.chickiestudio.booking.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class BookingStatusTest {

    @Test
    @DisplayName("canTransitionTo - PENDING chỉ có thể chuyển sang CONFIRMED hoặc CANCELLED")
    void pendingTransitions() {
        assertThat(BookingStatus.PENDING.canTransitionTo(BookingStatus.CONFIRMED)).isTrue();
        assertThat(BookingStatus.PENDING.canTransitionTo(BookingStatus.CANCELLED)).isTrue();
        assertThat(BookingStatus.PENDING.canTransitionTo(BookingStatus.PENDING)).isTrue();
        assertThat(BookingStatus.PENDING.canTransitionTo(null)).isTrue();

        assertThat(BookingStatus.PENDING.canTransitionTo(BookingStatus.DEPOSITED)).isFalse();
        assertThat(BookingStatus.PENDING.canTransitionTo(BookingStatus.DELIVERED)).isFalse();
        assertThat(BookingStatus.PENDING.canTransitionTo(BookingStatus.RETURNED)).isFalse();
        assertThat(BookingStatus.PENDING.canTransitionTo(BookingStatus.COMPLETED)).isFalse();
        assertThat(BookingStatus.PENDING.canTransitionTo(BookingStatus.OVERDUE)).isFalse();
    }

    @Test
    @DisplayName("canTransitionTo - CONFIRMED chỉ có thể chuyển sang DEPOSITED hoặc CANCELLED")
    void confirmedTransitions() {
        assertThat(BookingStatus.CONFIRMED.canTransitionTo(BookingStatus.DEPOSITED)).isTrue();
        assertThat(BookingStatus.CONFIRMED.canTransitionTo(BookingStatus.CANCELLED)).isTrue();
        assertThat(BookingStatus.CONFIRMED.canTransitionTo(BookingStatus.DELIVERED)).isFalse();
        assertThat(BookingStatus.CONFIRMED.canTransitionTo(BookingStatus.RETURNED)).isFalse();
        assertThat(BookingStatus.CONFIRMED.canTransitionTo(BookingStatus.COMPLETED)).isFalse();
    }

    @Test
    @DisplayName("canTransitionTo - DEPOSITED chỉ có thể chuyển sang DELIVERED hoặc CANCELLED")
    void depositedTransitions() {
        assertThat(BookingStatus.DEPOSITED.canTransitionTo(BookingStatus.DELIVERED)).isTrue();
        assertThat(BookingStatus.DEPOSITED.canTransitionTo(BookingStatus.CANCELLED)).isTrue();
        assertThat(BookingStatus.DEPOSITED.canTransitionTo(BookingStatus.RETURNED)).isFalse();
        assertThat(BookingStatus.DEPOSITED.canTransitionTo(BookingStatus.COMPLETED)).isFalse();
    }

    @Test
    @DisplayName("canTransitionTo - DELIVERED chỉ có thể chuyển sang RETURNED hoặc OVERDUE")
    void deliveredTransitions() {
        assertThat(BookingStatus.DELIVERED.canTransitionTo(BookingStatus.RETURNED)).isTrue();
        assertThat(BookingStatus.DELIVERED.canTransitionTo(BookingStatus.OVERDUE)).isTrue();
        assertThat(BookingStatus.DELIVERED.canTransitionTo(BookingStatus.CANCELLED)).isFalse();
        assertThat(BookingStatus.DELIVERED.canTransitionTo(BookingStatus.COMPLETED)).isFalse();
    }

    @Test
    @DisplayName("canTransitionTo - OVERDUE chỉ có thể chuyển sang RETURNED")
    void overdueTransitions() {
        assertThat(BookingStatus.OVERDUE.canTransitionTo(BookingStatus.RETURNED)).isTrue();
        assertThat(BookingStatus.OVERDUE.canTransitionTo(BookingStatus.DELIVERED)).isFalse();
        assertThat(BookingStatus.OVERDUE.canTransitionTo(BookingStatus.COMPLETED)).isFalse();
    }

    @Test
    @DisplayName("canTransitionTo - RETURNED chỉ có thể chuyển sang COMPLETED")
    void returnedTransitions() {
        assertThat(BookingStatus.RETURNED.canTransitionTo(BookingStatus.COMPLETED)).isTrue();
        assertThat(BookingStatus.RETURNED.canTransitionTo(BookingStatus.PENDING)).isFalse();
        assertThat(BookingStatus.RETURNED.canTransitionTo(BookingStatus.DELIVERED)).isFalse();
    }

    @Test
    @DisplayName("canTransitionTo - COMPLETED và CANCELLED là trạng thái kết thúc, không thể chuyển đổi tiếp")
    void terminalStates() {
        for (BookingStatus target : BookingStatus.values()) {
            if (target != BookingStatus.COMPLETED) {
                assertThat(BookingStatus.COMPLETED.canTransitionTo(target)).isFalse();
            }
            if (target != BookingStatus.CANCELLED) {
                assertThat(BookingStatus.CANCELLED.canTransitionTo(target)).isFalse();
            }
        }
    }
}
