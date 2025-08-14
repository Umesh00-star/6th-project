package com.naurioecommerce.dto;

import java.time.LocalDateTime;


public class OrderResponse {
    

    //  private Long id;
    private String orderId;
    private String customerName;
    private int quantity;
    private double totalPrice;
    private String status;
    private LocalDateTime orderDate;
    private ProductDTO product;

    // getters and setters

    public static class ProductDTO {
        private Long id;
        private String name;
        private String description;
        private double price;
        private String imageUrl;

        // getters and setters

         public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

          public String getname() {
        return name;
    }

    public void setname(String name) {
        this.name = name;
    }

     public String getdescription() {
        return description;
    }

    public void setdescription(String desc) {
        this.description = desc;
    }

     public double getprice() {
        return price;
    }

    public void setprice(double price) {
        this.price = price;
    }

    public String getimageUrl() {
        return imageUrl;
    }

    public void setimageUrl (String imageUrl) {
            this.imageUrl=imageUrl;
    }

    }

    
    //      public Long getId() {
    //     return id;
    // }

    // public void setId(Long id) {
    //     this.id = id;
    // }

    public String getorderId() {
        return orderId;
    }

    public void setorderId(String orderid) {
        this.orderId = orderid;
    }


     public String getName() {
        return customerName;
    }

    public void setName(String Name) {
        this.customerName = Name;
    }

    // public ProductDto getproduct() {
    //     return product;
    // }

    // public void setproduct(ProductDto product) {
    //     this.product = product;
    // }

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

            public String getstatus() {
               return status;
              }
             public void setstatus(String status) {
               this.status = status;
             }
              public LocalDateTime getorderDate() {
              return orderDate;
                }
                public void setorderDate(LocalDateTime orderDate) {
               this.orderDate = orderDate;
             }
             public ProductDTO getproduct() {
                return product;
             }

             public void setproduct (ProductDTO product) {
                 this.product = product;
             }


}



