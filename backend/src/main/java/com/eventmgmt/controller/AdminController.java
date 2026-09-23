package com.eventmgmt.controller;

import com.eventmgmt.dto.EventRequest;
import com.eventmgmt.dto.VendorRequest;
import com.eventmgmt.entity.Booking;
import com.eventmgmt.entity.Event;
import com.eventmgmt.entity.Vendor;
import com.eventmgmt.repository.CategoryRepository;
import com.eventmgmt.repository.UserRepository;
import com.eventmgmt.service.BookingService;
import com.eventmgmt.service.EventService;
import com.eventmgmt.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Everything under /api/admin/** is already locked to ADMIN role in SecurityConfig
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final EventService eventService;
    private final BookingService bookingService;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final VendorService vendorService;

    @PostMapping("/events")
    public ResponseEntity<Event> createEvent(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(eventService.createEvent(request));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deactivateEvent(@PathVariable Long id) {
        eventService.deactivateEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> allBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/users")
    public ResponseEntity<?> allUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/categories")
    public ResponseEntity<?> allCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/vendors")
    public ResponseEntity<Vendor> createVendor(@Valid @RequestBody VendorRequest request) {
        return ResponseEntity.ok(vendorService.createVendor(request));
    }

    @DeleteMapping("/vendors/{id}")
    public ResponseEntity<Void> deactivateVendor(@PathVariable Long id) {
        vendorService.deactivateVendor(id);
        return ResponseEntity.noContent().build();
    }
}
