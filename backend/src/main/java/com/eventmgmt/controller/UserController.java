package com.eventmgmt.controller;

import com.eventmgmt.dto.UpdateProfileRequest;
import com.eventmgmt.dto.UserProfileResponse;
import com.eventmgmt.entity.User;
import com.eventmgmt.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    private User currentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private UserProfileResponse toResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getVillage(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {
        User user = currentUser(authentication);
        return ResponseEntity.ok(toResponse(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        User user = currentUser(authentication);

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setVillage(request.getVillage());

        userRepository.save(user);

        return ResponseEntity.ok(toResponse(user));
    }
}