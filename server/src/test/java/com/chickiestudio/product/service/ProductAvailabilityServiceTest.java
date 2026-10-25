package com.chickiestudio.product.service;

import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.booking.entity.BookingItem;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.repository.BookingItemRepository;
import com.chickiestudio.category.entity.Category;
import com.chickiestudio.category.entity.CategoryType;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.product.dto.DayAvailabilityDto;
import com.chickiestudio.product.dto.ProductAvailabilityResponse;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductItem;
import com.chickiestudio.product.entity.ProductItemStatus;
import com.chickiestudio.product.entity.ProductVariant;
import com.chickiestudio.product.repository.ProductItemRepository;
import com.chickiestudio.product.repository.ProductRepository;
import com.chickiestudio.product.repository.ProductVariantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductAvailabilityServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private ProductItemRepository productItemRepository;

    @Mock
    private BookingItemRepository bookingItemRepository;

    @InjectMocks
    private ProductAvailabilityService availabilityService;

    private Product testProduct;
    private ProductVariant testVariant;
    private ProductItem item1;
    private ProductItem item2;

    @BeforeEach
    void setUp() {
        Category category = Category.builder()
                .id(1L)
                .name("Váy Dạ Hội")
                .type(CategoryType.COSTUME)
                .build();

        testProduct = Product.builder()
                .id(10L)
                .name("Váy Dạ Hội Kim Sa Đỏ")
                .slug("vay-da-hoi-kim-sa-do")
                .rentalPrice(new BigDecimal("350000"))
                .depositPrice(new BigDecimal("500000"))
                .category(category)
                .build();

        testVariant = ProductVariant.builder()
                .id(101L)
                .product(testProduct)
                .size("S")
                .color("Đỏ")
                .sku("VAY-RED-S")
                .build();

        item1 = ProductItem.builder()
                .id(1001L)
                .variant(testVariant)
                .itemCode("VAY-RED-S-01")
                .status(ProductItemStatus.AVAILABLE)
                .build();

        item2 = ProductItem.builder()
                .id(1002L)
                .variant(testVariant)
                .itemCode("VAY-RED-S-02")
                .status(ProductItemStatus.AVAILABLE)
                .build();
    }

    @Test
    @DisplayName("Kiểm tra lịch trống thành công khi chưa có ai đặt trong tháng tương lai")
    void checkAvailability_Success_WhenNoBookings() {
        // Cho tháng tương lai xa để tránh PAST_DATE
        String futureMonth = LocalDate.now().plusMonths(2).getYear() + "-" +
                String.format("%02d", LocalDate.now().plusMonths(2).getMonthValue());

        when(productRepository.findBySlug("vay-da-hoi-kim-sa-do")).thenReturn(Optional.of(testProduct));
        when(productVariantRepository.findById(101L)).thenReturn(Optional.of(testVariant));
        when(productItemRepository.findByVariantIdOrderByIdAsc(101L)).thenReturn(List.of(item1, item2));
        when(bookingItemRepository.findOverlappingItems(eq(101L), any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(Collections.emptyList());

        ProductAvailabilityResponse response = availabilityService.checkAvailability(
                "vay-da-hoi-kim-sa-do", 101L, futureMonth
        );

        assertThat(response).isNotNull();
        assertThat(response.getProductId()).isEqualTo(10L);
        assertThat(response.getVariantId()).isEqualTo(101L);
        assertThat(response.getTotalItems()).isEqualTo(2);
        assertThat(response.getAvailableItems()).isEqualTo(2);
        assertThat(response.getBufferDays()).isEqualTo(1); // category là DRESS -> 1 ngày đệm

        // Tất cả ngày trong tháng tương lai đều có reason là AVAILABLE
        assertThat(response.getDays()).isNotEmpty();
        assertThat(response.getDays().get(0).isAvailable()).isTrue();
        assertThat(response.getDays().get(0).getRemainingCount()).isEqualTo(2);
        assertThat(response.getDays().get(0).getReason()).isEqualTo("AVAILABLE");
    }

    @Test
    @DisplayName("Tính toán ngày bận có cộng thêm ngày đệm giặt ủi bufferDays = 1")
    void checkAvailability_BufferDaysApplied_ForCostumes() {
        YearMonth targetMonth = YearMonth.from(LocalDate.now().plusMonths(3));
        String monthStr = targetMonth.toString();
        LocalDate startDate = targetMonth.atDay(10);
        LocalDate endDate = targetMonth.atDay(12);

        // Giả sử item1 và item2 đều bị đặt từ ngày 10 đến ngày 12
        Booking booking = Booking.builder().id(1L).status(BookingStatus.CONFIRMED).build();
        BookingItem bi1 = BookingItem.builder()
                .id(1L)
                .booking(booking)
                .productItem(item1)
                .variant(testVariant)
                .rentalStartDate(startDate)
                .rentalEndDate(endDate)
                .build();
        BookingItem bi2 = BookingItem.builder()
                .id(2L)
                .booking(booking)
                .productItem(item2)
                .variant(testVariant)
                .rentalStartDate(startDate)
                .rentalEndDate(endDate)
                .build();

        when(productRepository.findBySlug("vay-da-hoi-kim-sa-do")).thenReturn(Optional.of(testProduct));
        when(productVariantRepository.findById(101L)).thenReturn(Optional.of(testVariant));
        when(productItemRepository.findByVariantIdOrderByIdAsc(101L)).thenReturn(List.of(item1, item2));
        when(bookingItemRepository.findOverlappingItems(eq(101L), any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(List.of(bi1, bi2));

        ProductAvailabilityResponse response = availabilityService.checkAvailability(
                "vay-da-hoi-kim-sa-do", 101L, monthStr
        );

        // Ngày 10, 11, 12 là ngày thuê -> Fully booked
        DayAvailabilityDto day10 = response.getDays().stream()
                .filter(d -> d.getDate().equals(startDate))
                .findFirst().orElseThrow();
        assertThat(day10.isAvailable()).isFalse();
        assertThat(day10.getRemainingCount()).isEqualTo(0);
        assertThat(day10.getReason()).isEqualTo("FULLY_BOOKED");

        // Ngày 13 là ngày đệm giặt ủi (endDate + 1 ngày buffer) -> cũng bị FULLY_BOOKED
        DayAvailabilityDto day13 = response.getDays().stream()
                .filter(d -> d.getDate().equals(endDate.plusDays(1)))
                .findFirst().orElseThrow();
        assertThat(day13.isAvailable()).isFalse();
        assertThat(day13.getRemainingCount()).isEqualTo(0);
        assertThat(day13.getReason()).isEqualTo("FULLY_BOOKED");

        // Ngày 14 đã sạch đồ -> AVAILABLE trở lại với 2 chiếc
        DayAvailabilityDto day14 = response.getDays().stream()
                .filter(d -> d.getDate().equals(endDate.plusDays(2)))
                .findFirst().orElseThrow();
        assertThat(day14.isAvailable()).isTrue();
        assertThat(day14.getRemainingCount()).isEqualTo(2);
    }

    @Test
    @DisplayName("Dịch vụ chụp ảnh PHOTOGRAPHY có bufferDays = 0")
    void checkAvailability_BufferDaysZero_Photography() {
        Category photoCat = Category.builder()
                .id(2L)
                .name("Chụp Ảnh Studio")
                .type(CategoryType.PHOTOGRAPHY)
                .build();
        testProduct.setCategory(photoCat);

        when(productRepository.findBySlug("vay-da-hoi-kim-sa-do")).thenReturn(Optional.of(testProduct));
        when(productVariantRepository.findById(101L)).thenReturn(Optional.of(testVariant));
        when(productItemRepository.findByVariantIdOrderByIdAsc(101L)).thenReturn(List.of(item1));
        when(bookingItemRepository.findOverlappingItems(eq(101L), any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(Collections.emptyList());

        ProductAvailabilityResponse response = availabilityService.checkAvailability(
                "vay-da-hoi-kim-sa-do", 101L, "2026-11"
        );

        assertThat(response.getBufferDays()).isEqualTo(0);
    }

    @Test
    @DisplayName("Báo MAINTENANCE khi tất cả món đồ trong kho đều hỏng hoặc đang sửa chữa")
    void checkAvailability_Maintenance_WhenAllItemsDamaged() {
        item1.setStatus(ProductItemStatus.MAINTENANCE);
        item2.setStatus(ProductItemStatus.RETIRED);

        when(productRepository.findBySlug("vay-da-hoi-kim-sa-do")).thenReturn(Optional.of(testProduct));
        when(productVariantRepository.findById(101L)).thenReturn(Optional.of(testVariant));
        when(productItemRepository.findByVariantIdOrderByIdAsc(101L)).thenReturn(List.of(item1, item2));
        when(bookingItemRepository.findOverlappingItems(eq(101L), any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(Collections.emptyList());

        YearMonth futureMonth = YearMonth.from(LocalDate.now().plusMonths(2));
        ProductAvailabilityResponse response = availabilityService.checkAvailability(
                "vay-da-hoi-kim-sa-do", 101L, futureMonth.toString()
        );

        assertThat(response.getAvailableItems()).isEqualTo(0);
        assertThat(response.getDays().get(0).getReason()).isEqualTo("MAINTENANCE");
        assertThat(response.getDays().get(0).isAvailable()).isFalse();
    }

    @Test
    @DisplayName("Ném ResourceNotFoundException khi slug không tồn tại")
    void checkAvailability_ProductNotFound_ThrowsException() {
        when(productRepository.findBySlug("not-found")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> availabilityService.checkAvailability("not-found", 101L, "2026-11"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Sản phẩm không tồn tại");
    }

    @Test
    @DisplayName("Ném IllegalArgumentException khi variantId không thuộc product")
    void checkAvailability_InvalidVariant_ThrowsException() {
        Product otherProduct = Product.builder().id(999L).build();
        ProductVariant foreignVariant = ProductVariant.builder().id(200L).product(otherProduct).build();

        when(productRepository.findBySlug("vay-da-hoi-kim-sa-do")).thenReturn(Optional.of(testProduct));
        when(productVariantRepository.findById(200L)).thenReturn(Optional.of(foreignVariant));

        assertThatThrownBy(() -> availabilityService.checkAvailability("vay-da-hoi-kim-sa-do", 200L, "2026-11"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Biến thể không thuộc sản phẩm này");
    }
}
