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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
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

    @Mock
    private com.chickiestudio.notification.service.EmailNotificationService emailNotificationService;

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
    @DisplayName("Tạo đơn đặt thuê thành công khi còn đồ khả dụng (sử dụng findActiveItemsForUpdate khóa bi quan BOK-002)")
    void createBooking_Success() {
        when(productVariantRepository.findById(100L)).thenReturn(Optional.of(variant));
        when(productItemRepository.findActiveItemsForUpdate(100L)).thenReturn(List.of(item1, item2));
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
        when(productItemRepository.findActiveItemsForUpdate(100L)).thenReturn(Collections.emptyList());
        when(productItemRepository.findByVariantIdOrderByIdAsc(100L)).thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("chưa có món đồ vật lý khả dụng trong kho");
    }

    @Test
    @DisplayName("Ném lỗi ConflictException khi tất cả các món đồ đều đã kín lịch")
    void createBooking_AllItemsBooked_ThrowsException() {
        when(productVariantRepository.findById(100L)).thenReturn(Optional.of(variant));
        when(productItemRepository.findActiveItemsForUpdate(100L)).thenReturn(List.of(item1));

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

    // =========================================================================
    // BOK-002: Thuật Toán Chống Trùng Lịch & Ngày Đệm Giặt Ủi Tests
    // =========================================================================

    @Test
    @DisplayName("BOK-002 [BR-01]: Cấu hình bufferDays = 1 cho Trang phục (Váy cưới, Áo dài) và 0 cho Máy ảnh/Dịch vụ")
    void bok002_calculateBufferDays_Rules() {
        // Trang phục COSTUME -> bufferDays = 1
        Product costumeProduct = Product.builder()
                .category(Category.builder().type(CategoryType.COSTUME).build())
                .build();
        assertThat(bookingService.calculateBufferDays(costumeProduct)).isEqualTo(1);

        // Máy ảnh CAMERA -> bufferDays = 0
        Product cameraProduct = Product.builder()
                .category(Category.builder().type(CategoryType.CAMERA).build())
                .build();
        assertThat(bookingService.calculateBufferDays(cameraProduct)).isEqualTo(0);

        // Dịch vụ chụp PHOTOGRAPHY -> bufferDays = 0
        Product photoProduct = Product.builder()
                .category(Category.builder().type(CategoryType.PHOTOGRAPHY).build())
                .build();
        assertThat(bookingService.calculateBufferDays(photoProduct)).isEqualTo(0);

        // Null category / default -> bufferDays = 1 (an toàn)
        Product defaultProduct = Product.builder().build();
        assertThat(bookingService.calculateBufferDays(defaultProduct)).isEqualTo(1);
    }

    @Test
    @DisplayName("BOK-002: Kiểm tra va chạm giao thoa ngày đệm giặt ủi (Acceptance Criteria 1)")
    void bok002_isIntervalOverlappingWithBuffer_Scenarios() {
        LocalDate startExist = LocalDate.of(2026, 11, 10);
        LocalDate endExist = LocalDate.of(2026, 11, 11);
        int bufferDays = 1; // Chiếm dụng đến hết 12/11

        // Kịch bản 1: Khách B muốn thuê vào ngày 12/11 (chính là ngày đệm) -> BỊ TRÙNG LỊCH
        boolean overlapsOnBufferDay = bookingService.isIntervalOverlappingWithBuffer(
                LocalDate.of(2026, 11, 12), LocalDate.of(2026, 11, 13),
                startExist, endExist,
                bufferDays
        );
        assertThat(overlapsOnBufferDay).isTrue();

        // Kịch bản 2: Khách B muốn thuê vào ngày 13/11 (đã qua ngày đệm 12/11) -> HỢP LỆ, KHÔNG TRÙNG
        boolean noOverlapAfterBuffer = bookingService.isIntervalOverlappingWithBuffer(
                LocalDate.of(2026, 11, 13), LocalDate.of(2026, 11, 14),
                startExist, endExist,
                bufferDays
        );
        assertThat(noOverlapAfterBuffer).isFalse();

        // Kịch bản 3: Khách B thuê trước đó nhưng ngày đệm của B chạm vào ngày nhận của A (8/11 - 9/11 + buffer 1 = 10/11) -> BỊ TRÙNG
        boolean overlapsBefore = bookingService.isIntervalOverlappingWithBuffer(
                LocalDate.of(2026, 11, 8), LocalDate.of(2026, 11, 9),
                startExist, endExist,
                bufferDays
        );
        assertThat(overlapsBefore).isTrue();

        // Kịch bản 4: Khách B thuê sớm hẳn (7/11 - 8/11 + buffer 1 = 9/11) -> HỢP LỆ, KHÔNG TRÙNG
        boolean noOverlapBefore = bookingService.isIntervalOverlappingWithBuffer(
                LocalDate.of(2026, 11, 7), LocalDate.of(2026, 11, 8),
                startExist, endExist,
                bufferDays
        );
        assertThat(noOverlapBefore).isFalse();

        // Kịch bản 5: Máy ảnh bufferDays = 0, thuê ngay 12/11 sau khi đơn trước trả 11/11 -> HỢP LỆ
        boolean cameraNextDay = bookingService.isIntervalOverlappingWithBuffer(
                LocalDate.of(2026, 11, 12), LocalDate.of(2026, 11, 13),
                startExist, endExist,
                0 // 0 buffer
        );
        assertThat(cameraNextDay).isFalse();
    }

    @Test
    @DisplayName("BOK-002: Mô phỏng Race Condition khi 2 khách đặt đồng thời cho món đồ duy nhất - Request 2 nhận 409 Conflict")
    void bok002_concurrencyRaceCondition_OnlyOneSucceeds() throws Exception {
        when(productVariantRepository.findById(100L)).thenReturn(Optional.of(variant));
        // Chỉ có duy nhất 1 món đồ vật lý khả dụng
        when(productItemRepository.findActiveItemsForUpdate(100L)).thenReturn(List.of(item1));
        when(bookingRepository.existsByBookingCode(anyString())).thenReturn(false);

        java.util.concurrent.atomic.AtomicInteger bookingCounter = new java.util.concurrent.atomic.AtomicInteger(0);
        java.util.List<BookingItem> activeBookings = new java.util.concurrent.CopyOnWriteArrayList<>();

        when(bookingItemRepository.findOverlappingItems(anyLong(), any(), any(), any()))
                .thenAnswer(inv -> new java.util.ArrayList<>(activeBookings));

        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> {
            Booking b = inv.getArgument(0);
            b.setId((long) bookingCounter.incrementAndGet());
            if (!b.getItems().isEmpty()) {
                activeBookings.addAll(b.getItems());
            }
            return b;
        });

        // Request 1 từ khách hàng A
        BookingResponse res1 = bookingService.createBooking(request);
        assertThat(res1).isNotNull();
        assertThat(res1.getItems().get(0).getProductItemId()).isEqualTo(item1.getId());

        // Request 2 từ khách hàng B cùng thời điểm cho cùng khoảng ngày
        CreateBookingRequest request2 = CreateBookingRequest.builder()
                .customerName("Khách Hàng B")
                .customerPhone("0987654321")
                .variantId(100L)
                .rentalStartDate(request.getRentalStartDate())
                .rentalEndDate(request.getRentalEndDate())
                .build();

        // Request 2 phải bị ConflictException (409) do item duy nhất đã bị giữ bởi Request 1
        assertThatThrownBy(() -> bookingService.createBooking(request2))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("đã kín lịch");
    }

    // =========================================================================
    // BOK-003: Quét Quá Hạn & State Machine Transition Tests
    // =========================================================================

    @Test
    @DisplayName("BOK-003: markOverdueBookings - Quét và tự động chuyển các đơn DELIVERED quá hạn trả sang OVERDUE")
    void markOverdueBookings_UpdatesOverdueBookings() {
        LocalDate today = LocalDate.now();
        Booking overdueBooking = Booking.builder()
                .id(100L)
                .bookingCode("BK20261020-OVER")
                .status(BookingStatus.DELIVERED)
                .rentalStartDate(today.minusDays(5))
                .rentalEndDate(today.minusDays(1))
                .build();

        when(bookingRepository.findByStatusAndRentalEndDateBefore(BookingStatus.DELIVERED, today))
                .thenReturn(List.of(overdueBooking));

        int markedCount = bookingService.markOverdueBookings(today);

        assertThat(markedCount).isEqualTo(1);
        assertThat(overdueBooking.getStatus()).isEqualTo(BookingStatus.OVERDUE);
        verify(bookingRepository).save(overdueBooking);
        verify(bookingStatusHistoryRepository).save(any(BookingStatusHistory.class));
    }

    @Test
    @DisplayName("BOK-003: markOverdueBookings - Không có đơn nào quá hạn trả về 0")
    void markOverdueBookings_NoOverdue_ReturnsZero() {
        LocalDate today = LocalDate.now();
        when(bookingRepository.findByStatusAndRentalEndDateBefore(BookingStatus.DELIVERED, today))
                .thenReturn(Collections.emptyList());

        int markedCount = bookingService.markOverdueBookings(today);

        assertThat(markedCount).isEqualTo(0);
    }

    @Test
    @DisplayName("BOK-003: updateBookingStatus trả về danh sách nextValidStatuses chính xác theo State Machine")
    void updateBookingStatus_ReturnsNextValidStatuses() {
        Booking booking = Booking.builder()
                .id(10L)
                .bookingCode("BK20261025-NEXT")
                .customerName("Lê Hoàng Nam")
                .customerPhone("0911223344")
                .rentalStartDate(LocalDate.now())
                .rentalEndDate(LocalDate.now().plusDays(2))
                .status(BookingStatus.PENDING)
                .build();

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateBookingStatusRequest req = UpdateBookingStatusRequest.builder()
                .status(BookingStatus.CONFIRMED)
                .note("Đã gọi xác nhận đơn")
                .build();

        BookingResponse res = bookingService.updateBookingStatus(10L, req, "staff1");

        assertThat(res.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
        assertThat(res.getNextValidStatuses())
                .containsExactlyInAnyOrder(BookingStatus.DEPOSITED, BookingStatus.CANCELLED);
    }

    @Test
    @DisplayName("BOK-003: updateBookingStatus đồng bộ trạng thái ProductItem (DELIVERED, RETURNED, COMPLETED, CANCELLED)")
    void updateBookingStatus_syncProductItemStatus() {
        ProductItem pi = ProductItem.builder()
                .id(501L)
                .itemCode("CK-DR-001-01")
                .status(ProductItemStatus.AVAILABLE)
                .rentalCount(0)
                .build();
        BookingItem bi = BookingItem.builder().productItem(pi).build();
        List<BookingItem> items = new ArrayList<>();
        items.add(bi);

        Booking booking = Booking.builder()
                .id(20L)
                .bookingCode("BK-SYNC-STATUS")
                .customerName("Khách Hàng Sync")
                .customerPhone("0987654321")
                .rentalStartDate(LocalDate.now())
                .rentalEndDate(LocalDate.now().plusDays(2))
                .status(BookingStatus.CONFIRMED)
                .items(items)
                .build();

        when(bookingRepository.findById(20L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        // 1. DEPOSITED -> DELIVERED (item -> RENTED)
        booking.setStatus(BookingStatus.DEPOSITED);
        bookingService.updateBookingStatus(20L, UpdateBookingStatusRequest.builder().status(BookingStatus.DELIVERED).build(), "staff");
        assertThat(pi.getStatus()).isEqualTo(ProductItemStatus.RENTED);

        // 2. DELIVERED -> RETURNED (item -> LAUNDRY, count + 1)
        booking.setStatus(BookingStatus.DELIVERED);
        bookingService.updateBookingStatus(20L, UpdateBookingStatusRequest.builder().status(BookingStatus.RETURNED).build(), "staff");
        assertThat(pi.getStatus()).isEqualTo(ProductItemStatus.LAUNDRY);
        assertThat(pi.getRentalCount()).isEqualTo(1);

        // 3. RETURNED -> COMPLETED (item -> AVAILABLE)
        booking.setStatus(BookingStatus.RETURNED);
        bookingService.updateBookingStatus(20L, UpdateBookingStatusRequest.builder().status(BookingStatus.COMPLETED).build(), "staff");
        assertThat(pi.getStatus()).isEqualTo(ProductItemStatus.AVAILABLE);

        // 4. PENDING -> CANCELLED khi item đang RENTED (item -> AVAILABLE)
        booking.setStatus(BookingStatus.PENDING);
        pi.setStatus(ProductItemStatus.RENTED);
        bookingService.updateBookingStatus(20L, UpdateBookingStatusRequest.builder().status(BookingStatus.CANCELLED).note("Lý do hủy đơn").build(), "staff");
        assertThat(pi.getStatus()).isEqualTo(ProductItemStatus.AVAILABLE);
    }

    @Test
    @DisplayName("BOK-001: createBooking tự động tạo ProductItem dự phòng khi biến thể chưa có item nào trong kho")
    void createBooking_autoGenerateFallbackItems() {
        when(productVariantRepository.findById(100L)).thenReturn(Optional.of(variant));

        ProductItem mockItem = ProductItem.builder()
                .id(888L)
                .variant(variant)
                .itemCode("CK-ITEM-FALLBACK")
                .status(ProductItemStatus.AVAILABLE)
                .rentalCount(0)
                .build();

        when(productItemRepository.findActiveItemsForUpdate(100L)).thenReturn(Collections.emptyList(), List.of(mockItem));
        when(productItemRepository.findByVariantIdOrderByIdAsc(100L)).thenReturn(Collections.emptyList());
        when(productItemRepository.saveAll(any())).thenReturn(List.of(mockItem));
        when(bookingItemRepository.findOverlappingItems(any(), any(), any(), any())).thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> {
            Booking b = inv.getArgument(0);
            b.setId(777L);
            return b;
        });

        request.setDeliveryMethod("DELIVERY");
        request.setDeliveryAddress("123 Cầu Giấy");
        request.setNote("Ghi chú thử đồ");

        BookingResponse response = bookingService.createBooking(request);

        assertThat(response).isNotNull();
        assertThat(response.getDeliveryMethod()).isEqualTo("DELIVERY");
        assertThat(response.getDeliveryAddress()).isEqualTo("123 Cầu Giấy");
        verify(productItemRepository).saveAll(any());
    }

    @Test
    @DisplayName("BOK-002: calculateBufferDays tính ngày đệm chính xác cho từng loại sản phẩm")
    void calculateBufferDays_allBranches() {
        // 1. null product -> 1
        assertThat(bookingService.calculateBufferDays(null)).isEqualTo(1);

        // 2. product with null category -> 1
        Product pNoCat = Product.builder().build();
        assertThat(bookingService.calculateBufferDays(pNoCat)).isEqualTo(1);

        // 3. CAMERA category -> 0
        Product pCamera = Product.builder()
                .category(Category.builder().type(CategoryType.CAMERA).build())
                .build();
        assertThat(bookingService.calculateBufferDays(pCamera)).isEqualTo(0);

        // 4. PHOTOGRAPHY category -> 0
        Product pPhoto = Product.builder()
                .category(Category.builder().type(CategoryType.PHOTOGRAPHY).build())
                .build();
        assertThat(bookingService.calculateBufferDays(pPhoto)).isEqualTo(0);

        // 5. COSTUME category -> 1
        Product pCostume = Product.builder()
                .category(Category.builder().type(CategoryType.COSTUME).build())
                .build();
        assertThat(bookingService.calculateBufferDays(pCostume)).isEqualTo(1);
    }

    @Test
    @DisplayName("BOK-005: isPhoneMatching so khớp chuẩn hóa số điện thoại các định dạng 0x và +84x")
    void isPhoneMatching_allBranches() {
        // null cases
        assertThat(bookingService.isPhoneMatching(null, "0912345678")).isFalse();
        assertThat(bookingService.isPhoneMatching("0912345678", null)).isFalse();

        // formatted cases
        assertThat(bookingService.isPhoneMatching("+84912345678", "0912345678")).isTrue();
        assertThat(bookingService.isPhoneMatching("0912345678", "+84912345678")).isTrue();
        assertThat(bookingService.isPhoneMatching("0912345678", "0987654321")).isFalse();
    }

    @Test
    @DisplayName("BOK-003: markOverdueBookings cập nhật đơn DELIVERED quá hạn sang OVERDUE")
    void markOverdueBookings_withOverdueOrders() {
        Booking overdueBooking = Booking.builder()
                .id(99L)
                .bookingCode("BK-OVERDUE-1")
                .status(BookingStatus.DELIVERED)
                .rentalEndDate(LocalDate.now().minusDays(1))
                .build();

        when(bookingRepository.findByStatusAndRentalEndDateBefore(eq(BookingStatus.DELIVERED), any()))
                .thenReturn(List.of(overdueBooking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        int count = bookingService.markOverdueBookings(LocalDate.now());

        assertThat(count).isEqualTo(1);
        assertThat(overdueBooking.getStatus()).isEqualTo(BookingStatus.OVERDUE);
        verify(bookingStatusHistoryRepository).save(any(BookingStatusHistory.class));
    }

    @Test
    @DisplayName("BOK-005: trackBooking tra cứu đơn thành công và ẩn danh thông tin nhân viên")
    void trackBooking_successAndSanitizeStaff() {
        Booking booking = Booking.builder()
                .id(100L)
                .bookingCode("BK20261105-TRACK")
                .customerName("Khách Hàng Tra Cứu")
                .customerPhone("0912345678")
                .rentalStartDate(LocalDate.now())
                .rentalEndDate(LocalDate.now().plusDays(2))
                .status(BookingStatus.CONFIRMED)
                .build();

        BookingStatusHistory hCustomer = BookingStatusHistory.builder()
                .id(1L)
                .fromStatus(null)
                .toStatus(BookingStatus.PENDING)
                .changedBy("CUSTOMER")
                .createdAt(LocalDateTime.now())
                .build();

        BookingStatusHistory hStaff = BookingStatusHistory.builder()
                .id(2L)
                .fromStatus(BookingStatus.PENDING)
                .toStatus(BookingStatus.CONFIRMED)
                .changedBy("admin_user")
                .createdAt(LocalDateTime.now())
                .build();

        when(bookingRepository.findByBookingCode("BK20261105-TRACK")).thenReturn(Optional.of(booking));
        when(bookingStatusHistoryRepository.findByBookingIdOrderByCreatedAtDesc(100L))
                .thenReturn(List.of(hStaff, hCustomer));

        BookingTrackingRequest req = BookingTrackingRequest.builder()
                .bookingCode("BK20261105-TRACK")
                .phone("0912345678")
                .build();

        BookingResponse response = bookingService.trackBooking(req);

        assertThat(response).isNotNull();
        assertThat(response.getBookingCode()).isEqualTo("BK20261105-TRACK");
        assertThat(response.getStatusHistories()).hasSize(2);
        assertThat(response.getStatusHistories().get(0).getChangedBy()).isEqualTo("CHICKIE_STUDIO");
        assertThat(response.getStatusHistories().get(1).getChangedBy()).isEqualTo("CUSTOMER");
    }

    @Test
    @DisplayName("BOK-005: trackBooking ném ResourceNotFoundException khi mã đơn không tồn tại")
    void trackBooking_codeNotFound() {
        when(bookingRepository.findByBookingCode("BK-UNKNOWN")).thenReturn(Optional.empty());

        BookingTrackingRequest req = BookingTrackingRequest.builder()
                .bookingCode("BK-UNKNOWN")
                .phone("0912345678")
                .build();

        assertThatThrownBy(() -> bookingService.trackBooking(req))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy đơn đặt thuê phù hợp");
    }

    @Test
    @DisplayName("BOK-005: trackBooking ném ResourceNotFoundException khi số điện thoại không khớp")
    void trackBooking_phoneMismatch() {
        Booking booking = Booking.builder()
                .id(101L)
                .bookingCode("BK-PHONE-TEST")
                .customerPhone("0912345678")
                .build();

        when(bookingRepository.findByBookingCode("BK-PHONE-TEST")).thenReturn(Optional.of(booking));

        BookingTrackingRequest req = BookingTrackingRequest.builder()
                .bookingCode("BK-PHONE-TEST")
                .phone("0999999999")
                .build();

        assertThatThrownBy(() -> bookingService.trackBooking(req))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy đơn đặt thuê phù hợp");
    }
}
