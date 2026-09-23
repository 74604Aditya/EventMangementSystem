package com.eventmgmt.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private LocalDateTime eventDateTime;

    @Column(length = 500)
    private String customVenue;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private Double payableAmount;

    @Column(nullable = false)
    private String paymentPlan;

    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(nullable = false)
    private LocalDateTime bookedAt;

    private LocalDateTime cancelledAt;

    /*
     * Razorpay Order ID
     *
     * Example:
     * order_Rx123456789
     */
    @Column(unique = true)
    private String razorpayOrderId;

    /*
     * Razorpay Payment ID
     *
     * Example:
     * pay_Rx123456789
     */
    private String razorpayPaymentId;
}