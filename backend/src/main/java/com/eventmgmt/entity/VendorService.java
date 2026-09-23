package com.eventmgmt.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

// A single service line item offered by a vendor, e.g. "Balloon Decoration",
// "Floral Art", "Ring Ceremony Setup" - lets one vendor advertise many offerings
// and lets the frontend filter vendors by what a user actually needs.
@Entity
@Table(name = "vendor_services")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VendorService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    @JsonIgnore // avoid vendor -> services -> vendor -> ... infinite recursion when serializing
    private Vendor vendor;

    @Column(nullable = false)
    private String serviceName; // e.g. "Balloon Decoration"

    @Column(nullable = false)
    private String serviceNameMarathi; // e.g. "फुगे सजावट"

    private String iconUrl;
}
