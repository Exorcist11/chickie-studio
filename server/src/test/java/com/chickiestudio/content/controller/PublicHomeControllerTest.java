package com.chickiestudio.content.controller;

import com.chickiestudio.auth.security.JwtAuthenticationFilter;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.security.SecurityConfig;
import com.chickiestudio.category.dto.CategoryResponse;
import com.chickiestudio.category.entity.CategoryType;
import com.chickiestudio.common.exception.GlobalExceptionHandler;
import com.chickiestudio.content.dto.FeaturedServiceDto;
import com.chickiestudio.content.dto.HeroBannerDto;
import com.chickiestudio.content.dto.HomeFeaturedResponse;
import com.chickiestudio.content.dto.RentalStepDto;
import com.chickiestudio.content.dto.TestimonialDto;
import com.chickiestudio.content.service.HomeFeaturedService;
import com.chickiestudio.product.dto.ProductListResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicHomeController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class PublicHomeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HomeFeaturedService homeFeaturedService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("GET /api/public/home/featured - Khách truy cập lấy dữ liệu trang chủ thành công (200 OK)")
    void getHomeFeatured_Success() throws Exception {
        // Given
        HomeFeaturedResponse response = HomeFeaturedResponse.builder()
                .heroBanners(List.of(
                        HeroBannerDto.builder()
                                .id(1)
                                .title("More than just a dress")
                                .subtitle("Váy cưới thiết kế & Maxi chụp ngoại cảnh")
                                .imageUrl("https://images.unsplash.com/photo-1595777457583-95e059d581b8")
                                .altText("Banner váy cưới")
                                .ctaText("Khám phá ngay")
                                .ctaLink("/products")
                                .build()
                ))
                .categories(List.of(
                        new CategoryResponse(
                                1L,
                                "Váy Dạ Hội",
                                "vay-da-hoi",
                                CategoryType.COSTUME,
                                "Mô tả",
                                null,
                                1,
                                true,
                                LocalDateTime.now(),
                                LocalDateTime.now()
                        )
                ))
                .topProducts(List.of(
                        ProductListResponse.builder()
                                .id(101L)
                                .name("Đầm Lụa Satin")
                                .slug("dam-lua-satin")
                                .rentalPrice(new BigDecimal("350000"))
                                .build()
                ))
                .services(List.of(
                        FeaturedServiceDto.builder()
                                .key("costume")
                                .title("Thuê trang phục")
                                .link("/products?type=costume")
                                .build()
                ))
                .rentalSteps(List.of(
                        RentalStepDto.builder()
                                .stepNumber(1)
                                .title("Chọn mẫu & size")
                                .icon("sparkles")
                                .build()
                ))
                .testimonials(List.of(
                        TestimonialDto.builder()
                                .id(1L)
                                .customerName("Nguyễn Thị Mai")
                                .rating(5)
                                .build()
                ))
                .build();

        when(homeFeaturedService.getHomeFeaturedData()).thenReturn(response);

        // When & Then
        mockMvc.perform(get("/api/public/home/featured")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("SUCCESS"))
                .andExpect(jsonPath("$.data.heroBanners[0].title").value("More than just a dress"))
                .andExpect(jsonPath("$.data.categories[0].name").value("Váy Dạ Hội"))
                .andExpect(jsonPath("$.data.topProducts[0].name").value("Đầm Lụa Satin"))
                .andExpect(jsonPath("$.data.services[0].key").value("costume"))
                .andExpect(jsonPath("$.data.rentalSteps[0].stepNumber").value(1))
                .andExpect(jsonPath("$.data.testimonials[0].customerName").value("Nguyễn Thị Mai"));

        verify(homeFeaturedService).getHomeFeaturedData();
    }
}
