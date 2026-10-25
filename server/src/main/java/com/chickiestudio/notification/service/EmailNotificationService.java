package com.chickiestudio.notification.service;

import com.chickiestudio.booking.entity.Booking;
import com.chickiestudio.notification.dto.NotificationLogResponse;
import com.chickiestudio.notification.entity.NotificationTemplateType;

import java.util.List;

public interface EmailNotificationService {

    void sendBookingConfirmation(Booking booking);

    void sendDepositReceived(Booking booking);

    void sendPickupReminder(Booking booking);

    void sendReturnReminder(Booking booking);

    void sendReturnCompleted(Booking booking);

    void sendBookingExpired(Booking booking);

    void sendBookingStatusNotification(Booking booking, com.chickiestudio.booking.entity.BookingStatus newStatus);

    void sendFittingConfirmation(String recipientEmail, String customerName, String appointmentTime, String note);

    NotificationLogResponse resendEmail(Long bookingId, NotificationTemplateType templateType);

    List<NotificationLogResponse> getLogsByBookingId(Long bookingId);
}
