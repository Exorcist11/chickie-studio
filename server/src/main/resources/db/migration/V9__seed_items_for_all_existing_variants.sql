-- Migration V9: Khởi tạo các món đồ vật lý (product_items) cho toàn bộ biến thể sản phẩm hiện có
-- Description: Đảm bảo mọi biến thể sản phẩm đều có sẵn ít nhất 2 món đồ vật lý (Item Instances) khả dụng trong kho để khách có thể xem lịch trống và đặt thuê trực tuyến

INSERT INTO `product_items` (`variant_id`, `item_code`, `status`, `rental_count`, `note`)
SELECT pv.id, CONCAT(pv.sku, '-01'), 'AVAILABLE', 0, 'Sẵn sàng tại Studio Chickie'
FROM `product_variants` pv
WHERE NOT EXISTS (
    SELECT 1 FROM `product_items` pi WHERE pi.variant_id = pv.id
);

INSERT INTO `product_items` (`variant_id`, `item_code`, `status`, `rental_count`, `note`)
SELECT pv.id, CONCAT(pv.sku, '-02'), 'AVAILABLE', 1, 'Món đồ dự phòng sẵn sàng tại Studio Chickie'
FROM `product_variants` pv
WHERE (SELECT COUNT(*) FROM `product_items` pi WHERE pi.variant_id = pv.id) < 2;
