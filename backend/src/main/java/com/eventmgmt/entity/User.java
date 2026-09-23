package com.eventmgmt.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore // never expose the (hashed) password in any API response
    private String password;

    @Column(nullable = false)
    private String phone;

    // e.g. Pune, Mumbai, Nashik, Kolhapur, Nagpur - used to customize events shown to the user
    @Column(name = "village")
    private String village;

    @Column(name = "preferred_city")
    private String preferredCity;

    // comma separated preferred category names e.g. "Ganeshotsav"
    private String preferredCategories;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore // avoid user -> bookings -> user -> ... infinite recursion when serializing
    private Set<Booking> bookings = new HashSet<>();
}
