-- Migration V11: Add composite index for booking tracking (BOK-005)
ALTER TABLE `bookings` ADD INDEX `idx_bookings_tracking` (`booking_code`, `customer_phone`);
