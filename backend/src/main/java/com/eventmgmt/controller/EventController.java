package com.eventmgmt.controller;

import com.eventmgmt.entity.Event;
import com.eventmgmt.entity.User;
import com.eventmgmt.repository.UserRepository;
import com.eventmgmt.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    // Public: anyone can browse all active events, no login required
    @GetMapping("/public/all")
    public ResponseEntity<List<Event>> getAllPublicEvents() {
        return ResponseEntity.ok(eventService.getAllActiveEvents());
    }

    // Authenticated: events tailored to the logged-in user's city/category preferences
    @GetMapping("/customized")
    public ResponseEntity<List<Event>> getCustomizedEvents(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(eventService.getCustomizedEventsForUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getById(id));
    }
}
