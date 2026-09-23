package com.eventmgmt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateRazorpayOrderRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Event date and time are required")
    private LocalDateTime eventDateTime;

    private String customVenue;

    @NotBlank(message = "Payment plan is required")
    private String paymentPlan;

    private String paymentMethod;

    @NotBlank(message = "Receipt is required")
    private String receipt;
}