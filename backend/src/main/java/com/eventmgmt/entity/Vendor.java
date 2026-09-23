package com.eventmgmt.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "vendors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String businessName; // e.g. "Shree Event Management (TNCP)"

    @Column(length = 500)
    private String tagline; // e.g. "We Make Your Moments Special"

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String city; // e.g. Parner

    private String taluka;  // ता. - e.g. Parner
    private String district; // जि. - e.g. Ahmednagar
    private String address;

    @Column(nullable = false)
    private String primaryPhone;
    private String secondaryPhone;
    private String instagramHandle;

    private String logoUrl;

    @Builder.Default
    private Boolean active = true;

    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<VendorService> services = new HashSet<>();
}
