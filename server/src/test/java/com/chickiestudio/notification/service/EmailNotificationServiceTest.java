package com.chickiestudio.notification.service;

import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.booking.entity.BookingItem;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.repository.BookingRepository;
import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.notification.dto.NotificationLogResponse;
import com.chickiestudio.notification.entity.NotificationChannel;
import com.chickiestudio.notification.entity.NotificationLog;
import com.chickiestudio.notification.entity.NotificationStatus;
import com.chickiestudio.notification.entity.NotificationTemplateType;
import com.chickiestudio.notification.mapper.NotificationLogMapper;
import com.chickiestudio.notification.repository.NotificationLogRepository;
import com.chickiestudio.notification.service.impl.EmailNotificationServiceImpl;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductVariant;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmailNotificationServiceTest {

    @Mock
    private ObjectProvider<JavaMailSender> mailSenderProvider;

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private ITemplateEngine templateEngine;

    @Mock
    private NotificationLogRepository notificationLogRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private NotificationLogMapper notificationLogMapper;

    @InjectMocks
    private EmailNotificationServiceImpl emailNotificationService;

    private Booking testBooking;
    private MimeMessage mimeMessage;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(emailNotificationService, "fromEmail", "chickiestudio.rental@gmail.com");
        ReflectionTestUtils.setField(emailNotificationService, "fromName", "Chickie Studio");
        ReflectionTestUtils.setField(emailNotificationService, "mailEnabled", true);
        ReflectionTestUtils.setField(emailNotificationService, "clientBaseUrl", "http://localhost:3000");

        Product product = Product.builder().name("Váy Dạ Hội Ruby").build();
        ProductVariant variant = ProductVariant.builder().product(product).size("M").build();
        BookingItem item = BookingItem.builder()
                .variant(variant)
                .rentalPrice(new BigDecimal("350000"))
                .depositPrice(new BigDecimal("500000"))
                .build();

        List<BookingItem> items = new ArrayList<>();
        items.add(item);

        testBooking = Booking.builder()
                .id(1L)
                .bookingCode("BK20261105-0001")
                .customerName("Nguyễn Phương Anh")
                .customerPhone("0901234567")
                .customerEmail("phuonganh@gmail.com")
                .deliveryMethod("PICKUP_STORE")
                .rentalStartDate(LocalDate.of(2026, 11, 1))
                .rentalEndDate(LocalDate.of(2026, 11, 3))
                .status(BookingStatus.PENDING)
                .totalRentalPrice(new BigDecimal("350000"))
                .totalDepositPrice(new BigDecimal("500000"))
                .items(items)
                .build();

        mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
    }

    @Test
    @DisplayName("Gửi email xác nhận đặt đơn thành công khi email hợp lệ và mailEnabled=true")
    void sendBookingConfirmation_success() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("email/booking-confirmation"), any(Context.class)))
                .thenReturn("<html><body>Xác nhận đơn</body></html>");

        emailNotificationService.sendBookingConfirmation(testBooking);

        verify(mailSender).send(mimeMessage);
        ArgumentCaptor<NotificationLog> logCaptor = ArgumentCaptor.forClass(NotificationLog.class);
        verify(notificationLogRepository).save(logCaptor.capture());

        NotificationLog savedLog = logCaptor.getValue();
        assertThat(savedLog.getBookingId()).isEqualTo(1L);
        assertThat(savedLog.getRecipientEmail()).isEqualTo("phuonganh@gmail.com");
        assertThat(savedLog.getChannel()).isEqualTo(NotificationChannel.EMAIL);
        assertThat(savedLog.getTemplateType()).isEqualTo(NotificationTemplateType.BOOKING_CONFIRMATION);
        assertThat(savedLog.getStatus()).isEqualTo(NotificationStatus.SENT);
    }

    @Test
    @DisplayName("Không gửi mail khi email khách hàng null hoặc trống")
    void sendBookingConfirmation_noEmail() {
        testBooking.setCustomerEmail(null);

        emailNotificationService.sendBookingConfirmation(testBooking);

        verify(notificationLogRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ghi log MOCK khi mailEnabled=false")
    void sendBookingConfirmation_mailDisabled() {
        ReflectionTestUtils.setField(emailNotificationService, "mailEnabled", false);

        emailNotificationService.sendBookingConfirmation(testBooking);

        ArgumentCaptor<NotificationLog> logCaptor = ArgumentCaptor.forClass(NotificationLog.class);
        verify(notificationLogRepository).save(logCaptor.capture());

        NotificationLog savedLog = logCaptor.getValue();
        assertThat(savedLog.getStatus()).isEqualTo(NotificationStatus.SENT);
        assertThat(savedLog.getProviderMessageId()).startsWith("MOCK-");
    }

    @Test
    @DisplayName("Ghi log FAILED khi JavaMailSender ném ngoại lệ MailSendException")
    void sendBookingConfirmation_mailException() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("email/booking-confirmation"), any(Context.class)))
                .thenReturn("<html><body>Error</body></html>");
        doThrow(new MailSendException("SMTP connection timed out")).when(mailSender).send(any(MimeMessage.class));

        emailNotificationService.sendBookingConfirmation(testBooking);

        ArgumentCaptor<NotificationLog> logCaptor = ArgumentCaptor.forClass(NotificationLog.class);
        verify(notificationLogRepository).save(logCaptor.capture());

        NotificationLog savedLog = logCaptor.getValue();
        assertThat(savedLog.getStatus()).isEqualTo(NotificationStatus.FAILED);
        assertThat(savedLog.getErrorMessage()).contains("SMTP connection timed out");
    }

    @Test
    @DisplayName("Gửi email nhận cọc thành công (DEPOSIT_RECEIVED)")
    void sendDepositReceived_success() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("email/deposit-received"), any(Context.class)))
                .thenReturn("<html><body>Đã nhận cọc</body></html>");

        emailNotificationService.sendDepositReceived(testBooking);

        verify(mailSender).send(mimeMessage);
        ArgumentCaptor<NotificationLog> logCaptor = ArgumentCaptor.forClass(NotificationLog.class);
        verify(notificationLogRepository).save(logCaptor.capture());
        assertThat(logCaptor.getValue().getTemplateType()).isEqualTo(NotificationTemplateType.DEPOSIT_RECEIVED);
    }

    @Test
    @DisplayName("Gửi email nhắc lịch nhận đồ (PICKUP_REMINDER)")
    void sendPickupReminder_success() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("email/pickup-reminder"), any(Context.class)))
                .thenReturn("<html><body>Nhắc nhận đồ</body></html>");

        emailNotificationService.sendPickupReminder(testBooking);

        verify(mailSender).send(mimeMessage);
        ArgumentCaptor<NotificationLog> logCaptor = ArgumentCaptor.forClass(NotificationLog.class);
        verify(notificationLogRepository).save(logCaptor.capture());
        assertThat(logCaptor.getValue().getTemplateType()).isEqualTo(NotificationTemplateType.PICKUP_REMINDER);
    }

    @Test
    @DisplayName("Gửi email nhắc lịch trả đồ (RETURN_REMINDER)")
    void sendReturnReminder_success() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("email/return-reminder"), any(Context.class)))
                .thenReturn("<html><body>Nhắc trả đồ</body></html>");

        emailNotificationService.sendReturnReminder(testBooking);

        verify(mailSender).send(mimeMessage);
        ArgumentCaptor<NotificationLog> logCaptor = ArgumentCaptor.forClass(NotificationLog.class);
        verify(notificationLogRepository).save(logCaptor.capture());
        assertThat(logCaptor.getValue().getTemplateType()).isEqualTo(NotificationTemplateType.RETURN_REMINDER);
    }

    @Test
    @DisplayName("Gửi email hoàn cọc & hoàn tất đơn (RETURN_COMPLETED)")
    void sendReturnCompleted_success() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("email/return-completed"), any(Context.class)))
                .thenReturn("<html><body>Hoàn cọc</body></html>");

        emailNotificationService.sendReturnCompleted(testBooking);

        verify(mailSender).send(mimeMessage);
        ArgumentCaptor<NotificationLog> logCaptor = ArgumentCaptor.forClass(NotificationLog.class);
        verify(notificationLogRepository).save(logCaptor.capture());
        assertThat(logCaptor.getValue().getTemplateType()).isEqualTo(NotificationTemplateType.RETURN_COMPLETED);
    }

    @Test
    @DisplayName("Gửi email thông báo hết hạn giữ chỗ (BOOKING_EXPIRED)")
    void sendBookingExpired_success() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("email/booking-expired"), any(Context.class)))
                .thenReturn("<html><body>Hết hạn giữ chỗ</body></html>");

        emailNotificationService.sendBookingExpired(testBooking);

        verify(mailSender).send(mimeMessage);
        ArgumentCaptor<NotificationLog> logCaptor = ArgumentCaptor.forClass(NotificationLog.class);
        verify(notificationLogRepository).save(logCaptor.capture());
        assertThat(logCaptor.getValue().getTemplateType()).isEqualTo(NotificationTemplateType.BOOKING_EXPIRED);
    }

    @Test
    @DisplayName("Gửi email xác nhận lịch thử đồ (FITTING_CONFIRMATION)")
    void sendFittingConfirmation_success() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq("email/fitting-confirmation"), any(Context.class)))
                .thenReturn("<html><body>Thử đồ showroom</body></html>");

        emailNotificationService.sendFittingConfirmation("customer@gmail.com", "Lê Thúy", "15:00 Thứ 7", "Thử đầm cưới");

        verify(mailSender).send(mimeMessage);
        ArgumentCaptor<NotificationLog> logCaptor = ArgumentCaptor.forClass(NotificationLog.class);
        verify(notificationLogRepository).save(logCaptor.capture());
        assertThat(logCaptor.getValue().getTemplateType()).isEqualTo(NotificationTemplateType.FITTING_CONFIRMATION);
    }

    @Test
    @DisplayName("sendFittingConfirmation bỏ qua khi email null")
    void sendFittingConfirmation_nullEmail() {
        emailNotificationService.sendFittingConfirmation(null, "Khách", "10:00", null);
        verify(notificationLogRepository, never()).save(any());
    }

    @Test
    @DisplayName("resendEmail gửi lại email thành công và trả về DTO")
    void resendEmail_success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class)))
                .thenReturn("<html><body>Resend</body></html>");

        NotificationLog savedLog = NotificationLog.builder()
                .id(99L)
                .bookingId(1L)
                .recipientEmail("phuonganh@gmail.com")
                .templateType(NotificationTemplateType.BOOKING_CONFIRMATION)
                .status(NotificationStatus.SENT)
                .build();
        when(notificationLogRepository.save(any(NotificationLog.class))).thenReturn(savedLog);
        when(notificationLogMapper.toResponse(savedLog)).thenReturn(
                NotificationLogResponse.builder().id(99L).status(NotificationStatus.SENT).build()
        );

        NotificationLogResponse response = emailNotificationService.resendEmail(1L, NotificationTemplateType.BOOKING_CONFIRMATION);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(99L);
        assertThat(response.getStatus()).isEqualTo(NotificationStatus.SENT);
    }

    @Test
    @DisplayName("resendEmail ném ResourceNotFoundException khi không tìm thấy booking")
    void resendEmail_bookingNotFound() {
        when(bookingRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> emailNotificationService.resendEmail(999L, NotificationTemplateType.BOOKING_CONFIRMATION))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("resendEmail ném BadRequestException khi booking không có email")
    void resendEmail_bookingHasNoEmail() {
        testBooking.setCustomerEmail(null);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));

        assertThatThrownBy(() -> emailNotificationService.resendEmail(1L, NotificationTemplateType.BOOKING_CONFIRMATION))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("chưa có địa chỉ email hợp lệ");
    }

    @Test
    @DisplayName("resendEmail ném BadRequestException khi templateType không hỗ trợ đơn hàng")
    void resendEmail_unsupportedTemplate() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));

        assertThatThrownBy(() -> emailNotificationService.resendEmail(1L, NotificationTemplateType.FITTING_CONFIRMATION))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Loại template không hỗ trợ");
    }

    @Test
    @DisplayName("getLogsByBookingId trả về danh sách lịch sử thông báo")
    void getLogsByBookingId_success() {
        NotificationLog logRecord = NotificationLog.builder().id(10L).bookingId(1L).build();
        when(notificationLogRepository.findByBookingIdOrderBySentAtDesc(1L)).thenReturn(List.of(logRecord));
        when(notificationLogMapper.toResponseList(any())).thenReturn(
                List.of(NotificationLogResponse.builder().id(10L).bookingId(1L).build())
        );

        List<NotificationLogResponse> logs = emailNotificationService.getLogsByBookingId(1L);

        assertThat(logs).hasSize(1);
        assertThat(logs.get(0).getId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("sendBookingStatusNotification kích hoạt gửi email tương ứng với từng trạng thái")
    void sendBookingStatusNotification_allBranches() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>Ok</html>");

        // CONFIRMED
        emailNotificationService.sendBookingStatusNotification(testBooking, BookingStatus.CONFIRMED);
        // COMPLETED
        emailNotificationService.sendBookingStatusNotification(testBooking, BookingStatus.COMPLETED);
        // CANCELLED
        emailNotificationService.sendBookingStatusNotification(testBooking, BookingStatus.CANCELLED);
        // Trạng thái khác
        emailNotificationService.sendBookingStatusNotification(testBooking, BookingStatus.DELIVERED);
        // Booking null hoặc status null hoặc email null
        emailNotificationService.sendBookingStatusNotification(null, BookingStatus.CONFIRMED);
        emailNotificationService.sendBookingStatusNotification(testBooking, null);

        testBooking.setCustomerEmail("");
        emailNotificationService.sendBookingStatusNotification(testBooking, BookingStatus.CONFIRMED);

        verify(notificationLogRepository, times(3)).save(any());
    }

    @Test
    @DisplayName("Các hàm nhắc lịch và thông báo bỏ qua khi email null")
    void notifications_ignoreWhenEmailNull() {
        testBooking.setCustomerEmail(null);

        emailNotificationService.sendDepositReceived(testBooking);
        emailNotificationService.sendPickupReminder(testBooking);
        emailNotificationService.sendReturnReminder(testBooking);
        emailNotificationService.sendReturnCompleted(testBooking);
        emailNotificationService.sendBookingExpired(testBooking);

        verify(notificationLogRepository, never()).save(any());
    }

    @Test
    @DisplayName("resendEmail hỗ trợ các loại template kịch bản khác nhau")
    void resendEmail_otherTemplates_success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>Ok</html>");
        when(notificationLogRepository.save(any(NotificationLog.class))).thenReturn(new NotificationLog());

        emailNotificationService.resendEmail(1L, NotificationTemplateType.DEPOSIT_RECEIVED);
        emailNotificationService.resendEmail(1L, NotificationTemplateType.PICKUP_REMINDER);
        emailNotificationService.resendEmail(1L, NotificationTemplateType.RETURN_REMINDER);
        emailNotificationService.resendEmail(1L, NotificationTemplateType.RETURN_COMPLETED);
        emailNotificationService.resendEmail(1L, NotificationTemplateType.BOOKING_EXPIRED);

        verify(notificationLogRepository, times(10)).save(any()); // 5 lần gửi + 5 lần lưu log resend
    }

    @Test
    @DisplayName("Ghi log SIMULATED khi JavaMailSender provider trả về null")
    void sendHtmlEmail_mailSenderNull() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(null);

        emailNotificationService.sendBookingConfirmation(testBooking);

        ArgumentCaptor<NotificationLog> logCaptor = ArgumentCaptor.forClass(NotificationLog.class);
        verify(notificationLogRepository).save(logCaptor.capture());
        assertThat(logCaptor.getValue().getStatus()).isEqualTo(NotificationStatus.SENT);
        assertThat(logCaptor.getValue().getProviderMessageId()).startsWith("SIMULATED-");
    }

    @Test
    @DisplayName("Gửi email thành công khi đơn có hình thức giao DELIVERY và items rỗng hoặc thiếu thông tin")
    void sendBookingConfirmation_deliveryAndNullItemDetails() {
        testBooking.setDeliveryMethod("DELIVERY");
        testBooking.setDeliveryAddress("456 Cầu Giấy, Hà Nội");
        testBooking.setTotalRentalPrice(BigDecimal.ZERO);
        testBooking.setTotalDepositPrice(new BigDecimal("500000"));

        BookingItem itemWithoutVariant = BookingItem.builder().rentalPrice(BigDecimal.ZERO).build();
        BookingItem itemWithEmptyVariant = BookingItem.builder().variant(new ProductVariant()).build();
        testBooking.setItems(List.of(itemWithoutVariant, itemWithEmptyVariant));

        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>Ok</html>");

        emailNotificationService.sendBookingConfirmation(testBooking);

        verify(mailSender).send(mimeMessage);
    }

    @Test
    @DisplayName("EmailNotificationService xử lý an toàn khi các trường ngày tháng, giá tiền hoặc items null")
    void buildBookingContext_nullDatesAndPricing() {
        Booking nullBooking = Booking.builder()
                .id(2L)
                .bookingCode("BK-NULL-TEST")
                .customerName("Khách Hàng Null")
                .customerEmail("nulltest@gmail.com")
                .rentalStartDate(null)
                .rentalEndDate(null)
                .totalRentalPrice(null)
                .totalDepositPrice(null)
                .customerPhone(null)
                .items(null)
                .build();

        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>Ok</html>");

        emailNotificationService.sendBookingConfirmation(nullBooking);
        emailNotificationService.sendReturnCompleted(nullBooking);
        emailNotificationService.sendFittingConfirmation("nulltest@gmail.com", null, "10:00", null);

        verify(notificationLogRepository, times(3)).save(any());
    }
}
