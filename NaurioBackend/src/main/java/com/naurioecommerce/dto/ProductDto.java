package com.naurioecommerce.dto;

import java.time.LocalDateTime;

public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private double price;
    private double weight;
    private String category;
    private String imageUrl;
    private LocalDateTime createdAt;

    // Optional: for frontend filtering by shop
    private Long userId;

    // Getters and Setters (or use Lombok below)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
 
   }


   public static ProductDto fromEntity(com.naurioecommerce.entity.Product product) {
    ProductDto dto = new ProductDto();
    dto.setId(product.getId());
    dto.setName(product.getName());
    dto.setDescription(product.getDescription());
    dto.setPrice(product.getPrice());
    dto.setWeight(product.getWeight());
    dto.setCategory(product.getCategory());
    dto.setImageUrl(product.getImageUrl());
    dto.setCreatedAt(product.getCreatedAt());
    dto.setUserId(product.getUser().getId());
    return dto;
}


}

