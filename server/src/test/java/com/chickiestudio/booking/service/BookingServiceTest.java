package com.chickiestudio.booking.service;

import com.chickiestudio.booking.dto.BookingResponse;
import com.chickiestudio.booking.dto.CreateBookingRequest;
import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.booking.entity.BookingItem;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.repository.BookingItemRepository;
import com.chickiestudio.booking.repository.BookingRepository;
import com.chickiestudio.category.entity.Category;
import com.chickiestudio.category.entity.CategoryType;
import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductItem;
import com.chickiestudio.product.entity.ProductItemStatus;
import com.chickiestudio.product.entity.ProductVariant;
import com.chickiestudio.product.repository.ProductItemRepository;
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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingItemRepository bookingItemRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private ProductItemRepository productItemRepository;

    @InjectMocks
    private BookingService bookingService;

    private Product product;
    private ProductVariant variant;
    private ProductItem item1;
    private ProductItem item2;
    private CreateBookingRequest request;

    @BeforeEach
    void setUp() {
        Category category = Category.builder()
                .id(1L)
                .name("Váy Thiết Kế")
                .type(CategoryType.COSTUME)
                .build();

        product = Product.builder()
                .id(10L)
                .name("Đầm Dạ Hội Satin")
                .rentalPrice(new BigDecimal("200000"))
                .depositPrice(new BigDecimal("500000"))
                .category(category)
                .build();

        variant = ProductVariant.builder()
                .id(100L)
                .product(product)
                .size("M")
                .color("Đỏ Rượu")
                .sku("VTK-M-RED")
                .build();

        item1 = ProductItem.builder()
                .id(1001L)
                .variant(variant)
                .itemCode("CK-VTK-M-001")
                .status(ProductItemStatus.AVAILABLE)
                .build();

        item2 = ProductItem.builder()
                .id(1002L)
                .variant(variant)
                .itemCode("CK-VTK-M-002")
                .status(ProductItemStatus.AVAILABLE)
                .build();

        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDate dayAfter = LocalDate.now().plusDays(2);

        request = CreateBookingRequest.builder()
                .customerName("Nguyễn Quỳnh Anh")
                .customerPhone("0912345678")
                .deliveryMethod("PICKUP_STORE")
                .rentalStartDate(tomorrow)
                .rentalEndDate(dayAfter)
                .variantId(100L)
                .note("Khách cao 1m62")
                .build();
    }

    @Test
    @DisplayName("Tạo đơn đặt thuê thành công khi còn đồ khả dụng")
    void createBooking_Success() {
        when(productVariantRepository.findById(100L)).thenReturn(Optional.of(variant));
        when(productItemRepository.findByVariantIdOrderByIdAsc(100L)).thenReturn(List.of(item1, item2));
        when(bookingItemRepository.findOverlappingItems(anyLong(), any(), any(), any())).thenReturn(Collections.emptyList());
        when(bookingRepository.existsByBookingCode(anyString())).thenReturn(false);

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(1L);
            return b;
        });

        BookingResponse response = bookingService.createBooking(request);

        assertThat(response).isNotNull();
        assertThat(response.getCustomerName()).isEqualTo("Nguyễn Quỳnh Anh");
        assertThat(response.getCustomerPhone()).isEqualTo("0912345678");
        assertThat(response.getStatus()).isEqualTo(BookingStatus.PENDING);
        assertThat(response.getDurationDays()).isEqualTo(2);
        // 200,000 * 2 = 400,000 rental fee
        assertThat(response.getTotalRentalPrice()).isEqualByComparingTo(new BigDecimal("400000"));
        assertThat(response.getTotalDepositPrice()).isEqualByComparingTo(new BigDecimal("500000"));
        assertThat(response.getTotalAmount()).isEqualByComparingTo(new BigDecimal("900000"));
        assertThat(response.getItems()).hasSize(1);
        assertThat(response.getItems().get(0).getProductItemId()).isEqualTo(1001L);

        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    @DisplayName("Ném lỗi BadRequestException khi ngày nhận ở quá khứ")
    void createBooking_PastStartDate_ThrowsException() {
        request.setRentalStartDate(LocalDate.now().minusDays(1));

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Ngày nhận đồ không thể ở quá khứ");
    }

    @Test
    @DisplayName("Ném lỗi BadRequestException khi ngày trả trước ngày nhận")
    void createBooking_EndDateBeforeStart_ThrowsException() {
        request.setRentalStartDate(LocalDate.now().plusDays(5));
        request.setRentalEndDate(LocalDate.now().plusDays(3));

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Ngày trả đồ không thể trước ngày nhận đồ");
    }

    @Test
    @DisplayName("Ném lỗi ConflictException khi kho không có món đồ vật lý nào")
    void createBooking_NoInventory_ThrowsException() {
        when(productVariantRepository.findById(100L)).thenReturn(Optional.of(variant));
        when(productItemRepository.findByVariantIdOrderByIdAsc(100L)).thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("chưa có món đồ vật lý khả dụng trong kho");
    }

    @Test
    @DisplayName("Ném lỗi ConflictException khi tất cả các món đồ đều đã kín lịch")
    void createBooking_AllItemsBooked_ThrowsException() {
        when(productVariantRepository.findById(100L)).thenReturn(Optional.of(variant));
        when(productItemRepository.findByVariantIdOrderByIdAsc(100L)).thenReturn(List.of(item1));

        Booking existingBooking = Booking.builder()
                .id(2L)
                .status(BookingStatus.CONFIRMED)
                .build();

        BookingItem busyItem = BookingItem.builder()
                .id(20L)
                .booking(existingBooking)
                .productItem(item1)
                .rentalStartDate(request.getRentalStartDate())
                .rentalEndDate(request.getRentalEndDate())
                .build();

        when(bookingItemRepository.findOverlappingItems(anyLong(), any(), any(), any())).thenReturn(List.of(busyItem));

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("đã kín lịch");
    }

    @Test
    @DisplayName("Tra cứu thông tin đơn thuê qua booking code thành công")
    void getBookingByCode_Success() {
        Booking booking = Booking.builder()
                .id(1L)
                .bookingCode("BK20261025-ABCD")
                .customerName("Trần Thu Hà")
                .customerPhone("0987654321")
                .rentalStartDate(LocalDate.now().plusDays(2))
                .rentalEndDate(LocalDate.now().plusDays(3))
                .status(BookingStatus.PENDING)
                .totalRentalPrice(new BigDecimal("300000"))
                .totalDepositPrice(new BigDecimal("500000"))
                .build();

        when(bookingRepository.findByBookingCode("BK20261025-ABCD")).thenReturn(Optional.of(booking));

        BookingResponse response = bookingService.getBookingByCode("BK20261025-ABCD");

        assertThat(response).isNotNull();
        assertThat(response.getBookingCode()).isEqualTo("BK20261025-ABCD");
        assertThat(response.getCustomerName()).isEqualTo("Trần Thu Hà");
    }

    @Test
    @DisplayName("Ném ResourceNotFoundException khi mã đơn không tồn tại")
    void getBookingByCode_NotFound_ThrowsException() {
        when(bookingRepository.findByBookingCode("INVALID-CODE")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.getBookingByCode("INVALID-CODE"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy đơn đặt thuê");
    }
}
