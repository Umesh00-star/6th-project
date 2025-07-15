package com.naurioecommerce.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.naurioecommerce.config.JwtTokenProvider;
import com.naurioecommerce.dto.AuthRequest;
import com.naurioecommerce.dto.AuthResponse;
import com.naurioecommerce.dto.RegisterRequest;
import com.naurioecommerce.dto.UserDto;
import com.naurioecommerce.entity.User;
import com.naurioecommerce.repository.UserRepository;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    // @Autowired
    public AuthService(AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider,
                       PasswordEncoder passwordEncoder,
                       UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public AuthResponse login(AuthRequest request) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
    );

    String token = jwtTokenProvider.generateToken(authentication);

    User user = userRepository.findByEmail(request.getEmail())
                  .orElseThrow(() -> new RuntimeException("User not found"));

    // Map to UserDTO
    UserDto userDto = new UserDto(
        user.getId(),
        user.getFullName(),
        user.getEmail(),
        user.getRole() // or null if not available
    );

    return new AuthResponse(token, userDto);
}

    public AuthResponse register(RegisterRequest request) {
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
         user.setRole("user"); // default role


        userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);

        
        UserDto userDto = new UserDto(
            user.getId(),
            user.getFullName(), 
            user.getEmail(),
            user.getRole()
        );
        
        return new AuthResponse(token, userDto);
    }
}
