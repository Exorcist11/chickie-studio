-- Migration V13: Đánh composite index cho Timeline & Dispatch và bổ sung trường action cho audit trail (BOK-006)
-- Description: Tối ưu hóa truy vấn dòng thời gian kho đồ và lưu vết hành vi điều phối (Reassign, Reschedule)

ALTER TABLE `booking_status_histories`
ADD COLUMN `action` VARCHAR(50) NOT NULL DEFAULT 'STATUS_CHANGE' AFTER `to_status`;

CREATE INDEX `idx_booking_items_timeline_lookup` 
ON `booking_items` (`product_item_id`, `rental_start_date`, `rental_end_date`);
