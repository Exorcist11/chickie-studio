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
    private final com.chickiestudio.product.repository.ProductRepository productRepository;

    @Override
    public void run(String... args) {
        initUsers();
        initCategories();
        initProducts();
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
                            .type(com.chickiestudio.category.entity.CategoryType.COSTUME)
                            .description("Bộ sưu tập váy thiết kế cao cấp cho chụp ảnh ngoại cảnh, kỷ yếu")
                            .iconUrl("Sparkles")
                            .displayOrder(1)
                            .isActive(true)
                            .build(),
                    Category.builder()
                            .name("Áo Dài Truyền Thống & Cách Tân")
                            .slug("ao-dai")
                            .type(com.chickiestudio.category.entity.CategoryType.COSTUME)
                            .description("Áo dài thêu tay, áo dài cách tân lễ tết và sự kiện")
                            .iconUrl("Flower2")
                            .displayOrder(2)
                            .isActive(true)
                            .build(),
                    Category.builder()
                            .name("Đầm Dạ Hội & Tiệc")
                            .slug("dam-da-hoi")
                            .type(com.chickiestudio.category.entity.CategoryType.COSTUME)
                            .description("Đầm dạ hội lộng lẫy, sang trọng cho sự kiện và tiệc tối")
                            .iconUrl("Crown")
                            .displayOrder(3)
                            .isActive(true)
                            .build(),
                    Category.builder()
                            .name("Máy Ảnh Du Lịch & Phụ Kiện")
                            .slug("may-anh-du-lich")
                            .type(com.chickiestudio.category.entity.CategoryType.CAMERA)
                            .description("Máy ảnh Sony, Fujifilm, Canon kèm lens chụp ảnh sắc nét")
                            .iconUrl("Camera")
                            .displayOrder(4)
                            .isActive(true)
                            .build(),
                    Category.builder()
                            .name("Phụ Kiện Chụp Ảnh")
                            .slug("phu-kien")
                            .type(com.chickiestudio.category.entity.CategoryType.COSTUME)
                            .description("Túi xách, nón cói, hoa lụa, phụ kiện phối đồ ấn tượng")
                            .iconUrl("ShoppingBag")
                            .displayOrder(5)
                            .isActive(true)
                            .build(),
                    Category.builder()
                            .name("Gói Chụp Ngoại Cảnh & Kỷ Yếu")
                            .slug("chup-anh-ngoai-canh")
                            .type(com.chickiestudio.category.entity.CategoryType.PHOTOGRAPHY)
                            .description("Gói chụp ảnh ngoại cảnh, kỷ yếu thanh xuân, du lịch với nhiếp ảnh gia chuyên nghiệp")
                            .iconUrl("Camera")
                            .displayOrder(6)
                            .isActive(true)
                            .build(),
                    Category.builder()
                            .name("Gói Chụp Concept Studio & Lookbook")
                            .slug("chup-anh-studio")
                            .type(com.chickiestudio.category.entity.CategoryType.PHOTOGRAPHY)
                            .description("Gói chụp studio ánh sáng nghệ thuật, lookbook cá nhân, kỷ niệm sinh nhật")
                            .iconUrl("Sparkles")
                            .displayOrder(7)
                            .isActive(true)
                            .build()
            );

            categoryRepository.saveAll(defaultCategories);
            log.info("Initial categories seeded successfully (7 categories)");
        }
    }

    private void initProducts() {
        if (productRepository.count() <= 1) {
            log.info("Seeding initial products for Chickie Studio (Dev mode - 3 business pillars)...");

            var catVay = categoryRepository.findBySlug("vay-thiet-ke").orElse(null);
            var catAoDai = categoryRepository.findBySlug("ao-dai").orElse(null);
            var catDam = categoryRepository.findBySlug("dam-da-hoi").orElse(null);
            var catMayAnh = categoryRepository.findBySlug("may-anh-du-lich").orElse(null);
            var catChupNgoaiCanh = categoryRepository.findBySlug("chup-anh-ngoai-canh").orElse(null);
            var catChupStudio = categoryRepository.findBySlug("chup-anh-studio").orElse(null);

            if (catMayAnh != null) {
                // 1. Máy ảnh Sony A6400
                createSeedProduct(
                        catMayAnh,
                        "MA-005",
                        "Combo Máy ảnh Sony A6400 kèm lens 50mm f1.8 du lịch chân dung",
                        "combo-sony-a6400-lens-50mm",
                        "Bộ máy ảnh Sony A6400 cảm biến APS-C 24.2MP lấy nét siêu nhanh 0.02s, đi kèm lens chân dung Sony 50mm f1.8 OSS xóa phông mù mịt. Tặng kèm thẻ nhớ 64GB tốc độ cao, 2 pin và túi chống sốc.",
                        "Thiết bị máy ảnh Mirrorless Sony",
                        "Chụp ảnh ngoại cảnh, du lịch, chân dung, kỷ yếu",
                        new java.math.BigDecimal("290000.00"),
                        new java.math.BigDecimal("2000000.00"),
                        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop"
                );

                // 2. Máy ảnh Canon EOS R50
                createSeedProduct(
                        catMayAnh,
                        "MA-006",
                        "Máy ảnh Canon EOS R50 kèm lens Kit 18-45mm STM đa dụng",
                        "canon-eos-r50-lens-18-45mm",
                        "Canon EOS R50 màu trắng thanh lịch, nhẹ chỉ 375g, màn hình lật xoay cảm ứng, màu da chụp người cực nịnh mắt chuẩn Canon. Đi kèm 2 pin, thẻ nhớ 64GB và túi đựng.",
                        "Thiết bị máy ảnh Mirrorless Canon",
                        "Du lịch dã ngoại, chụp lookbook, quay tiktok/vlog",
                        new java.math.BigDecimal("270000.00"),
                        new java.math.BigDecimal("1800000.00"),
                        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop"
                );

                // 3. Máy ảnh Fujifilm X-T30 II
                createSeedProduct(
                        catMayAnh,
                        "MA-007",
                        "Máy ảnh Fujifilm X-T30 II kèm lens XF 35mm f2 tone màu Film vintage",
                        "fujifilm-x-t30-ii-lens-35mm",
                        "Thiết kế hoài cổ đậm chất vintage với 18 giả lập màu film trứ danh của Fujifilm (Classic Chrome, Nostalgic Neg). Chụp ăn liền không cần chỉnh sửa hậu kỳ.",
                        "Thiết bị máy ảnh Mirrorless Fujifilm",
                        "Chụp ảnh dạo phố, cà phê, kỷ niệm phong cách retro hoài niệm",
                        new java.math.BigDecimal("320000.00"),
                        new java.math.BigDecimal("2500000.00"),
                        "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop"
                );
            }

            if (catChupNgoaiCanh != null) {
                // 4. Gói chụp ngoại cảnh Nàng Thơ
                createSeedProduct(
                        catChupNgoaiCanh,
                        "DV-001",
                        "Gói Chụp Ngoại Cảnh Nàng Thơ 2 Giờ (Nhiếp ảnh gia + 20 ảnh Retouch)",
                        "goi-chup-ngoai-canh-nang-tho",
                        "Gói dịch vụ chụp ảnh ngoại cảnh 2 giờ tại các địa điểm thơ mộng Hà Nội (Hồ Tây, Phố Cổ, Bãi đá Sông Hồng). Đội ngũ photographer nhiệt tình hướng dẫn tạo dáng từ A-Z, trả toàn bộ file gốc và 20 ảnh photoshop kỹ lưỡng.",
                        "Gói dịch vụ chụp ảnh trọn gói",
                        "Chụp ảnh cá nhân kỷ niệm, sinh nhật, dạo phố nàng thơ",
                        new java.math.BigDecimal("890000.00"),
                        new java.math.BigDecimal("300000.00"),
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop"
                );

                // 5. Gói chụp kỷ yếu Thanh Xuân
                createSeedProduct(
                        catChupNgoaiCanh,
                        "DV-002",
                        "Gói Chụp Kỷ Yếu Nhóm Bạn Thân Thanh Xuân (Kèm thợ chụp + 40 ảnh Retouch)",
                        "goi-chup-ky-yeu-thanh-xuan",
                        "Gói chụp dành cho nhóm bạn thân từ 2-5 người. 3 tiếng chụp ảnh năng động, sáng tạo concept học đường hoặc phong cách Hàn Quốc trẻ trung. Tặng kèm video ngắn recap buổi chụp.",
                        "Gói dịch vụ chụp ảnh nhóm",
                        "Chụp ảnh kỷ yếu tốt nghiệp, thanh xuân vườn trường, nhóm bạn",
                        new java.math.BigDecimal("1490000.00"),
                        new java.math.BigDecimal("500000.00"),
                        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop"
                );
            }

            if (catChupStudio != null) {
                // 6. Gói chụp Studio Lookbook Nghệ Thuật
                createSeedProduct(
                        catChupStudio,
                        "DV-003",
                        "Gói Chụp Concept Studio Lookbook Cá Nhân (Studio chuyên nghiệp + Makeup)",
                        "goi-chup-studio-lookbook-ca-nhan",
                        "Buổi chụp chuyên nghiệp trong phòng studio trang bị đèn flash Godox hiện đại, phông màu đa dạng. Đã bao gồm thợ trang điểm làm tóc makeup nghệ thuật và 15 ảnh chỉnh sửa da chuyên sâu.",
                        "Gói dịch vụ studio nghệ thuật",
                        "Chụp ảnh profile, avatar nghệ thuật, lookbook thời trang",
                        new java.math.BigDecimal("1200000.00"),
                        new java.math.BigDecimal("400000.00"),
                        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop"
                );
            }

            if (catAoDai != null && !productRepository.existsBySlug("ao-dai-cach-tan-hoa-sen")) {
                createSeedProduct(
                        catAoDai,
                        "AD-002",
                        "Áo dài cách tân hoa sen thêu tay kỷ yếu thanh lịch",
                        "ao-dai-cach-tan-hoa-sen",
                        "Thiết kế áo dài cách tân trẻ trung, đính kết hoa sen thêu tay thủ công tỉ mỉ trên nền vải tơ lụa mềm mại mát dịu. Phù hợp cho dịp chụp kỷ yếu và dạo phố mùa thu.",
                        "Tơ lụa mềm mại cao cấp",
                        "Kỷ yếu học sinh sinh viên, du xuân, chụp ảnh lễ hội",
                        new java.math.BigDecimal("190000.00"),
                        new java.math.BigDecimal("500000.00"),
                        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop"
                );
            }

            log.info("Products seeded successfully for 3 business pillars!");
        }
    }

    private void createSeedProduct(
            Category category,
            String code,
            String name,
            String slug,
            String desc,
            String material,
            String occasion,
            java.math.BigDecimal rentalPrice,
            java.math.BigDecimal depositPrice,
            String imgUrl
    ) {
        if (productRepository.existsByProductCode(code) || productRepository.existsBySlug(slug)) {
            return;
        }

        var product = com.chickiestudio.product.entity.Product.builder()
                .category(category)
                .productCode(code)
                .name(name)
                .slug(slug)
                .description(desc)
                .material(material)
                .occasion(occasion)
                .rentalPrice(rentalPrice)
                .depositPrice(depositPrice)
                .status(com.chickiestudio.product.entity.ProductStatus.ACTIVE)
                .build();

        product.addImage(com.chickiestudio.product.entity.ProductImage.builder()
                .imageUrl(imgUrl)
                .isThumbnail(true)
                .displayOrder(1)
                .build());

        product.addVariant(com.chickiestudio.product.entity.ProductVariant.builder()
                .size("Free")
                .color("Tiêu chuẩn")
                .sku(code + "-STD")
                .build());

        productRepository.save(product);
    }
}
