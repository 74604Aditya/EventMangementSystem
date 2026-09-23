package com.eventmgmt.service;

import com.eventmgmt.dto.VendorRequest;
import com.eventmgmt.entity.Vendor;
import com.eventmgmt.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    public List<Vendor> getAllActive() {
        return vendorRepository.findByActiveTrue();
    }

    public List<Vendor> getByCity(String city) {
        return vendorRepository.findByCityIgnoreCaseAndActiveTrue(city);
    }

    public Vendor getById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
    }

    public Vendor createVendor(VendorRequest request) {
        Vendor vendor = Vendor.builder()
                .businessName(request.getBusinessName())
                .tagline(request.getTagline())
                .description(request.getDescription())
                .city(request.getCity())
                .taluka(request.getTaluka())
                .district(request.getDistrict())
                .address(request.getAddress())
                .primaryPhone(request.getPrimaryPhone())
                .secondaryPhone(request.getSecondaryPhone())
                .instagramHandle(request.getInstagramHandle())
                .logoUrl(request.getLogoUrl())
                .active(true)
                .build();

        if (request.getServices() != null) {
            var services = request.getServices().stream()
                    .map(s -> com.eventmgmt.entity.VendorService.builder()
                            .vendor(vendor)
                            .serviceName(s.getServiceName())
                            .serviceNameMarathi(s.getServiceNameMarathi())
                            .iconUrl(s.getIconUrl())
                            .build())
                    .collect(Collectors.toSet());
            vendor.setServices(services);
        }

        return vendorRepository.save(vendor);
    }

    public void deactivateVendor(Long id) {
        Vendor vendor = getById(id);
        vendor.setActive(false);
        vendorRepository.save(vendor);
    }
}
