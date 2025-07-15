package com.naurioecommerce.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data // Lombok - generates getters, setters, equals, hashCode, toString
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic product details
    private String name;
    private String description;
    private double price;
    private double weight;
    private String category;

    // URL of uploaded product image
    private String imageUrl;

    // Timestamp when product is created (set automatically)
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Many products can belong to one user (shop owner)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Avoid recursion in JSON serialization
    private User user;

    // Automatically set the creation timestamp before saving
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }


    public void setName(String name) {
    this.name = name;
}

public void setDescription(String description) {
    this.description = description;
}

public void setPrice(double price) {
    this.price = price;
}

public void setWeight(double weight) {
    this.weight = weight;
}

public void setCategory(String category) {
    this.category = category;
}

public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
}

public void setUser(User user) {
    this.user = user;
}

}
