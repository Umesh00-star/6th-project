package com.naurioecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.naurioecommerce.dto.ShopAuthResponse;
import com.naurioecommerce.dto.Shops.ShopAuthRequest;
import com.naurioecommerce.dto.Shops.ShopRegister;
import com.naurioecommerce.service.ShopAuthService;



@RestController
@RequestMapping("/api/auth/shop")

public class ShopAuthController {

       private final ShopAuthService shopauthService;

    // @Autowired
    public ShopAuthController(ShopAuthService shopauthService) {
        this.shopauthService = shopauthService;
    }

    // @Autowired
    //  public Role role;

    // @PostMapping("/login")
    // public ResponseEntity<ShopAuthResponse> login(@RequestBody AuthRequest request) {
    //     return ResponseEntity.ok(shopauthService.login(request));
    //     System.out.println("Shop login returning: " + shop);

    // }


    @PostMapping("/login")
public ResponseEntity<ShopAuthResponse> login(@RequestBody ShopAuthRequest request) {
    ShopAuthResponse response = shopauthService.login(request);
    // System.out.println("Shop login returning: " + response.getShop());
    return ResponseEntity.ok(response);
    
}


    @PostMapping("/register")
    public ResponseEntity<ShopAuthResponse> register(@RequestBody ShopRegister request) {
         System.out.println("Register endpoint hit"); // Debug log
        return ResponseEntity.ok(shopauthService.register(request));
    }
}
