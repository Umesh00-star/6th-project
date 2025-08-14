package com.naurioecommerce.dto;

import java.util.List;

public class OrderRequest {

    private Long userId;
    private List<ProductOrderItem> products;
    private ProductOrderItem singleProduct;

    // === Inner static class for product-specific info ===
    public static class ProductOrderItem {
        
        private Long productId;
        private int quantity;
        private double totalPrice;
        

        // Optional fields for returning order info (if needed)
        // private Long orderId;
        // private String orderStatus;
        // private String orderDate;

        // === Getters and Setters ===
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

        // public Long getOrderId() {
        //     return orderId;
        // }
        // public void setOrderId(Long orderId) {
        //     this.orderId = orderId;
        // }

        // public String getOrderStatus() {
        //     return orderStatus;
        // }
        // public void setOrderStatus(String orderStatus) {
        //     this.orderStatus = orderStatus;
        // }

        // public String getOrderDate() {
        //     return orderDate;
        // }
        // public void setOrderDate(String orderDate) {
        //     this.orderDate = orderDate;
        // }
    }

    // === Getters and Setters ===

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<ProductOrderItem> getProducts() {
        return products;
    }
    public void setProducts(List<ProductOrderItem> products) {
        this.products = products;
    }

    public ProductOrderItem getSingleProduct() {
                    return singleProduct;
}

public void setSingleProduct(ProductOrderItem singleProduct) {
    this.singleProduct = singleProduct;
}

    @Override
    public String toString() {
        return "OrderRequest{" +
                "userId=" + userId +
                ", products=" + products +
                '}';
    }
}
