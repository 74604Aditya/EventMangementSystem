package com.eventmgmt.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class VendorRequest {
    @NotBlank
    private String businessName;
    private String tagline;
    private String description;
    @NotBlank
    private String city;
    private String taluka;
    private String district;
    private String address;
    @NotBlank
    private String primaryPhone;
    private String secondaryPhone;
    private String instagramHandle;
    private String logoUrl;
    private List<VendorServiceItem> services;

    @Data
    public static class VendorServiceItem {
        private String serviceName;
        private String serviceNameMarathi;
        private String iconUrl;
    }
}
