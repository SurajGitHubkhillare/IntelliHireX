package com.intellihirex.backend.controller;

import com.intellihirex.backend.dto.AuthResponse;
import com.intellihirex.backend.dto.LoginRequest;
import com.intellihirex.backend.dto.MessageResponse;
import com.intellihirex.backend.dto.RegisterRequest;
import com.intellihirex.backend.entity.Role;
import com.intellihirex.backend.entity.User;
import com.intellihirex.backend.repository.UserRepository;
import com.intellihirex.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            String jwt = jwtUtil.generateToken(userDetails);
            
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

            return ResponseEntity.ok(new AuthResponse(jwt, user.getEmail(), user.getRole().name(), user.getFullName()));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid email or password. Please try again."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if (signUpRequest.getEmail() == null || signUpRequest.getEmail().trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is required!"));
        }

        if (signUpRequest.getPassword() == null || signUpRequest.getPassword().trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Password is required!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail().trim().toLowerCase())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        String rawPassword = signUpRequest.getPassword();
        String userEmail = signUpRequest.getEmail().trim().toLowerCase();

        // Create new user's account
        User user = new User(
                userEmail,
                encoder.encode(rawPassword),
                signUpRequest.getFullName(),
                Role.ROLE_USER
        );

        userRepository.save(user);

        // Auto-authenticate newly registered user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userEmail, rawPassword));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt, user.getEmail(), user.getRole().name(), user.getFullName()));
    }
}
