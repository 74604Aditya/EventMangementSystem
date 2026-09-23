package com.eventmgmt.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequest {

    @NotNull
    private Long eventId;

    @NotNull
    private LocalDateTime eventDateTime;

    private String customVenue;

    @NotNull
    private String paymentPlan;

    private String paymentMethod;

    @NotNull
    private Double totalAmount;

    @NotNull
    private Double payableAmount;
}