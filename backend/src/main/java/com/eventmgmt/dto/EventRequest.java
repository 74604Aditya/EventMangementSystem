package com.eventmgmt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequest {

    @NotBlank
    private String title;

    private String description;

    private Long categoryId;

    @NotBlank
    private String city;

    private String venue;

    @NotNull
    private LocalDateTime eventDateTime;

    @NotNull
    private Double ticketPrice;

    private String imageUrl;
}