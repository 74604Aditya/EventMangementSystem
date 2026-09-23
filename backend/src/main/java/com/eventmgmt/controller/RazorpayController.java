package com.eventmgmt.controller;

import com.eventmgmt.dto.BookingRequest;
import com.eventmgmt.dto.CreateRazorpayOrderRequest;
import com.eventmgmt.dto.VerifyRazorpayPaymentRequest;
import com.eventmgmt.entity.Booking;
import com.eventmgmt.entity.User;
import com.eventmgmt.repository.UserRepository;
import com.eventmgmt.service.BookingService;
import com.eventmgmt.service.RazorpayService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class RazorpayController {

    private final RazorpayService razorpayService;

    private final BookingService bookingService;

    private final UserRepository userRepository;


    /* =====================================================
       CURRENT USER
    ===================================================== */

    private User currentUser(
            Authentication authentication
    ) {

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }


    /* =====================================================
       CREATE RAZORPAY ORDER

       POST /api/payments/create-order
    ===================================================== */

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @Valid @RequestBody CreateRazorpayOrderRequest request,
            Authentication authentication
    ) {

        try {

            User user =
                    currentUser(authentication);


            /* =================================================
               ONLY FULL / ADVANCE ALLOWED
            ================================================= */

            String paymentPlan =
                    request.getPaymentPlan()
                            .trim()
                            .toUpperCase();


            if (
                    !"FULL".equals(paymentPlan) &&
                            !"ADVANCE".equals(paymentPlan)
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "success",
                                        false,
                                        "message",
                                        "Razorpay payment is only required for FULL or ADVANCE payment plans"
                                )
                        );
            }


            /* =================================================
               CREATE BOOKING REQUEST
            ================================================= */

            BookingRequest bookingRequest =
                    new BookingRequest();

            bookingRequest.setEventId(
                    request.getEventId()
            );

            bookingRequest.setEventDateTime(
                    request.getEventDateTime()
            );

            bookingRequest.setCustomVenue(
                    request.getCustomVenue()
            );

            bookingRequest.setPaymentPlan(
                    paymentPlan
            );

            bookingRequest.setPaymentMethod(
                    request.getPaymentMethod()
            );


            /*
             * These values are not trusted by BookingService.
             *
             * The service calculates the actual amount
             * directly from Event.ticketPrice.
             *
             * They are set only because BookingRequest currently
             * contains these fields as @NotNull.
             */
            bookingRequest.setTotalAmount(0.0);

            bookingRequest.setPayableAmount(0.0);


            /* =================================================
               GET EVENT PRICE THROUGH BOOKING SERVICE

               We first create the Razorpay amount using the
               event price.
            ================================================= */

            /*
             * We need the actual payable amount here.
             *
             * This is calculated from the event ticket price.
             */
            Double totalAmount =
                    bookingService
                            .getPayableAmount(
                                    request.getEventId(),
                                    paymentPlan
                            );


            /* =================================================
               CREATE RAZORPAY ORDER
            ================================================= */

            Order order =
                    razorpayService.createOrder(
                            totalAmount,
                            request.getReceipt()
                    );


            JSONObject orderJson =
                    order.toJson();


            String razorpayOrderId =
                    orderJson.getString("id");


            /* =================================================
               CREATE PENDING BOOKING
            ================================================= */

            Booking booking =
                    bookingService.createPendingBooking(
                            user,
                            bookingRequest,
                            razorpayOrderId
                    );


            /* =================================================
               RESPONSE
            ================================================= */

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "keyId",
                    razorpayService.getKeyId()
            );

            response.put(
                    "orderId",
                    razorpayOrderId
            );

            response.put(
                    "amount",
                    orderJson.getLong("amount")
            );

            response.put(
                    "currency",
                    orderJson.getString("currency")
            );

            response.put(
                    "receipt",
                    orderJson.getString("receipt")
            );

            response.put(
                    "bookingId",
                    booking.getId()
            );

            response.put(
                    "paymentPlan",
                    paymentPlan
            );

            return ResponseEntity.ok(response);

        } catch (RazorpayException e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    "Unable to create Razorpay order"
                            )
                    );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    /* =====================================================
       VERIFY RAZORPAY PAYMENT

       POST /api/payments/verify
    ===================================================== */

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @Valid @RequestBody VerifyRazorpayPaymentRequest request,
            Authentication authentication
    ) {

        try {

            /* =================================================
               VERIFY RAZORPAY SIGNATURE
            ================================================= */

            boolean verified =
                    razorpayService.verifyPaymentSignature(
                            request.getRazorpayOrderId(),
                            request.getRazorpayPaymentId(),
                            request.getRazorpaySignature()
                    );


            if (!verified) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "success",
                                        false,
                                        "message",
                                        "Payment verification failed"
                                )
                        );
            }


            /* =================================================
               GET CURRENT USER
            ================================================= */

            User user =
                    currentUser(authentication);


            /* =================================================
               CONFIRM BOOKING
            ================================================= */

            Booking booking =
                    bookingService.confirmRazorpayPayment(
                            user,
                            request.getRazorpayOrderId(),
                            request.getRazorpayPaymentId()
                    );


            /* =================================================
               SUCCESS RESPONSE
            ================================================= */

            return ResponseEntity.ok(
                    Map.of(
                            "success",
                            true,
                            "message",
                            "Payment verified and booking confirmed",
                            "bookingId",
                            booking.getId(),
                            "razorpayOrderId",
                            request.getRazorpayOrderId(),
                            "razorpayPaymentId",
                            request.getRazorpayPaymentId(),
                            "status",
                            booking.getStatus().name()
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(403)
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success",
                                    false,
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}