package com.naurioecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.naurioecommerce.dto.AuthRequest;
import com.naurioecommerce.dto.AuthResponse;
import com.naurioecommerce.dto.RegisterRequest;
import com.naurioecommerce.entity.Role;
import com.naurioecommerce.service.AuthService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // @Autowired
     public Role role;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    
}

