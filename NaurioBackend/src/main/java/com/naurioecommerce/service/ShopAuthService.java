package com.naurioecommerce.service;


import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.naurioecommerce.config.JwtTokenProvider;
import com.naurioecommerce.dto.ShopAuthResponse;
import com.naurioecommerce.dto.ShopDto;
import com.naurioecommerce.dto.Shops.ShopAuthRequest;
import com.naurioecommerce.dto.Shops.ShopRegister;
import com.naurioecommerce.entity.Shop;
import com.naurioecommerce.repository.ShopRepository;


@Service
public class ShopAuthService {
    

       private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final ShopRepository shopRepository;

    // @Autowired
    public ShopAuthService (AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider,
                       PasswordEncoder passwordEncoder,
                       ShopRepository shopRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.shopRepository = shopRepository;
    }

    public ShopAuthResponse login(ShopAuthRequest request) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
    );

    String token = jwtTokenProvider.generateToken(authentication, "shop");

    Shop shop = shopRepository.findByEmail(request.getEmail())
                  .orElseThrow(() -> new RuntimeException("Shop not found"));

    // Map to UserDTO
    ShopDto shopDto = new ShopDto(
        shop.getId(),
        shop.getname(),
        shop.getEmail(),
        shop.getRole() // or null if not available
    );

    return new ShopAuthResponse(token, shopDto);
}

    public ShopAuthResponse register(ShopRegister request) {
        Shop shop = new Shop();
        shop.setname(request.getname());
        shop.setEmail(request.getEmail());
        shop.setPassword(passwordEncoder.encode(request.getPassword()));
        shop.setRole("shop"); // default role


        shopRepository.save(shop);

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication, "shop");

        
        ShopDto shopDto = new ShopDto(
            shop.getId(),
            shop.getname(), 
            shop.getEmail(),
            shop.getRole()
        );
        
        return new ShopAuthResponse(token, shopDto);
    }

}
