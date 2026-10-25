package com.chickiestudio.content.service.impl;

import com.chickiestudio.category.dto.CategoryResponse;
import com.chickiestudio.category.service.CategoryService;
import com.chickiestudio.content.dto.FeaturedServiceDto;
import com.chickiestudio.content.dto.HeroBannerDto;
import com.chickiestudio.content.dto.HomeFeaturedResponse;
import com.chickiestudio.content.dto.RentalStepDto;
import com.chickiestudio.content.dto.TestimonialDto;
import com.chickiestudio.content.service.HomeFeaturedService;
import com.chickiestudio.product.dto.ProductListResponse;
import com.chickiestudio.product.entity.ProductStatus;
import com.chickiestudio.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HomeFeaturedServiceImpl implements HomeFeaturedService {

    private final CategoryService categoryService;
    private final ProductService productService;

    @Override
    @Transactional(readOnly = true)
    public HomeFeaturedResponse getHomeFeaturedData() {
        log.info("Fetching home featured data for client landing page");

        // 1. Fetch public categories
        List<CategoryResponse> categories = categoryService.getPublicCategories();

        // 2. Fetch top active products
        Page<ProductListResponse> productPage = productService.getProducts(
                null,
                null,
                ProductStatus.ACTIVE,
                null,
                PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        List<ProductListResponse> topProducts = productPage.getContent();

        // 3. Assemble curated Hero Banners
        List<HeroBannerDto> heroBanners = List.of(
                HeroBannerDto.builder()
                        .id(1)
                        .title("More than just a dress")
                        .subtitle("Váy cưới thiết kế & Maxi chụp ngoại cảnh")
                        .imageUrl("https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop")
                        .altText("Người mẫu mặc váy cưới thiết kế cầm hoa thanh lịch Chickie Studio")
                        .ctaText("Khám phá bộ sưu tập")
                        .ctaLink("/products")
                        .build(),
                HeroBannerDto.builder()
                        .id(2)
                        .title("Nét duyên truyền thống")
                        .subtitle("Áo dài kỷ yếu & sự kiện truyền thống")
                        .imageUrl("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop")
                        .altText("Áo dài cách tân hoa sen kỷ yếu thướt tha")
                        .ctaText("Xem bộ sưu tập áo dài")
                        .ctaLink("/products?type=costume")
                        .build(),
                HeroBannerDto.builder()
                        .id(3)
                        .title("Sang trọng & Quyến rũ")
                        .subtitle("Đầm dạ hội cao cấp sang trọng")
                        .imageUrl("https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&auto=format&fit=crop")
                        .altText("Đầm dạ hội satin sang trọng tiệc tối")
                        .ctaText("Xem đầm dạ hội")
                        .ctaLink("/products?type=costume")
                        .build()
        );

        // 4. Assemble core services
        List<FeaturedServiceDto> services = List.of(
                FeaturedServiceDto.builder()
                        .key("costume")
                        .title("Thuê trang phục")
                        .description("Đa dạng phong cách, từ dịu dàng nữ tính đến cá tính hiện đại.")
                        .imageUrl("https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop")
                        .link("/products?type=costume")
                        .build(),
                FeaturedServiceDto.builder()
                        .key("camera")
                        .title("Thuê máy ảnh")
                        .description("Thiết bị chuyên nghiệp, đa dạng thương hiệu, phụ kiện đầy đủ.")
                        .imageUrl("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop")
                        .link("/products?type=camera")
                        .build(),
                FeaturedServiceDto.builder()
                        .key("photography")
                        .title("Dịch vụ chụp ảnh")
                        .description("Các gói chụp đa dạng, concept độc đáo, đội ngũ nhiếp ảnh gia chuyên nghiệp.")
                        .imageUrl("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop")
                        .link("/products?type=photography")
                        .build()
        );

        // 5. Assemble 4-step rental process
        List<RentalStepDto> rentalSteps = List.of(
                RentalStepDto.builder()
                        .stepNumber(1)
                        .title("Chọn mẫu & size")
                        .description("Khám phá bộ sưu tập váy áo, máy ảnh và chọn dải ngày nhận/trả đồ thuận tiện.")
                        .icon("sparkles")
                        .build(),
                RentalStepDto.builder()
                        .stepNumber(2)
                        .title("Đặt cọc giữ đồ")
                        .description("Xác nhận thông tin, chuyển khoản cọc nhanh qua VietQR hoặc thanh toán trực tiếp.")
                        .icon("calendar")
                        .build(),
                RentalStepDto.builder()
                        .stepNumber(3)
                        .title("Nhận đồ xinh")
                        .description("Nhận đồ đã được giặt ủi thơm tho phẳng phiu tại tiệm hoặc giao tận nơi.")
                        .icon("camera")
                        .build(),
                RentalStepDto.builder()
                        .stepNumber(4)
                        .title("Trả đồ & hoàn cọc")
                        .description("Gửi trả đồ sau buổi chụp và nhận lại tiền cọc an toàn, nhanh chóng.")
                        .icon("check-circle")
                        .build()
        );

        // 6. Assemble customer testimonials
        List<TestimonialDto> testimonials = List.of(
                TestimonialDto.builder()
                        .id(1L)
                        .customerName("Nguyễn Thị Mai")
                        .role("Khách hàng thân thiết")
                        .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop")
                        .content("Dịch vụ tại Chickie Studio thật sự tuyệt vời! Trang phục đẹp, chất lượng, ekip chụp ảnh chuyên nghiệp và rất thân thiện. Mình chắc chắn sẽ quay lại!")
                        .rating(5)
                        .build()
        );

        return HomeFeaturedResponse.builder()
                .heroBanners(heroBanners)
                .categories(categories)
                .topProducts(topProducts)
                .services(services)
                .rentalSteps(rentalSteps)
                .testimonials(testimonials)
                .build();
    }
}
