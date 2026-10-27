package com.chickiestudio.booking.service;

import com.chickiestudio.booking.dto.AvailableReplacementDto;
import com.chickiestudio.booking.dto.CalendarDispatchResponse;
import com.chickiestudio.booking.dto.ReassignItemRequest;
import com.chickiestudio.booking.dto.ReassignItemResponse;
import com.chickiestudio.booking.dto.RescheduleBookingRequest;
import com.chickiestudio.booking.dto.RescheduleBookingResponse;
import com.chickiestudio.booking.dto.TimelineDispatchResponse;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DispatchServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingItemRepository bookingItemRepository;

    @Mock
    private ProductItemRepository productItemRepository;

    @Mock
    private BookingStatusHistoryRepository bookingStatusHistoryRepository;

    @Mock
    private BookingService bookingService;

    @InjectMocks
    private DispatchService dispatchService;

    private Category costumeCategory;
    private Product dressProduct;
    private ProductVariant variantS;
    private ProductItem item01;
    private ProductItem item02;
    private Booking sampleBooking;
    private BookingItem sampleBookingItem;

    @BeforeEach
    void setUp() {
        costumeCategory = Category.builder()
                .id(1L)
                .name("Váy Dạ Hội")
                .type(CategoryType.COSTUME)
                .build();

        dressProduct = Product.builder()
                .id(10L)
                .name("Váy Dạ Hội Kim Sa Trắng")
                .category(costumeCategory)
                .rentalPrice(BigDecimal.valueOf(500000))
                .depositPrice(BigDecimal.valueOf(1000000))
                .build();

        variantS = ProductVariant.builder()
                .id(100L)
                .product(dressProduct)
                .size("S")
                .color("Trắng")
                .sku("DR-WHT-S")
                .build();

        item01 = ProductItem.builder()
                .id(101L)
                .variant(variantS)
                .itemCode("CK-DR-001")
                .status(ProductItemStatus.AVAILABLE)
                .rentalCount(3)
                .build();

        item02 = ProductItem.builder()
                .id(102L)
                .variant(variantS)
                .itemCode("CK-DR-002")
                .status(ProductItemStatus.AVAILABLE)
                .rentalCount(1)
                .build();

        sampleBooking = Booking.builder()
                .id(201L)
                .bookingCode("BK20261105-001")
                .customerName("Nguyễn Mai Anh")
                .customerPhone("0987654321")
                .customerEmail("maianh@example.com")
                .rentalStartDate(LocalDate.of(2026, 11, 5))
                .rentalEndDate(LocalDate.of(2026, 11, 7))
                .status(BookingStatus.CONFIRMED)
                .totalRentalPrice(BigDecimal.valueOf(1500000))
                .totalDepositPrice(BigDecimal.valueOf(1000000))
                .items(new ArrayList<>())
                .build();

        sampleBookingItem = BookingItem.builder()
                .id(301L)
                .booking(sampleBooking)
                .productItem(item01)
                .variant(variantS)
                .rentalStartDate(LocalDate.of(2026, 11, 5))
                .rentalEndDate(LocalDate.of(2026, 11, 7))
                .rentalPrice(BigDecimal.valueOf(1500000))
                .depositPrice(BigDecimal.valueOf(1000000))
                .build();

        sampleBooking.getItems().add(sampleBookingItem);
    }

    // ==========================================
    // 1. GET CALENDAR DATA TESTS
    // ==========================================

    @Test
    @DisplayName("getCalendarData: Thành công trả về danh sách đơn thuê trong tháng")
    void getCalendarData_Success() {
        LocalDate start = LocalDate.of(2026, 11, 1);
        LocalDate end = LocalDate.of(2026, 11, 30);

        when(bookingRepository.findCalendarBookings(eq(start), eq(end), eq(null), eq("Mai Anh"), eq(BookingStatus.CANCELLED)))
                .thenReturn(List.of(sampleBooking));

        CalendarDispatchResponse response = dispatchService.getCalendarData(start, end, null, "  Mai Anh  ");

        assertThat(response).isNotNull();
        assertThat(response.getStartDate()).isEqualTo(start);
        assertThat(response.getEndDate()).isEqualTo(end);
        assertThat(response.getTotalBookings()).isEqualTo(1);
        assertThat(response.getBookings()).hasSize(1);
        assertThat(response.getBookings().get(0).getBookingCode()).isEqualTo("BK20261105-001");
        assertThat(response.getBookings().get(0).getTotalAmount()).isEqualTo(BigDecimal.valueOf(2500000));
        assertThat(response.getBookings().get(0).getItems()).hasSize(1);
        assertThat(response.getBookings().get(0).getItems().get(0).getBarcode()).isEqualTo("CK-DR-001");
        assertThat(response.getBookings().get(0).getItems().get(0).getVariantInfo()).isEqualTo("S - Trắng");
    }

    @Test
    @DisplayName("getCalendarData: Mặc định ngày hiện tại khi startDate và endDate null, và search rỗng")
    void getCalendarData_DefaultDatesAndEmptySearch() {
        when(bookingRepository.findCalendarBookings(any(), any(), eq(BookingStatus.CONFIRMED), eq(null), eq(BookingStatus.CANCELLED)))
                .thenReturn(Collections.emptyList());

        CalendarDispatchResponse response = dispatchService.getCalendarData(null, null, BookingStatus.CONFIRMED, "   ");

        assertThat(response).isNotNull();
        assertThat(response.getTotalBookings()).isZero();
    }

    @Test
    @DisplayName("getCalendarData: Đơn không có items và giá null")
    void getCalendarData_NullItemsAndNullPrices() {
        Booking bareBooking = Booking.builder()
                .id(202L)
                .bookingCode("BK-BARE")
                .customerName("Khách Mới")
                .totalRentalPrice(null)
                .totalDepositPrice(null)
                .items(null)
                .build();

        LocalDate start = LocalDate.of(2026, 11, 1);
        LocalDate end = LocalDate.of(2026, 11, 30);

        when(bookingRepository.findCalendarBookings(eq(start), eq(end), eq(null), eq(null), eq(BookingStatus.CANCELLED)))
                .thenReturn(List.of(bareBooking));

        CalendarDispatchResponse response = dispatchService.getCalendarData(start, end, null, null);

        assertThat(response.getBookings().get(0).getTotalAmount()).isEqualTo(BigDecimal.ZERO);
        assertThat(response.getBookings().get(0).getItems()).isEmpty();
    }

    @Test
    @DisplayName("getCalendarData: Variant chỉ có size hoặc chỉ có color hoặc null")
    void getCalendarData_VariantVariations() {
        ProductVariant variantOnlySize = ProductVariant.builder().size("M").color(null).build();
        ProductVariant variantOnlyColor = ProductVariant.builder().size(null).color("Đỏ").build();

        BookingItem bi1 = BookingItem.builder().variant(variantOnlySize).build();
        BookingItem bi2 = BookingItem.builder().variant(variantOnlyColor).build();
        BookingItem bi3 = BookingItem.builder().variant(null).build();

        Booking testBooking = Booking.builder()
                .id(203L)
                .items(List.of(bi1, bi2, bi3))
                .build();

        LocalDate start = LocalDate.of(2026, 11, 1);
        LocalDate end = LocalDate.of(2026, 11, 30);

        when(bookingRepository.findCalendarBookings(any(), any(), any(), any(), any()))
                .thenReturn(List.of(testBooking));

        CalendarDispatchResponse response = dispatchService.getCalendarData(start, end, null, null);

        assertThat(response.getBookings().get(0).getItems().get(0).getVariantInfo()).isEqualTo("M");
        assertThat(response.getBookings().get(0).getItems().get(1).getVariantInfo()).isEqualTo("Đỏ");
        assertThat(response.getBookings().get(0).getItems().get(2).getVariantInfo()).isEmpty();
    }

    @Test
    @DisplayName("getCalendarData: Ngày kết thúc trước ngày bắt đầu ném BadRequestException")
    void getCalendarData_InvalidDateRange() {
        LocalDate start = LocalDate.of(2026, 11, 30);
        LocalDate end = LocalDate.of(2026, 11, 1);

        assertThatThrownBy(() -> dispatchService.getCalendarData(start, end, null, null))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Ngày kết thúc không thể trước ngày bắt đầu");
    }

    // ==========================================
    // 2. GET TIMELINE DATA TESTS
    // ==========================================

    @Test
    @DisplayName("getTimelineData: Thành công trả về danh sách tài nguyên và các sự kiện chiếm dụng")
    void getTimelineData_Success() {
        LocalDate start = LocalDate.of(2026, 11, 1);
        LocalDate end = LocalDate.of(2026, 11, 30);

        // Tạo sự kiện nằm ngoài phạm vi ngày
        BookingItem outsideItem = BookingItem.builder()
                .productItem(item01)
                .rentalStartDate(LocalDate.of(2026, 12, 10))
                .rentalEndDate(LocalDate.of(2026, 12, 12))
                .booking(sampleBooking)
                .build();

        BookingItem nullProductItem = BookingItem.builder()
                .productItem(null)
                .build();

        ProductItem itemNoCategory = ProductItem.builder()
                .id(103L)
                .itemCode("CK-NO-CAT")
                .variant(ProductVariant.builder().product(Product.builder().category(null).build()).build())
                .status(ProductItemStatus.AVAILABLE)
                .build();

        when(productItemRepository.findTimelineResources(eq(null), eq(null)))
                .thenReturn(List.of(item01, item02, itemNoCategory));

        when(bookingItemRepository.findTimelineEvents(any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(List.of(sampleBookingItem, outsideItem, nullProductItem));

        when(bookingService.calculateBufferDays(any())).thenReturn(1);

        TimelineDispatchResponse response = dispatchService.getTimelineData(start, end, null, null);

        assertThat(response).isNotNull();
        assertThat(response.getResources()).hasSize(3);

        // Item 01 có 1 sự kiện hợp lệ (outsideItem bị loại)
        assertThat(response.getResources().get(0).getBarcode()).isEqualTo("CK-DR-001");
        assertThat(response.getResources().get(0).getEvents()).hasSize(1);
        assertThat(response.getResources().get(0).getEvents().get(0).getBookingCode()).isEqualTo("BK20261105-001");
        assertThat(response.getResources().get(0).getEvents().get(0).getBufferDays()).isEqualTo(1);
        assertThat(response.getResources().get(0).getEvents().get(0).getBufferEndDate()).isEqualTo(LocalDate.of(2026, 11, 8));

        // Item 02 không có sự kiện
        assertThat(response.getResources().get(1).getBarcode()).isEqualTo("CK-DR-002");
        assertThat(response.getResources().get(1).getEvents()).isEmpty();

        // Item không có category rơi về default COSTUME
        assertThat(response.getResources().get(2).getCategoryType()).isEqualTo(CategoryType.COSTUME);
    }

    @Test
    @DisplayName("getTimelineData: Mặc định ngày hiện tại khi startDate và endDate null")
    void getTimelineData_DefaultDates() {
        when(productItemRepository.findTimelineResources(eq(1L), eq("Váy")))
                .thenReturn(Collections.emptyList());
        when(bookingItemRepository.findTimelineEvents(any(), any(), any()))
                .thenReturn(Collections.emptyList());

        TimelineDispatchResponse response = dispatchService.getTimelineData(null, null, 1L, "Váy");

        assertThat(response).isNotNull();
        assertThat(response.getResources()).isEmpty();
    }

    @Test
    @DisplayName("getTimelineData: Ngày kết thúc trước ngày bắt đầu ném BadRequestException")
    void getTimelineData_InvalidDateRange() {
        LocalDate start = LocalDate.of(2026, 11, 20);
        LocalDate end = LocalDate.of(2026, 11, 10);

        assertThatThrownBy(() -> dispatchService.getTimelineData(start, end, null, null))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Ngày kết thúc không thể trước ngày bắt đầu");
    }

    // ==========================================
    // 3. GET AVAILABLE REPLACEMENTS TESTS
    // ==========================================

    @Test
    @DisplayName("getAvailableReplacements: Thành công trả về danh sách món đồ cùng size/màu")
    void getAvailableReplacements_Success() {
        ProductItem retiredItem = ProductItem.builder()
                .id(104L)
                .variant(variantS)
                .itemCode("CK-DR-RETIRED")
                .status(ProductItemStatus.RETIRED)
                .build();

        ProductItem maintenanceItem = ProductItem.builder()
                .id(105L)
                .variant(variantS)
                .itemCode("CK-DR-MAINT")
                .status(ProductItemStatus.MAINTENANCE)
                .build();

        BookingItem nullItemBi = BookingItem.builder().id(999L).productItem(null).build();

        when(bookingItemRepository.findById(301L)).thenReturn(Optional.of(sampleBookingItem));
        when(bookingService.calculateBufferDays(any())).thenReturn(1);
        when(productItemRepository.findByVariantIdOrderByIdAsc(100L)).thenReturn(List.of(item01, item02, retiredItem, maintenanceItem));
        when(bookingItemRepository.findOverlappingItems(any(), any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(List.of(sampleBookingItem, nullItemBi));

        List<AvailableReplacementDto> replacements = dispatchService.getAvailableReplacements(301L);

        assertThat(replacements).hasSize(4);

        AvailableReplacementDto first = replacements.get(0);
        assertThat(first.getBarcode()).isEqualTo("CK-DR-001");
        assertThat(first.isCurrent()).isTrue();

        AvailableReplacementDto second = replacements.get(1);
        assertThat(second.getBarcode()).isEqualTo("CK-DR-002");
        assertThat(second.isCurrent()).isFalse();
        assertThat(second.isAvailable()).isTrue();

        // RETIRED & MAINTENANCE items must not be available
        assertThat(replacements.get(2).isAvailable()).isFalse();
        assertThat(replacements.get(3).isAvailable()).isFalse();
    }

    @Test
    @DisplayName("getAvailableReplacements: Không tìm thấy bookingItem ném ResourceNotFoundException")
    void getAvailableReplacements_NotFound() {
        when(bookingItemRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dispatchService.getAvailableReplacements(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy món đồ đơn thuê với ID: 999");
    }

    // ==========================================
    // 4. REASSIGN ITEM TESTS
    // ==========================================

    @Test
    @DisplayName("reassignItem: Thành công đổi sang món đồ khả dụng cùng biến thể")
    void reassignItem_Success() {
        ReassignItemRequest request = ReassignItemRequest.builder()
                .bookingItemId(301L)
                .newItemId(102L)
                .reason("Món đồ cũ bị rách gấu váy nhẹ")
                .build();

        when(bookingItemRepository.findById(301L)).thenReturn(Optional.of(sampleBookingItem));
        when(productItemRepository.findById(102L)).thenReturn(Optional.of(item02));
        when(bookingService.calculateBufferDays(any())).thenReturn(1);
        when(bookingItemRepository.findOverlappingItemsByProductItem(eq(102L), any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(Collections.emptyList());

        ReassignItemResponse response = dispatchService.reassignItem(request, "admin_user");

        assertThat(response).isNotNull();
        assertThat(response.getBookingCode()).isEqualTo("BK20261105-001");
        assertThat(response.getOldBarcode()).isEqualTo("CK-DR-001");
        assertThat(response.getNewBarcode()).isEqualTo("CK-DR-002");
        assertThat(response.getChangedBy()).isEqualTo("admin_user");

        verify(bookingItemRepository, times(1)).save(sampleBookingItem);
        verify(bookingStatusHistoryRepository, times(1)).save(any(BookingStatusHistory.class));
        assertThat(sampleBookingItem.getProductItem()).isEqualTo(item02);
    }

    @Test
    @DisplayName("reassignItem: Khi username null thì mặc định changedBy là STAFF")
    void reassignItem_DefaultUsername() {
        ReassignItemRequest request = ReassignItemRequest.builder()
                .bookingItemId(301L)
                .newItemId(102L)
                .reason("Đổi đồ không có username")
                .build();

        when(bookingItemRepository.findById(301L)).thenReturn(Optional.of(sampleBookingItem));
        when(productItemRepository.findById(102L)).thenReturn(Optional.of(item02));
        when(bookingService.calculateBufferDays(any())).thenReturn(1);
        when(bookingItemRepository.findOverlappingItemsByProductItem(eq(102L), any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(Collections.emptyList());

        ReassignItemResponse response = dispatchService.reassignItem(request, null);

        assertThat(response.getChangedBy()).isEqualTo("STAFF");
    }

    @Test
    @DisplayName("reassignItem: Không tìm thấy bookingItemId ném ResourceNotFoundException")
    void reassignItem_BookingItemNotFound() {
        ReassignItemRequest request = ReassignItemRequest.builder()
                .bookingItemId(999L)
                .newItemId(102L)
                .reason("Đổi đồ")
                .build();

        when(bookingItemRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dispatchService.reassignItem(request, "staff"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy món đồ đơn thuê với ID: 999");
    }

    @Test
    @DisplayName("reassignItem: Không tìm thấy newItemId ném ResourceNotFoundException")
    void reassignItem_NewItemNotFound() {
        ReassignItemRequest request = ReassignItemRequest.builder()
                .bookingItemId(301L)
                .newItemId(999L)
                .reason("Đổi đồ không tồn tại")
                .build();

        when(bookingItemRepository.findById(301L)).thenReturn(Optional.of(sampleBookingItem));
        when(productItemRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dispatchService.reassignItem(request, "staff"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy món đồ thay thế với ID: 999");
    }

    @Test
    @DisplayName("reassignItem: Món đồ thay thế ở trạng thái RETIRED hoặc MAINTENANCE ném BadRequestException")
    void reassignItem_RetiredOrMaintenance() {
        ProductItem retired = ProductItem.builder().id(888L).itemCode("CK-RET").status(ProductItemStatus.RETIRED).build();
        ProductItem maint = ProductItem.builder().id(889L).itemCode("CK-MAINT").status(ProductItemStatus.MAINTENANCE).build();

        ReassignItemRequest req1 = ReassignItemRequest.builder().bookingItemId(301L).newItemId(888L).reason("Đổi đồ").build();
        ReassignItemRequest req2 = ReassignItemRequest.builder().bookingItemId(301L).newItemId(889L).reason("Đổi đồ").build();

        when(bookingItemRepository.findById(301L)).thenReturn(Optional.of(sampleBookingItem));
        when(productItemRepository.findById(888L)).thenReturn(Optional.of(retired));
        when(productItemRepository.findById(889L)).thenReturn(Optional.of(maint));

        assertThatThrownBy(() -> dispatchService.reassignItem(req1, "staff"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("đang ở trạng thái RETIRED");

        assertThatThrownBy(() -> dispatchService.reassignItem(req2, "staff"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("đang ở trạng thái MAINTENANCE");
    }

    @Test
    @DisplayName("reassignItem: Đơn đã RETURNED/COMPLETED/CANCELLED ném BadRequestException")
    void reassignItem_InvalidBookingStatus() {
        sampleBooking.setStatus(BookingStatus.RETURNED);
        ReassignItemRequest request = ReassignItemRequest.builder()
                .bookingItemId(301L)
                .newItemId(102L)
                .reason("Đổi đồ sau khi trả")
                .build();

        when(bookingItemRepository.findById(301L)).thenReturn(Optional.of(sampleBookingItem));

        assertThatThrownBy(() -> dispatchService.reassignItem(request, "staff_user"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Không thể điều phối đổi món đồ cho đơn thuê ở trạng thái RETURNED");
    }

    @Test
    @DisplayName("reassignItem: Chọn trùng món đồ hiện tại ném BadRequestException")
    void reassignItem_SameItem() {
        ReassignItemRequest request = ReassignItemRequest.builder()
                .bookingItemId(301L)
                .newItemId(101L)
                .reason("Đổi trùng món cũ")
                .build();

        when(bookingItemRepository.findById(301L)).thenReturn(Optional.of(sampleBookingItem));
        when(productItemRepository.findById(101L)).thenReturn(Optional.of(item01));

        assertThatThrownBy(() -> dispatchService.reassignItem(request, "staff_user"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Món đồ thay thế phải khác món đồ hiện tại");
    }

    @Test
    @DisplayName("reassignItem: Món đồ thay thế khác biến thể (BR-02) ném BadRequestException")
    void reassignItem_DifferentVariant() {
        ProductVariant variantM = ProductVariant.builder()
                .id(105L)
                .product(dressProduct)
                .size("M")
                .color("Trắng")
                .build();

        ProductItem itemM = ProductItem.builder()
                .id(105L)
                .variant(variantM)
                .itemCode("CK-DR-005")
                .status(ProductItemStatus.AVAILABLE)
                .build();

        ReassignItemRequest request = ReassignItemRequest.builder()
                .bookingItemId(301L)
                .newItemId(105L)
                .reason("Thử đổi sang size M")
                .build();

        when(bookingItemRepository.findById(301L)).thenReturn(Optional.of(sampleBookingItem));
        when(productItemRepository.findById(105L)).thenReturn(Optional.of(itemM));

        assertThatThrownBy(() -> dispatchService.reassignItem(request, "staff_user"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Món đồ thay thế phải cùng biến thể (Size/Màu)");
    }

    @Test
    @DisplayName("reassignItem: Món đồ thay thế bị trùng lịch với đơn khác ném ConflictException")
    void reassignItem_Conflict() {
        ReassignItemRequest request = ReassignItemRequest.builder()
                .bookingItemId(301L)
                .newItemId(102L)
                .reason("Đổi sang món 002 đang bận")
                .build();

        Booking otherBooking = Booking.builder()
                .id(501L)
                .bookingCode("BK-OTHER-999")
                .status(BookingStatus.DEPOSITED)
                .build();

        BookingItem conflictingItem = BookingItem.builder()
                .id(601L)
                .booking(otherBooking)
                .productItem(item02)
                .rentalStartDate(LocalDate.of(2026, 11, 6))
                .rentalEndDate(LocalDate.of(2026, 11, 8))
                .build();

        when(bookingItemRepository.findById(301L)).thenReturn(Optional.of(sampleBookingItem));
        when(productItemRepository.findById(102L)).thenReturn(Optional.of(item02));
        when(bookingService.calculateBufferDays(any())).thenReturn(1);
        when(bookingItemRepository.findOverlappingItemsByProductItem(eq(102L), any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(List.of(conflictingItem));
        when(bookingService.isIntervalOverlappingWithBuffer(any(), any(), any(), any(), anyInt()))
                .thenReturn(true);

        assertThatThrownBy(() -> dispatchService.reassignItem(request, "staff_user"))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("đã có người đặt trong khoảng thời gian");

        verify(bookingItemRepository, never()).save(any());
    }

    // ==========================================
    // 5. RESCHEDULE BOOKING TESTS
    // ==========================================

    @Test
    @DisplayName("rescheduleBooking: Thành công dời ngày thuê và tính toán lại giá thuê")
    void rescheduleBooking_Success() {
        RescheduleBookingRequest request = RescheduleBookingRequest.builder()
                .bookingId(201L)
                .newStartDate(LocalDate.of(2026, 11, 10))
                .newEndDate(LocalDate.of(2026, 11, 13)) // 4 ngày
                .reason("Khách dời lịch cưới do gia đình có việc")
                .build();

        when(bookingRepository.findById(201L)).thenReturn(Optional.of(sampleBooking));
        when(bookingService.calculateBufferDays(any())).thenReturn(1);
        when(bookingItemRepository.findOverlappingItemsByProductItem(eq(101L), any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(Collections.emptyList());

        RescheduleBookingResponse response = dispatchService.rescheduleBooking(request, "admin_user");

        assertThat(response).isNotNull();
        assertThat(response.getBookingCode()).isEqualTo("BK20261105-001");
        assertThat(response.getNewStartDate()).isEqualTo(LocalDate.of(2026, 11, 10));
        assertThat(response.getNewEndDate()).isEqualTo(LocalDate.of(2026, 11, 13));
        assertThat(response.getDurationDays()).isEqualTo(4);
        // 4 ngày * 500,000 = 2,000,000
        assertThat(response.getTotalRentalPrice()).isEqualByComparingTo(BigDecimal.valueOf(2000000));

        verify(bookingRepository, times(1)).save(sampleBooking);
        verify(bookingStatusHistoryRepository, times(1)).save(any(BookingStatusHistory.class));
    }

    @Test
    @DisplayName("rescheduleBooking: Khi username rỗng/null thì mặc định changedBy là STAFF")
    void rescheduleBooking_DefaultUsername() {
        RescheduleBookingRequest request = RescheduleBookingRequest.builder()
                .bookingId(201L)
                .newStartDate(LocalDate.of(2026, 11, 10))
                .newEndDate(LocalDate.of(2026, 11, 13))
                .reason("Khách dời lịch")
                .build();

        when(bookingRepository.findById(201L)).thenReturn(Optional.of(sampleBooking));
        when(bookingService.calculateBufferDays(any())).thenReturn(1);
        when(bookingItemRepository.findOverlappingItemsByProductItem(eq(101L), any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(Collections.emptyList());

        RescheduleBookingResponse response = dispatchService.rescheduleBooking(request, "   ");

        assertThat(response.getChangedBy()).isEqualTo("STAFF");
    }

    @Test
    @DisplayName("rescheduleBooking: Không tìm thấy bookingId ném ResourceNotFoundException")
    void rescheduleBooking_BookingNotFound() {
        RescheduleBookingRequest request = RescheduleBookingRequest.builder()
                .bookingId(999L)
                .newStartDate(LocalDate.of(2026, 11, 10))
                .newEndDate(LocalDate.of(2026, 11, 12))
                .reason("Dời ngày")
                .build();

        when(bookingRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dispatchService.rescheduleBooking(request, "staff"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy đơn đặt thuê với ID: 999");
    }

    @Test
    @DisplayName("rescheduleBooking: Ngày kết thúc trước ngày bắt đầu ném BadRequestException")
    void rescheduleBooking_InvalidDateOrder() {
        RescheduleBookingRequest request = RescheduleBookingRequest.builder()
                .bookingId(201L)
                .newStartDate(LocalDate.of(2026, 11, 15))
                .newEndDate(LocalDate.of(2026, 11, 10))
                .reason("Nhập nhầm ngày")
                .build();

        assertThatThrownBy(() -> dispatchService.rescheduleBooking(request, "staff_user"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Ngày kết thúc không thể trước ngày bắt đầu");
    }

    @Test
    @DisplayName("rescheduleBooking: Đơn ở trạng thái DELIVERED ném BadRequestException")
    void rescheduleBooking_DeliveredStatus() {
        sampleBooking.setStatus(BookingStatus.DELIVERED);
        RescheduleBookingRequest request = RescheduleBookingRequest.builder()
                .bookingId(201L)
                .newStartDate(LocalDate.of(2026, 11, 10))
                .newEndDate(LocalDate.of(2026, 11, 12))
                .reason("Khách đang giữ đồ xin dời ngày")
                .build();

        when(bookingRepository.findById(201L)).thenReturn(Optional.of(sampleBooking));

        assertThatThrownBy(() -> dispatchService.rescheduleBooking(request, "staff_user"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Không thể dời ngày đơn thuê ở trạng thái DELIVERED");
    }

    @Test
    @DisplayName("rescheduleBooking: Ngày mới trùng ngày cũ ném BadRequestException")
    void rescheduleBooking_SameDates() {
        RescheduleBookingRequest request = RescheduleBookingRequest.builder()
                .bookingId(201L)
                .newStartDate(LocalDate.of(2026, 11, 5))
                .newEndDate(LocalDate.of(2026, 11, 7))
                .reason("Không thay đổi ngày")
                .build();

        when(bookingRepository.findById(201L)).thenReturn(Optional.of(sampleBooking));

        assertThatThrownBy(() -> dispatchService.rescheduleBooking(request, "staff_user"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Khoảng thời gian mới trùng với thời gian hiện tại của đơn");
    }

    @Test
    @DisplayName("rescheduleBooking: Bị trùng lịch với đơn khác tại khoảng ngày mới ném ConflictException")
    void rescheduleBooking_Conflict() {
        RescheduleBookingRequest request = RescheduleBookingRequest.builder()
                .bookingId(201L)
                .newStartDate(LocalDate.of(2026, 11, 10))
                .newEndDate(LocalDate.of(2026, 11, 12))
                .reason("Dời ngày vào ngày món đồ đã kín lịch")
                .build();

        Booking otherBooking = Booking.builder()
                .id(888L)
                .bookingCode("BK-CONFLICT-1")
                .build();

        BookingItem conflictingItem = BookingItem.builder()
                .id(999L)
                .booking(otherBooking)
                .productItem(item01)
                .rentalStartDate(LocalDate.of(2026, 11, 12))
                .rentalEndDate(LocalDate.of(2026, 11, 14))
                .build();

        when(bookingRepository.findById(201L)).thenReturn(Optional.of(sampleBooking));
        when(bookingService.calculateBufferDays(any())).thenReturn(1);
        when(bookingItemRepository.findOverlappingItemsByProductItem(eq(101L), any(), any(), eq(BookingStatus.CANCELLED)))
                .thenReturn(List.of(conflictingItem));
        when(bookingService.isIntervalOverlappingWithBuffer(any(), any(), any(), any(), anyInt()))
                .thenReturn(true);

        assertThatThrownBy(() -> dispatchService.rescheduleBooking(request, "staff_user"))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Không thể dời ngày: Món đồ CK-DR-001 đã có người đặt");

        verify(bookingRepository, never()).save(any());
    }
}
