package com.chickiestudio.booking.service;

import com.chickiestudio.booking.dto.BookingResponse;
import com.chickiestudio.booking.dto.BookingTrackingRequest;
import com.chickiestudio.booking.dto.CreateBookingRequest;
import com.chickiestudio.booking.dto.UpdateBookingStatusRequest;
import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.booking.entity.BookingItem;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.entity.BookingStatusHistory;
import com.chickiestudio.booking.repository.BookingItemRepository;
import com.chickiestudio.booking.repository.BookingRepository;
import com.chickiestudio.booking.repository.BookingStatusHistoryRepository;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

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

    @Mock
    private BookingStatusHistoryRepository bookingStatusHistoryRepository;

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

    @Test
    @DisplayName("getBookingsForAdmin trả về danh sách phân trang thành công")
    void getBookingsForAdmin_Success() {
        Booking booking = Booking.builder()
                .id(1L)
                .bookingCode("BK20261025-ABCD")
                .customerName("Trần Thu Hà")
                .customerPhone("0987654321")
                .rentalStartDate(LocalDate.now())
                .rentalEndDate(LocalDate.now().plusDays(2))
                .status(BookingStatus.PENDING)
                .build();

        Page<Booking> page = new PageImpl<>(List.of(booking), PageRequest.of(0, 20), 1);
        when(bookingRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<BookingResponse> result = bookingService.getBookingsForAdmin(
                BookingStatus.PENDING, "Trần", null, null, null, null, null, PageRequest.of(0, 20)
        );

        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getBookingCode()).isEqualTo("BK20261025-ABCD");
    }

    @Test
    @DisplayName("getBookingById trả về chi tiết đơn thuê thành công")
    void getBookingById_Success() {
        Booking booking = Booking.builder()
                .id(10L)
                .bookingCode("BK20261025-1010")
                .customerName("Lê Hoàng Nam")
                .customerPhone("0912345678")
                .rentalStartDate(LocalDate.now())
                .rentalEndDate(LocalDate.now().plusDays(1))
                .status(BookingStatus.CONFIRMED)
                .build();

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(booking));

        BookingResponse response = bookingService.getBookingById(10L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getBookingCode()).isEqualTo("BK20261025-1010");
    }

    @Test
    @DisplayName("getBookingById ném ResourceNotFoundException khi ID không tồn tại")
    void getBookingById_NotFound_ThrowsException() {
        when(bookingRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.getBookingById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy đơn đặt thuê với ID: 999");
    }

    @Test
    @DisplayName("updateBookingStatus hợp lệ từ PENDING sang CONFIRMED và lưu lịch sử")
    void updateBookingStatus_PendingToConfirmed_Success() {
        Booking booking = Booking.builder()
                .id(1L)
                .bookingCode("BK20261025-ABCD")
                .customerName("Trần Thu Hà")
                .customerPhone("0987654321")
                .rentalStartDate(LocalDate.now())
                .rentalEndDate(LocalDate.now().plusDays(2))
                .status(BookingStatus.PENDING)
                .build();

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateBookingStatusRequest req = UpdateBookingStatusRequest.builder()
                .status(BookingStatus.CONFIRMED)
                .note("Đã liên hệ xác nhận")
                .build();

        BookingResponse response = bookingService.updateBookingStatus(1L, req, "staff1");

        assertThat(response.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
        verify(bookingStatusHistoryRepository).save(any(BookingStatusHistory.class));
    }

    @Test
    @DisplayName("updateBookingStatus từ DEPOSITED sang DELIVERED đồng bộ ProductItem sang RENTED")
    void updateBookingStatus_DepositedToDelivered_SynchronizesProductItem() {
        ProductItem physicalItem = ProductItem.builder()
                .id(50L)
                .itemCode("CK-ITEM-50")
                .status(ProductItemStatus.AVAILABLE)
                .build();

        BookingItem bi = BookingItem.builder()
                .id(100L)
                .productItem(physicalItem)
                .rentalStartDate(LocalDate.now())
                .rentalEndDate(LocalDate.now().plusDays(2))
                .build();

        Booking booking = Booking.builder()
                .id(2L)
                .bookingCode("BK20261025-DELIV")
                .customerName("Khách Hàng A")
                .customerPhone("0900000001")
                .rentalStartDate(LocalDate.now())
                .rentalEndDate(LocalDate.now().plusDays(2))
                .status(BookingStatus.DEPOSITED)
                .items(new java.util.ArrayList<>(List.of(bi)))
                .build();

        when(bookingRepository.findById(2L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateBookingStatusRequest req = UpdateBookingStatusRequest.builder()
                .status(BookingStatus.DELIVERED)
                .note("Giao đồ tại showroom")
                .build();

        BookingResponse response = bookingService.updateBookingStatus(2L, req, "admin");

        assertThat(response.getStatus()).isEqualTo(BookingStatus.DELIVERED);
        assertThat(physicalItem.getStatus()).isEqualTo(ProductItemStatus.RENTED);
        verify(productItemRepository).save(physicalItem);
    }

    @Test
    @DisplayName("updateBookingStatus từ DELIVERED sang RETURNED đồng bộ ProductItem sang LAUNDRY và tăng rentalCount")
    void updateBookingStatus_DeliveredToReturned_SynchronizesProductItem() {
        ProductItem physicalItem = ProductItem.builder()
                .id(50L)
                .itemCode("CK-ITEM-50")
                .status(ProductItemStatus.RENTED)
                .rentalCount(2)
                .build();

        BookingItem bi = BookingItem.builder()
                .id(100L)
                .productItem(physicalItem)
                .rentalStartDate(LocalDate.now().minusDays(2))
                .rentalEndDate(LocalDate.now())
                .build();

        Booking booking = Booking.builder()
                .id(3L)
                .bookingCode("BK20261025-RET")
                .customerName("Khách Hàng B")
                .customerPhone("0900000002")
                .rentalStartDate(LocalDate.now().minusDays(2))
                .rentalEndDate(LocalDate.now())
                .status(BookingStatus.DELIVERED)
                .items(new java.util.ArrayList<>(List.of(bi)))
                .build();

        when(bookingRepository.findById(3L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateBookingStatusRequest req = UpdateBookingStatusRequest.builder()
                .status(BookingStatus.RETURNED)
                .note("Khách trả đồ đúng hạn")
                .build();

        BookingResponse response = bookingService.updateBookingStatus(3L, req, "staff1");

        assertThat(response.getStatus()).isEqualTo(BookingStatus.RETURNED);
        assertThat(physicalItem.getStatus()).isEqualTo(ProductItemStatus.LAUNDRY);
        assertThat(physicalItem.getRentalCount()).isEqualTo(3);
        verify(productItemRepository).save(physicalItem);
    }

    @Test
    @DisplayName("updateBookingStatus sang CANCELLED khi không có lý do sẽ ném BadRequestException")
    void updateBookingStatus_CancelledWithoutNote_ThrowsBadRequest() {
        Booking booking = Booking.builder()
                .id(4L)
                .status(BookingStatus.PENDING)
                .build();

        when(bookingRepository.findById(4L)).thenReturn(Optional.of(booking));

        UpdateBookingStatusRequest req = UpdateBookingStatusRequest.builder()
                .status(BookingStatus.CANCELLED)
                .note("   ")
                .build();

        assertThatThrownBy(() -> bookingService.updateBookingStatus(4L, req, "staff1"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Vui lòng cung cấp lý do khi hủy đơn thuê");
    }

    @Test
    @DisplayName("updateBookingStatus khi vi phạm chuyển đổi State Machine sẽ ném BadRequestException")
    void updateBookingStatus_InvalidTransition_ThrowsBadRequest() {
        Booking booking = Booking.builder()
                .id(5L)
                .status(BookingStatus.PENDING)
                .build();

        when(bookingRepository.findById(5L)).thenReturn(Optional.of(booking));

        UpdateBookingStatusRequest req = UpdateBookingStatusRequest.builder()
                .status(BookingStatus.COMPLETED)
                .note("Hoàn tất sớm")
                .build();

        assertThatThrownBy(() -> bookingService.updateBookingStatus(5L, req, "staff1"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Không thể chuyển đổi trạng thái đơn thuê từ PENDING sang COMPLETED");
    }

    @Test
    @DisplayName("trackBooking - Tra cứu thành công với số điện thoại chuẩn xác và che thông tin nhân viên")
    void trackBooking_Success() {
        Booking booking = Booking.builder()
                .id(10L)
                .bookingCode("BK20261025-ABCD")
                .customerName("Trần Mỹ Linh")
                .customerPhone("0901234567")
                .rentalStartDate(LocalDate.now().plusDays(1))
                .rentalEndDate(LocalDate.now().plusDays(3))
                .status(BookingStatus.CONFIRMED)
                .totalRentalPrice(new BigDecimal("500000"))
                .totalDepositPrice(new BigDecimal("1000000"))
                .build();

        BookingStatusHistory history1 = BookingStatusHistory.builder()
                .id(1L)
                .fromStatus(null)
                .toStatus(BookingStatus.PENDING)
                .changedBy("CUSTOMER")
                .note("Đơn đặt qua web")
                .build();

        BookingStatusHistory history2 = BookingStatusHistory.builder()
                .id(2L)
                .fromStatus(BookingStatus.PENDING)
                .toStatus(BookingStatus.CONFIRMED)
                .changedBy("admin_user_secret")
                .note("Đã xác nhận cọc")
                .build();

        when(bookingRepository.findByBookingCode("BK20261025-ABCD")).thenReturn(Optional.of(booking));
        when(bookingStatusHistoryRepository.findByBookingIdOrderByCreatedAtDesc(10L))
                .thenReturn(List.of(history2, history1));

        BookingTrackingRequest request = BookingTrackingRequest.builder()
                .bookingCode("BK20261025-ABCD")
                .phone("0901234567")
                .build();

        BookingResponse response = bookingService.trackBooking(request);

        assertThat(response).isNotNull();
        assertThat(response.getBookingCode()).isEqualTo("BK20261025-ABCD");
        assertThat(response.getCustomerName()).isEqualTo("Trần Mỹ Linh");
        assertThat(response.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
        assertThat(response.getStatusHistories()).hasSize(2);
        // Kiểm tra bảo mật BR-02: Nhân viên bị thay bằng CHICKIE_STUDIO, khách vẫn là CUSTOMER
        assertThat(response.getStatusHistories().get(0).getChangedBy()).isEqualTo("CHICKIE_STUDIO");
        assertThat(response.getStatusHistories().get(1).getChangedBy()).isEqualTo("CUSTOMER");
    }

    @Test
    @DisplayName("trackBooking - Khách nhập số điện thoại với tiền tố +84 vẫn đối soát thành công")
    void trackBooking_WithPlus84Prefix_Success() {
        Booking booking = Booking.builder()
                .id(11L)
                .bookingCode("BK20261025-PLUS84")
                .customerName("Đỗ Hoàng Yến")
                .customerPhone("0987654321")
                .rentalStartDate(LocalDate.now().plusDays(2))
                .rentalEndDate(LocalDate.now().plusDays(4))
                .status(BookingStatus.PENDING)
                .build();

        when(bookingRepository.findByBookingCode("BK20261025-PLUS84")).thenReturn(Optional.of(booking));
        when(bookingStatusHistoryRepository.findByBookingIdOrderByCreatedAtDesc(11L))
                .thenReturn(Collections.emptyList());

        BookingTrackingRequest request = BookingTrackingRequest.builder()
                .bookingCode("BK20261025-PLUS84")
                .phone("+84987654321")
                .build();

        BookingResponse response = bookingService.trackBooking(request);

        assertThat(response).isNotNull();
        assertThat(response.getBookingCode()).isEqualTo("BK20261025-PLUS84");
        assertThat(response.getCustomerName()).isEqualTo("Đỗ Hoàng Yến");
    }

    @Test
    @DisplayName("trackBooking - Sai số điện thoại ném ResourceNotFoundException bảo mật")
    void trackBooking_WrongPhone_ThrowsNotFound() {
        Booking booking = Booking.builder()
                .id(12L)
                .bookingCode("BK20261025-WRONG")
                .customerPhone("0901234567")
                .build();

        when(bookingRepository.findByBookingCode("BK20261025-WRONG")).thenReturn(Optional.of(booking));

        BookingTrackingRequest request = BookingTrackingRequest.builder()
                .bookingCode("BK20261025-WRONG")
                .phone("0988888888")
                .build();

        assertThatThrownBy(() -> bookingService.trackBooking(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy đơn đặt thuê phù hợp");
    }

    @Test
    @DisplayName("trackBooking - Mã đơn không tồn tại ném ResourceNotFoundException")
    void trackBooking_CodeNotFound_ThrowsNotFound() {
        when(bookingRepository.findByBookingCode("BK-UNKNOWN")).thenReturn(Optional.empty());

        BookingTrackingRequest request = BookingTrackingRequest.builder()
                .bookingCode("BK-UNKNOWN")
                .phone("0901234567")
                .build();

        assertThatThrownBy(() -> bookingService.trackBooking(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy đơn đặt thuê phù hợp");
    }
}
