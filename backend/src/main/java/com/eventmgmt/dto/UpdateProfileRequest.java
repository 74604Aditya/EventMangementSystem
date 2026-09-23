package com.eventmgmt.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Phone number is requird")
    private String phone;

    private String village;
}
