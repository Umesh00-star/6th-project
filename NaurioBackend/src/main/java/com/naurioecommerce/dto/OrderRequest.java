package com.naurioecommerce.dto;

public class OrderRequest {

    // === Fields required for order creation ===
    private Long userId;
    private Long productId;
    private int quantity;
    private double totalPrice;

    // === Optional: Fields useful for returning data ===
    private Long id;
    private String orderId;
    private String status;
    private String orderDate;

    // === Constructors ===
    public OrderRequest() {
    }

    public OrderRequest(Long userId, Long productId, int quantity, double totalPrice) {
        this.userId = userId;
        this.productId = productId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }

    public OrderRequest(Long id, String orderId, String status, String orderDate) {
        this.id = id;
        this.orderId = orderId;
        this.status = status;
        this.orderDate = orderDate;
    }

    // === Getters and Setters ===

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    // === Optional: toString (helps with logging/debugging) ===

    @Override
    public String toString() {
        return "OrderRequest{" +
                "userId=" + userId +
                ", productId=" + productId +
                ", quantity=" + quantity +
                ", totalPrice=" + totalPrice +
                ", id=" + id +
                ", orderId='" + orderId + '\'' +
                ", status='" + status + '\'' +
                ", orderDate='" + orderDate + '\'' +
                '}';
    }
}
