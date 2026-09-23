package com.eventmgmt.service;

import com.eventmgmt.dto.BookingRequest;
import com.eventmgmt.entity.Booking;
import com.eventmgmt.entity.BookingStatus;
import com.eventmgmt.entity.Event;
import com.eventmgmt.entity.Role;
import com.eventmgmt.entity.User;
import com.eventmgmt.repository.BookingRepository;
import com.eventmgmt.repository.EventRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;

    @Value("${booking.cancellation.window.hours:12}")
    private int cancellationWindowHours;


    /* =====================================================
       CREATE AFTER-EVENT BOOKING
    ===================================================== */

    @Transactional
    public Booking createBooking(
            User user,
            BookingRequest request
    ) {

        Event event = getAndValidateEvent(request);

        String paymentPlan =
                request.getPaymentPlan()
                        .trim()
                        .toUpperCase();

        if (!"AFTER_EVENT".equals(paymentPlan)) {

            throw new IllegalStateException(
                    "Online payment is required for this payment plan"
            );
        }

        Double totalAmount =
                event.getTicketPrice();

        Double payableAmount =
                0.0;

        Booking booking = Booking.builder()

                .user(user)

                .event(event)

                .eventDateTime(
                        request.getEventDateTime()
                )

                .customVenue(
                        request.getCustomVenue()
                )

                .totalAmount(
                        totalAmount
                )

                .payableAmount(
                        payableAmount
                )

                .paymentPlan(
                        paymentPlan
                )

                .paymentMethod(
                        null
                )

                .status(
                        BookingStatus.CONFIRMED
                )

                .bookedAt(
                        LocalDateTime.now()
                )

                .build();

        return bookingRepository.save(booking);
    }


    /* =====================================================
       CREATE PENDING BOOKING

       Used for:
       FULL
       ADVANCE
    ===================================================== */

    @Transactional
    public Booking createPendingBooking(
            User user,
            BookingRequest request,
            String razorpayOrderId
    ) {

        if (
                razorpayOrderId == null ||
                        razorpayOrderId.isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Razorpay order ID is required"
            );
        }

        Event event =
                getAndValidateEvent(request);

        String paymentPlan =
                request.getPaymentPlan()
                        .trim()
                        .toUpperCase();

        if (
                !"FULL".equals(paymentPlan) &&
                        !"ADVANCE".equals(paymentPlan)
        ) {

            throw new IllegalArgumentException(
                    "Invalid online payment plan"
            );
        }

        Double totalAmount =
                event.getTicketPrice();

        Double payableAmount;

        if ("FULL".equals(paymentPlan)) {

            payableAmount =
                    totalAmount;

        } else {

            payableAmount =
                    totalAmount / 2;
        }

        Booking booking = Booking.builder()

                .user(user)

                .event(event)

                .eventDateTime(
                        request.getEventDateTime()
                )

                .customVenue(
                        request.getCustomVenue()
                )

                .totalAmount(
                        totalAmount
                )

                .payableAmount(
                        payableAmount
                )

                .paymentPlan(
                        paymentPlan
                )

                .paymentMethod(
                        request.getPaymentMethod()
                )

                .status(
                        BookingStatus.PENDING
                )

                .bookedAt(
                        LocalDateTime.now()
                )

                .razorpayOrderId(
                        razorpayOrderId
                )

                .build();

        return bookingRepository.save(booking);
    }


    /* =====================================================
       CONFIRM RAZORPAY PAYMENT
    ===================================================== */

    @Transactional
    public Booking confirmRazorpayPayment(
            User user,
            String razorpayOrderId,
            String razorpayPaymentId
    ) {

        if (
                razorpayOrderId == null ||
                        razorpayOrderId.isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Razorpay order ID is required"
            );
        }

        if (
                razorpayPaymentId == null ||
                        razorpayPaymentId.isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Razorpay payment ID is required"
            );
        }

        Booking booking =
                bookingRepository
                        .findByRazorpayOrderId(
                                razorpayOrderId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Booking not found for Razorpay order"
                                )
                        );

        if (
                booking.getUser() == null ||
                        booking.getUser().getId() == null ||
                        !booking.getUser()
                                .getId()
                                .equals(user.getId())
        ) {

            throw new SecurityException(
                    "You are not allowed to confirm this booking"
            );
        }

        if (
                booking.getStatus()
                        == BookingStatus.CANCELLED
        ) {

            throw new IllegalStateException(
                    "Cancelled booking cannot be confirmed"
            );
        }

        if (
                booking.getStatus()
                        == BookingStatus.CONFIRMED
        ) {

            return booking;
        }

        booking.setRazorpayPaymentId(
                razorpayPaymentId
        );

        booking.setStatus(
                BookingStatus.CONFIRMED
        );

        return bookingRepository.save(booking);
    }


    /* =====================================================
       GET PAYABLE AMOUNT
    ===================================================== */

    public Double getPayableAmount(
            Long eventId,
            String paymentPlan
    ) {

        if (eventId == null) {

            throw new IllegalArgumentException(
                    "Event ID is required"
            );
        }

        if (
                paymentPlan == null ||
                        paymentPlan.isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Payment plan is required"
            );
        }

        Event event =
                eventRepository
                        .findById(eventId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Event not found"
                                )
                        );

        Double totalAmount =
                event.getTicketPrice();

        if (totalAmount == null || totalAmount <= 0) {

            throw new IllegalStateException(
                    "Event does not have a valid ticket price"
            );
        }

        if ("FULL".equalsIgnoreCase(paymentPlan)) {

            return totalAmount;
        }

        if ("ADVANCE".equalsIgnoreCase(paymentPlan)) {

            return totalAmount / 2;
        }

        throw new IllegalArgumentException(
                "Invalid payment plan"
        );
    }


    /* =====================================================
       GET EVENT AND VALIDATE BOOKING DATA
    ===================================================== */

    private Event getAndValidateEvent(
            BookingRequest request
    ) {

        if (request.getEventId() == null) {

            throw new IllegalArgumentException(
                    "Event ID is required"
            );
        }

        Event event =
                eventRepository
                        .findById(request.getEventId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Event not found"
                                )
                        );

        if (!Boolean.TRUE.equals(event.getActive())) {

            throw new IllegalStateException(
                    "This event is no longer available"
            );
        }

        if (request.getEventDateTime() == null) {

            throw new IllegalArgumentException(
                    "Event date is required"
            );
        }

        if (
                request.getEventDateTime()
                        .isBefore(LocalDateTime.now())
        ) {

            throw new IllegalStateException(
                    "Cannot book an event for a past date"
            );
        }

        if (
                request.getPaymentPlan() == null ||
                        request.getPaymentPlan().isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Payment plan is required"
            );
        }

        if (
                request.getCustomVenue() == null ||
                        request.getCustomVenue().isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Venue is required"
            );
        }

        return event;
    }


    /* =====================================================
       USER BOOKINGS
    ===================================================== */

    public List<Booking> getBookingsForUser(
            User user
    ) {

        return bookingRepository
                .findByUserOrderByBookedAtDesc(user);
    }


    /* =====================================================
       ALL BOOKINGS
    ===================================================== */

    public List<Booking> getAllBookings() {

        return bookingRepository
                .findAllByOrderByBookedAtDesc();
    }


    /* =====================================================
       CANCEL BOOKING
    ===================================================== */

    @Transactional
    public Booking cancelBooking(
            User user,
            Long bookingId
    ) {

        Booking booking =
                bookingRepository
                        .findById(bookingId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Booking not found"
                                )
                        );

        boolean isOwner =
                booking.getUser()
                        .getId()
                        .equals(user.getId());

        boolean isAdmin =
                user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {

            throw new SecurityException(
                    "You are not allowed to cancel this booking"
            );
        }

        if (
                booking.getStatus()
                        == BookingStatus.CANCELLED
        ) {

            throw new IllegalStateException(
                    "Booking is already cancelled"
            );
        }

        long hoursSinceBooking =
                Duration.between(
                        booking.getBookedAt(),
                        LocalDateTime.now()
                ).toHours();

        if (
                hoursSinceBooking >
                        cancellationWindowHours
                        && !isAdmin
        ) {

            throw new IllegalStateException(
                    "Cancellation window has passed. " +
                            "Bookings can only be cancelled within " +
                            cancellationWindowHours +
                            " hours of booking."
            );
        }

        booking.setStatus(
                BookingStatus.CANCELLED
        );

        booking.setCancelledAt(
                LocalDateTime.now()
        );

        return bookingRepository.save(booking);
    }
}