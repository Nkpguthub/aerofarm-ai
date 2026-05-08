package com.aeroponic.controller;

import com.aeroponic.model.User;
import com.aeroponic.repository.UserRepository;
import com.aeroponic.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.get("email"), req.get("password"))
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(req.get("email"));
        User user = userRepository.findByEmail(req.get("email")).orElseThrow();
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        return ResponseEntity.ok(Map.of(
            "accessToken", accessToken,
            "refreshToken", refreshToken,
            "role", user.getRole(),
            "email", user.getEmail()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        if (userRepository.existsByEmail(req.get("email"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }
        User user = User.builder()
            .email(req.get("email"))
            .passwordHash(passwordEncoder.encode(req.get("password")))
            .role(User.Role.FARMER)
            .active(true)
            .build();
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }
}
