-- V4__sync_admin_and_staff_accounts.sql
-- Dong bo mat khau chuan cho tai khoan admin (Admin@123456)
UPDATE `users`
SET `password_hash` = '$2a$10$muv62T7cd5EtJs86TvX..u10.hdrCpD3DW/La8BNDRgjRW6/DYePq',
    `full_name` = 'Quản Trị Viên Chickie',
    `role` = 'ROLE_ADMIN',
    `status` = 'ACTIVE',
    `failed_attempts` = 0,
    `locked_until` = NULL
WHERE `username` = 'admin';

-- Dong bo tai khoan staff mac dinh (Staff@123456) neu chua ton tai
INSERT INTO `users` (`username`, `email`, `password_hash`, `full_name`, `phone`, `role`, `status`)
SELECT 'staff', 'staff@chickiestudio.vn', '$2a$10$9xV7Vs2XV7G15hf8JhkJ.uSJ5X4b9KYUPScPpPnnZz8gIZuCplIey', 'Nhân Viên Vận Hành', '0907654321', 'ROLE_STAFF', 'ACTIVE'
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM `users` WHERE `username` = 'staff' OR `email` = 'staff@chickiestudio.vn'
);
