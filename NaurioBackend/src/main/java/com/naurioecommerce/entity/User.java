package com.naurioecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Full name of the user (display name)
    private String fullName;

    // Email used for login (must be unique)
    @Column(unique = true)
    private String email;

    // Password (should be hashed in real apps)
    private String password;

    // Contact number
    private String phone;

    // Role of the user: "user", "shop", or "admin"
private String Role;
    

    // One-to-One relationship with Shop (only if user opens a shop)
    // @OneToOne(cascade = CascadeType.ALL)
    // @JoinColumn(name = "shop_id", referencedColumnName = "id")
    // @JsonIgnore // Prevents recursion when serializing
    // private Shop shop;
    // One-to-Many relationship: One user (shop) can upload many products
    // // private Admin admin;
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    // @JsonIgnore // Prevents infinite recursion during JSON serialization
    // private List<Product> products;

    // public User() {
    //     this.products = new ArrayList<>();
    // }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }




    // public Shop getShop() {
    //     return shop;
    // }

    // public void setShop(Shop shop2) {
    //     this.shop = shop2;
    // }

    public String getRole(){
        return Role;
    }

    public void setRole(String role) {
        this.Role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    // public List<Product> getProducts() {
    //     return products;
    // }

    // public void setProducts(List<Product> products) {
    //     this.products = products;
    // }

    // public void setRole(String role2) {
       
    //     throw new UnsupportedOperationException("Unimplemented method 'setRole'");
    // }

 }
