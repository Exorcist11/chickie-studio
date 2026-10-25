package com.chickiestudio.product.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ProductItemStatusTest {

    @Test
    @DisplayName("AVAILABLE can transition to RENTED, MAINTENANCE, and RETIRED")
    void availableTransitions() {
        assertTrue(ProductItemStatus.AVAILABLE.canTransitionTo(ProductItemStatus.AVAILABLE));
        assertTrue(ProductItemStatus.AVAILABLE.canTransitionTo(ProductItemStatus.RENTED));
        assertTrue(ProductItemStatus.AVAILABLE.canTransitionTo(ProductItemStatus.MAINTENANCE));
        assertTrue(ProductItemStatus.AVAILABLE.canTransitionTo(ProductItemStatus.RETIRED));
        assertFalse(ProductItemStatus.AVAILABLE.canTransitionTo(ProductItemStatus.LAUNDRY));
    }

    @Test
    @DisplayName("RENTED can only transition to LAUNDRY")
    void rentedTransitions() {
        assertTrue(ProductItemStatus.RENTED.canTransitionTo(ProductItemStatus.RENTED));
        assertTrue(ProductItemStatus.RENTED.canTransitionTo(ProductItemStatus.LAUNDRY));
        assertFalse(ProductItemStatus.RENTED.canTransitionTo(ProductItemStatus.AVAILABLE));
        assertFalse(ProductItemStatus.RENTED.canTransitionTo(ProductItemStatus.MAINTENANCE));
        assertFalse(ProductItemStatus.RENTED.canTransitionTo(ProductItemStatus.RETIRED));
    }

    @Test
    @DisplayName("LAUNDRY can transition to AVAILABLE or MAINTENANCE")
    void laundryTransitions() {
        assertTrue(ProductItemStatus.LAUNDRY.canTransitionTo(ProductItemStatus.LAUNDRY));
        assertTrue(ProductItemStatus.LAUNDRY.canTransitionTo(ProductItemStatus.AVAILABLE));
        assertTrue(ProductItemStatus.LAUNDRY.canTransitionTo(ProductItemStatus.MAINTENANCE));
        assertFalse(ProductItemStatus.LAUNDRY.canTransitionTo(ProductItemStatus.RENTED));
        assertFalse(ProductItemStatus.LAUNDRY.canTransitionTo(ProductItemStatus.RETIRED));
    }

    @Test
    @DisplayName("MAINTENANCE can transition to AVAILABLE or RETIRED")
    void maintenanceTransitions() {
        assertTrue(ProductItemStatus.MAINTENANCE.canTransitionTo(ProductItemStatus.MAINTENANCE));
        assertTrue(ProductItemStatus.MAINTENANCE.canTransitionTo(ProductItemStatus.AVAILABLE));
        assertTrue(ProductItemStatus.MAINTENANCE.canTransitionTo(ProductItemStatus.RETIRED));
        assertFalse(ProductItemStatus.MAINTENANCE.canTransitionTo(ProductItemStatus.RENTED));
        assertFalse(ProductItemStatus.MAINTENANCE.canTransitionTo(ProductItemStatus.LAUNDRY));
    }

    @Test
    @DisplayName("RETIRED cannot transition to any active status")
    void retiredTransitions() {
        assertTrue(ProductItemStatus.RETIRED.canTransitionTo(ProductItemStatus.RETIRED));
        assertTrue(ProductItemStatus.RETIRED.canTransitionTo(null));
        assertFalse(ProductItemStatus.RETIRED.canTransitionTo(ProductItemStatus.AVAILABLE));
        assertFalse(ProductItemStatus.RETIRED.canTransitionTo(ProductItemStatus.RENTED));
        assertFalse(ProductItemStatus.RETIRED.canTransitionTo(ProductItemStatus.LAUNDRY));
        assertFalse(ProductItemStatus.RETIRED.canTransitionTo(ProductItemStatus.MAINTENANCE));
    }
}
