package com.chickiestudio.common.config;

import com.chickiestudio.category.entity.Category;
import com.chickiestudio.category.repository.CategoryRepository;
import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.User;
import com.chickiestudio.user.entity.UserStatus;
import com.chickiestudio.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    public static final String DEFAULT_ADMIN_PASSWORD_HASH = "$2a$10$muv62T7cd5EtJs86TvX..u10.hdrCpD3DW/La8BNDRgjRW6/DYePq";
    public static final String DEFAULT_STAFF_PASSWORD_HASH = "$2a$10$9xV7Vs2XV7G15hf8JhkJ.uSJ5X4b9KYUPScPpPnnZz8gIZuCplIey";
    private static final String LEGACY_INVALID_ADMIN_HASH = "$2a$10$w09b4vM2j5O8L4q7i3d7OuhX8yC0y8a7m2y6T4o1s3e5r7u9i1a2C";

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        initUsers();
        initCategories();
    }

    private void initUsers() {
        userRepository.findByUsernameOrEmail("admin").ifPresentOrElse(
                admin -> {
                    if (LEGACY_INVALID_ADMIN_HASH.equals(admin.getPasswordHash())) {
                        admin.setPasswordHash(DEFAULT_ADMIN_PASSWORD_HASH);
                        admin.setStatus(UserStatus.ACTIVE);
                        admin.setFailedAttempts(0);
                        admin.setLockedUntil(null);
                        userRepository.save(admin);
                        log.info("Synchronized legacy admin password hash to standard Admin@123456");
                    }
                },
                () -> {
                    User admin = User.builder()
                            .username("admin")
                            .email("admin@chickiestudio.vn")
                            .passwordHash(DEFAULT_ADMIN_PASSWORD_HASH)
                            .fullName("Quản Trị Viên Chickie")
                            .phone("0901234567")
                            .role(Role.ROLE_ADMIN)
                            .status(UserStatus.ACTIVE)
                            .build();
                    userRepository.save(admin);
                    log.info("Default admin account created with standard credentials (admin / Admin@123456)");
                }
        );

        if (userRepository.findByUsernameOrEmail("staff").isEmpty()) {
            User staff = User.builder()
                    .username("staff")
                    .email("staff@chickiestudio.vn")
                    .passwordHash(DEFAULT_STAFF_PASSWORD_HASH)
                    .fullName("Nhân Viên Vận Hành")
                    .phone("0907654321")
                    .role(Role.ROLE_STAFF)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(staff);
            log.info("Default staff account created with standard credentials (staff / Staff@123456)");
        }
    }

    private void initCategories() {
        if (categoryRepository.count() == 0) {
            log.info("Seeding initial categories for Chickie Studio (Dev mode)...");

            List<Category> defaultCategories = List.of(
                    Category.builder()
                            .name("Váy Thiết Kế")
                            .slug("vay-thiet-ke")
                            .description("Bộ sưu tập váy thiết kế cao cấp cho chụp ảnh ngoại cảnh, kỷ yếu")
                            .iconUrl("Sparkles")
                            .displayOrder(1)
                            .isActive(true)
                            .build(),
                    Category.builder()
                            .name("Áo Dài Truyền Thống & Cách Tân")
                            .slug("ao-dai")
                            .description("Áo dài thêu tay, áo dài cách tân lễ tết và sự kiện")
                            .iconUrl("Flower2")
                            .displayOrder(2)
                            .isActive(true)
                            .build(),
                    Category.builder()
                            .name("Đầm Dạ Hội & Tiệc")
                            .slug("dam-da-hoi")
                            .description("Đầm dạ hội lộng lẫy, sang trọng cho sự kiện và tiệc tối")
                            .iconUrl("Crown")
                            .displayOrder(3)
                            .isActive(true)
                            .build(),
                    Category.builder()
                            .name("Máy Ảnh Du Lịch & Phụ Kiện")
                            .slug("may-anh-du-lich")
                            .description("Máy ảnh Sony, Fujifilm, Canon kèm lens chụp ảnh sắc nét")
                            .iconUrl("Camera")
                            .displayOrder(4)
                            .isActive(true)
                            .build(),
                    Category.builder()
                            .name("Phụ Kiện Chụp Ảnh")
                            .slug("phu-kien")
                            .description("Túi xách, nón cói, hoa lụa, phụ kiện phối đồ ấn tượng")
                            .iconUrl("ShoppingBag")
                            .displayOrder(5)
                            .isActive(true)
                            .build()
            );

            categoryRepository.saveAll(defaultCategories);
            log.info("Initial categories seeded successfully (5 categories)");
        }
    }
}
