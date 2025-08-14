package com.naurioecommerce.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopDto {
    
     private Long id;
     private String name;
    private String Shopname;
    private String Role;
    // @Column(length = 1000)
    // private String description;

     @Column(unique = true, nullable = false)
    private String email;

    // @Column(nullable = false)
   

    // private String contactNumber;

    // private String address;


    // Default no-argument constructor
    // public ShopDto() {}

    // Constructor with parameters
  
    public ShopDto(Long id, String name, String email, String Role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.Role = Role;
    }
     // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getname() {
        return name;
    }

    public void setFullName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return Role;
    }

    public void setRole(String role) {
        this.Role = role;
    }

    public String getShopname() {
        return Shopname;
    }

    public void setShopname(String shopname){
        this.Shopname = shopname;
    }

}
