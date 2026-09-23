package com.eventmgmt.controller;

import com.eventmgmt.entity.Vendor;
import com.eventmgmt.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    // Public: anyone browsing the site can see decoration/event vendors, no login required
    @GetMapping("/public/all")
    public ResponseEntity<List<Vendor>> getAll() {
        return ResponseEntity.ok(vendorService.getAllActive());
    }

    @GetMapping("/public/by-city")
    public ResponseEntity<List<Vendor>> getByCity(@RequestParam String city) {
        return ResponseEntity.ok(vendorService.getByCity(city));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getById(id));
    }
}
