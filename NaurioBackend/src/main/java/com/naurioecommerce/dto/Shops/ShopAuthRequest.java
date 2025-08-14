package com.naurioecommerce.dto.Shops;

public class ShopAuthRequest {
    
   private String email;
    private String password;


    // ✅ Add public getter methods
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // (Optional) You can also add setters or a constructor if needed
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
