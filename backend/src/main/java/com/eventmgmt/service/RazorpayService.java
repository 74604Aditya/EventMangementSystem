package com.eventmgmt.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
public class RazorpayService {

    private final RazorpayClient razorpayClient;

    private final String razorpayKeyId;
    private final String razorpayKeySecret;


    /* =====================================================
       CONSTRUCTOR
    ===================================================== */

    public RazorpayService(
            @Value("${razorpay.key.id}") String razorpayKeyId,
            @Value("${razorpay.key.secret}") String razorpayKeySecret
    ) throws RazorpayException {

        this.razorpayKeyId = razorpayKeyId;
        this.razorpayKeySecret = razorpayKeySecret;

        this.razorpayClient =
                new RazorpayClient(
                        razorpayKeyId,
                        razorpayKeySecret
                );
    }


    /* =====================================================
       GET RAZORPAY KEY ID

       Safe to send to React frontend.
    ===================================================== */

    public String getKeyId() {
        return razorpayKeyId;
    }


    /* =====================================================
       CREATE RAZORPAY ORDER
    ===================================================== */

    public Order createOrder(
            Double amount,
            String receipt
    ) throws RazorpayException {

        if (amount == null || amount <= 0) {

            throw new IllegalArgumentException(
                    "Payment amount must be greater than zero"
            );
        }

        if (receipt == null || receipt.isBlank()) {

            throw new IllegalArgumentException(
                    "Receipt is required"
            );
        }

        /*
         * Razorpay expects amount in paise.
         *
         * Example:
         * ₹500 = 50000 paise
         */

        long amountInPaise =
                Math.round(amount * 100);


        JSONObject orderRequest =
                new JSONObject();

        orderRequest.put(
                "amount",
                amountInPaise
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                receipt
        );


        return razorpayClient.orders.create(
                orderRequest
        );
    }


    /* =====================================================
       VERIFY RAZORPAY PAYMENT SIGNATURE
    ===================================================== */

    public boolean verifyPaymentSignature(
            String orderId,
            String paymentId,
            String razorpaySignature
    ) {

        if (
                orderId == null ||
                        orderId.isBlank() ||
                        paymentId == null ||
                        paymentId.isBlank() ||
                        razorpaySignature == null ||
                        razorpaySignature.isBlank()
        ) {

            return false;
        }


        try {

            /*
             * Razorpay signature payload:
             *
             * orderId + "|" + paymentId
             */

            String payload =
                    orderId + "|" + paymentId;


            String generatedSignature =
                    generateHmacSha256(
                            payload,
                            razorpayKeySecret
                    );


            return generatedSignature.equals(
                    razorpaySignature
            );

        } catch (Exception e) {

            return false;
        }
    }


    /* =====================================================
       GENERATE HMAC SHA256
    ===================================================== */

    private String generateHmacSha256(
            String data,
            String secret
    ) throws Exception {

        Mac mac =
                Mac.getInstance("HmacSHA256");


        SecretKeySpec secretKeySpec =
                new SecretKeySpec(
                        secret.getBytes(
                                StandardCharsets.UTF_8
                        ),
                        "HmacSHA256"
                );


        mac.init(secretKeySpec);


        byte[] hash =
                mac.doFinal(
                        data.getBytes(
                                StandardCharsets.UTF_8
                        )
                );


        StringBuilder hexString =
                new StringBuilder();


        for (byte b : hash) {

            String hex =
                    Integer.toHexString(
                            0xff & b
                    );


            if (hex.length() == 1) {

                hexString.append('0');
            }


            hexString.append(hex);
        }


        return hexString.toString();
    }
}