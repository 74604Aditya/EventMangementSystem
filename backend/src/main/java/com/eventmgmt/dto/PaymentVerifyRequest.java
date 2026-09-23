package com.eventmgmt.dto;

import lombok.Data;

@Data
public class PaymentVerifyRequest {
    private Long bookingId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
