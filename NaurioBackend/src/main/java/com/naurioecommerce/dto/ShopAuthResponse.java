package com.naurioecommerce.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
// @AllArgsConstructor
public class ShopAuthResponse {
    
     private String token;
    private ShopDto shop;

    public ShopAuthResponse(String token, ShopDto shop) {
        this.token = token;
        this.shop = shop;
    }

    // Getters and setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public ShopDto getShop() {
        return shop;
    }

    public void setShop(ShopDto shop) {
        this.shop = shop;
    }

}
