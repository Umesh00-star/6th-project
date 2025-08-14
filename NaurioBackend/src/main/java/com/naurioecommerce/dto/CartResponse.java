package com.naurioecommerce.dto;



import lombok.Data;
import lombok.NoArgsConstructor;

 @Data
@NoArgsConstructor
// @AllArgsConstructor
public class CartResponse {

    private Long id;             // ID of this cart response (typically the cart item ID)
    private Long cartItemId;     // Optional, could be same as id or used for clarity
    private Long userId;         // ID of the user who owns the cart
    private ProductDto product;  // Full product info
    private int quantity;        // Quantity of the product in cart



    // public CartResponse() {}

    public CartResponse(Long id, Long cartItemId, Long userId, ProductDto product, int quantity) {
        this.id = id;
        this.cartItemId = cartItemId;
        this.userId = userId;
        this.product = product;
        this.quantity = quantity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCartItemId() {
        return cartItemId;
    }

    public void setCartItemId(Long cartItemId) {
        this.cartItemId = cartItemId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public ProductDto getProduct() {
        return product;
    }

    public void setProduct(ProductDto product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
