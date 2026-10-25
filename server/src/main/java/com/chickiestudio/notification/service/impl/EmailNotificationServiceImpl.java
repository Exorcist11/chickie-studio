package com.chickiestudio.notification.service.impl;

import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.booking.entity.BookingItem;
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
import com.chickiestudio.notification.service.EmailNotificationService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.ITemplateEngine;
import org.thymeleaf.context.Context;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotificationServiceImpl implements EmailNotificationService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final ITemplateEngine templateEngine;
    private final NotificationLogRepository notificationLogRepository;
    private final BookingRepository bookingRepository;
    private final NotificationLogMapper notificationLogMapper;

    @Value("${chickie.mail.from-email:chickiestudio.rental@gmail.com}")
    private String fromEmail;

    @Value("${chickie.mail.from-name:Chickie Studio}")
    private String fromName;

    @Value("${chickie.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${chickie.client.base-url:http://localhost:3000}")
    private String clientBaseUrl;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Override
    @Async("mailTaskExecutor")
    public void sendBookingConfirmation(Booking booking) {
        if (!hasValidEmail(booking)) {
            log.warn("Không thể gửi email xác nhận đặt đơn: Booking #{} chưa có email hợp lệ", booking.getBookingCode());
            return;
        }

        Context context = buildBookingContext(booking);
        BigDecimal totalRental = booking.getTotalRentalPrice() != null ? booking.getTotalRentalPrice() : BigDecimal.ZERO;
        BigDecimal depositRequired = totalRental.multiply(BigDecimal.valueOf(0.5));
        if (depositRequired.compareTo(BigDecimal.ZERO) == 0 && booking.getTotalDepositPrice() != null) {
            depositRequired = booking.getTotalDepositPrice();
        }
        context.setVariable("depositRequired", depositRequired);

        String vietQrUrl = String.format(
                "https://img.vietqr.io/image/970422-0901234567-compact2.png?amount=%d&addInfo=%s&accountName=%s",
                depositRequired.longValue(),
                URLEncoder.encode(booking.getBookingCode(), StandardCharsets.UTF_8),
                URLEncoder.encode("CHICKIE STUDIO", StandardCharsets.UTF_8)
        );
        context.setVariable("vietQrUrl", vietQrUrl);

        String subject = String.format("[Chickie Studio] Xác nhận đơn đặt thuê #%s & Hướng dẫn cọc", booking.getBookingCode());
        sendHtmlEmailInternal(
                booking.getId(),
                booking.getCustomerEmail().trim(),
                booking.getCustomerName(),
                NotificationTemplateType.BOOKING_CONFIRMATION,
                subject,
                "email/booking-confirmation",
                context
        );
    }

    @Override
    @Async("mailTaskExecutor")
    public void sendDepositReceived(Booking booking) {
        if (!hasValidEmail(booking)) {
            return;
        }
        Context context = buildBookingContext(booking);
        String subject = String.format("[Chickie Studio] Đã nhận tiền cọc đơn thuê #%s - Slot giữ thành công!", booking.getBookingCode());
        sendHtmlEmailInternal(
                booking.getId(),
                booking.getCustomerEmail().trim(),
                booking.getCustomerName(),
                NotificationTemplateType.DEPOSIT_RECEIVED,
                subject,
                "email/deposit-received",
                context
        );
    }

    @Override
    @Async("mailTaskExecutor")
    public void sendPickupReminder(Booking booking) {
        if (!hasValidEmail(booking)) {
            return;
        }
        Context context = buildBookingContext(booking);
        String subject = String.format("[Chickie Studio] Nhắc lịch hẹn lấy trang phục ngày mai #%s", booking.getBookingCode());
        sendHtmlEmailInternal(
                booking.getId(),
                booking.getCustomerEmail().trim(),
                booking.getCustomerName(),
                NotificationTemplateType.PICKUP_REMINDER,
                subject,
                "email/pickup-reminder",
                context
        );
    }

    @Override
    @Async("mailTaskExecutor")
    public void sendReturnReminder(Booking booking) {
        if (!hasValidEmail(booking)) {
            return;
        }
        Context context = buildBookingContext(booking);
        String subject = String.format("[Chickie Studio] Nhắc lịch hẹn trả đồ hôm nay #%s", booking.getBookingCode());
        sendHtmlEmailInternal(
                booking.getId(),
                booking.getCustomerEmail().trim(),
                booking.getCustomerName(),
                NotificationTemplateType.RETURN_REMINDER,
                subject,
                "email/return-reminder",
                context
        );
    }

    @Override
    @Async("mailTaskExecutor")
    public void sendReturnCompleted(Booking booking) {
        if (!hasValidEmail(booking)) {
            return;
        }
        Context context = buildBookingContext(booking);
        context.setVariable("penaltyFee", BigDecimal.ZERO);
        context.setVariable("refundAmount", booking.getTotalDepositPrice() != null ? booking.getTotalDepositPrice() : BigDecimal.ZERO);

        String subject = String.format("[Chickie Studio] Biên lai quyết toán & Hoàn cọc đơn thuê #%s", booking.getBookingCode());
        sendHtmlEmailInternal(
                booking.getId(),
                booking.getCustomerEmail().trim(),
                booking.getCustomerName(),
                NotificationTemplateType.RETURN_COMPLETED,
                subject,
                "email/return-completed",
                context
        );
    }

    @Override
    @Async("mailTaskExecutor")
    public void sendBookingExpired(Booking booking) {
        if (!hasValidEmail(booking)) {
            return;
        }
        Context context = buildBookingContext(booking);
        String subject = String.format("[Chickie Studio] Thông báo hết hạn giữ chỗ đơn thuê #%s", booking.getBookingCode());
        sendHtmlEmailInternal(
                booking.getId(),
                booking.getCustomerEmail().trim(),
                booking.getCustomerName(),
                NotificationTemplateType.BOOKING_EXPIRED,
                subject,
                "email/booking-expired",
                context
        );
    }

    @Override
    public void sendBookingStatusNotification(Booking booking, com.chickiestudio.booking.entity.BookingStatus newStatus) {
        if (!hasValidEmail(booking) || newStatus == null) {
            return;
        }
        switch (newStatus) {
            case CONFIRMED -> sendDepositReceived(booking);
            case COMPLETED -> sendReturnCompleted(booking);
            case CANCELLED -> sendBookingExpired(booking);
            default -> {
                // Các trạng thái khác không kích hoạt email tự động
            }
        }
    }

    @Override
    @Async("mailTaskExecutor")
    public void sendFittingConfirmation(String recipientEmail, String customerName, String appointmentTime, String note) {
        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            return;
        }
        Context context = new Context();
        context.setVariable("customerName", customerName != null ? customerName : "Quý khách");
        context.setVariable("appointmentTime", appointmentTime);
        context.setVariable("note", note);

        String subject = "[Chickie Studio] Xác nhận lịch hẹn thử đồ tại Showroom Hà Nội";
        sendHtmlEmailInternal(
                null,
                recipientEmail.trim(),
                customerName,
                NotificationTemplateType.FITTING_CONFIRMATION,
                subject,
                "email/fitting-confirmation",
                context
        );
    }

    @Override
    @Transactional
    public NotificationLogResponse resendEmail(Long bookingId, NotificationTemplateType templateType) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt thuê với ID: " + bookingId));

        if (!hasValidEmail(booking)) {
            throw new BadRequestException("Đơn đặt thuê này chưa có địa chỉ email hợp lệ của khách hàng để gửi lại");
        }

        switch (templateType) {
            case BOOKING_CONFIRMATION -> sendBookingConfirmation(booking);
            case DEPOSIT_RECEIVED -> sendDepositReceived(booking);
            case PICKUP_REMINDER -> sendPickupReminder(booking);
            case RETURN_REMINDER -> sendReturnReminder(booking);
            case RETURN_COMPLETED -> sendReturnCompleted(booking);
            case BOOKING_EXPIRED -> sendBookingExpired(booking);
            default -> throw new BadRequestException("Loại template không hỗ trợ gửi lại theo đơn hàng: " + templateType);
        }

        NotificationLog logRecord = NotificationLog.builder()
                .bookingId(booking.getId())
                .recipientEmail(booking.getCustomerEmail().trim())
                .recipientName(booking.getCustomerName())
                .channel(NotificationChannel.EMAIL)
                .templateType(templateType)
                .subject("Gửi lại thông báo: " + templateType)
                .status(NotificationStatus.SENT)
                .sentAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();

        NotificationLog saved = notificationLogRepository.save(logRecord);
        return notificationLogMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationLogResponse> getLogsByBookingId(Long bookingId) {
        List<NotificationLog> logs = notificationLogRepository.findByBookingIdOrderBySentAtDesc(bookingId);
        return notificationLogMapper.toResponseList(logs);
    }

    private boolean hasValidEmail(Booking booking) {
        return booking != null && booking.getCustomerEmail() != null && !booking.getCustomerEmail().trim().isEmpty();
    }

    private Context buildBookingContext(Booking booking) {
        Context context = new Context();
        context.setVariable("customerName", booking.getCustomerName());
        context.setVariable("bookingCode", booking.getBookingCode());
        context.setVariable("customerPhone", booking.getCustomerPhone());
        context.setVariable("deliveryMethod", booking.getDeliveryMethod());
        context.setVariable("deliveryAddress", booking.getDeliveryAddress());

        String startDateStr = booking.getRentalStartDate() != null ? booking.getRentalStartDate().format(DATE_FORMATTER) : "";
        String endDateStr = booking.getRentalEndDate() != null ? booking.getRentalEndDate().format(DATE_FORMATTER) : "";
        context.setVariable("rentalStartDate", startDateStr);
        context.setVariable("rentalEndDate", endDateStr);

        long durationDays = 1;
        if (booking.getRentalStartDate() != null && booking.getRentalEndDate() != null) {
            durationDays = ChronoUnit.DAYS.between(booking.getRentalStartDate(), booking.getRentalEndDate()) + 1;
        }
        context.setVariable("durationDays", durationDays);

        context.setVariable("totalRentalPrice", booking.getTotalRentalPrice() != null ? booking.getTotalRentalPrice() : BigDecimal.ZERO);
        context.setVariable("totalDepositPrice", booking.getTotalDepositPrice() != null ? booking.getTotalDepositPrice() : BigDecimal.ZERO);

        List<Map<String, Object>> itemsData = new ArrayList<>();
        if (booking.getItems() != null) {
            for (BookingItem item : booking.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                String productName = "Trang phục Chickie Studio";
                String size = "Chuẩn";
                if (item.getVariant() != null) {
                    if (item.getVariant().getProduct() != null) {
                        productName = item.getVariant().getProduct().getName();
                    }
                    if (item.getVariant().getSize() != null) {
                        size = item.getVariant().getSize();
                    }
                }
                itemMap.put("productName", productName);
                itemMap.put("size", size);
                itemMap.put("rentalPrice", item.getRentalPrice() != null ? item.getRentalPrice() : BigDecimal.ZERO);
                itemsData.add(itemMap);
            }
        }
        context.setVariable("items", itemsData);

        String trackingUrl = String.format("%s/tra-cuu-don?code=%s&phone=%s",
                clientBaseUrl,
                booking.getBookingCode(),
                booking.getCustomerPhone() != null ? booking.getCustomerPhone() : "");
        context.setVariable("trackingUrl", trackingUrl);

        return context;
    }

    private void sendHtmlEmailInternal(
            Long bookingId,
            String recipientEmail,
            String recipientName,
            NotificationTemplateType templateType,
            String subject,
            String templateName,
            Context context
    ) {
        NotificationLog.NotificationLogBuilder logBuilder = NotificationLog.builder()
                .bookingId(bookingId)
                .recipientEmail(recipientEmail)
                .recipientName(recipientName)
                .channel(NotificationChannel.EMAIL)
                .templateType(templateType)
                .subject(subject)
                .sentAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now());

        if (!mailEnabled) {
            log.info("[MOCK MAIL] Mail disabled. Logged email to {}: '{}'", recipientEmail, subject);
            logBuilder.status(NotificationStatus.SENT)
                    .providerMessageId("MOCK-" + System.currentTimeMillis());
            notificationLogRepository.save(logBuilder.build());
            return;
        }

        try {
            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender == null) {
                log.warn("JavaMailSender bean không khả dụng. Ghi nhận log mô phỏng cho email tới {}", recipientEmail);
                logBuilder.status(NotificationStatus.SENT).providerMessageId("SIMULATED-" + System.currentTimeMillis());
                notificationLogRepository.save(logBuilder.build());
                return;
            }

            String htmlContent = templateEngine.process(templateName, context);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(fromEmail, fromName);
            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Gửi email thành công tới: {} [Template: {}, Subject: '{}']", recipientEmail, templateType, subject);

            logBuilder.status(NotificationStatus.SENT);
            notificationLogRepository.save(logBuilder.build());
        } catch (Exception e) {
            log.error("Lỗi khi gửi email tới {} [Template: {}]: {}", recipientEmail, templateType, e.getMessage(), e);
            logBuilder.status(NotificationStatus.FAILED)
                    .errorMessage(e.getMessage());
            notificationLogRepository.save(logBuilder.build());
        }
    }
}
