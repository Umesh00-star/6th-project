package com.naurioecommerce.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.naurioecommerce.dto.OrderRequest;
import com.naurioecommerce.dto.OrderResponse;
import com.naurioecommerce.entity.Order;
import com.naurioecommerce.entity.Product;
import com.naurioecommerce.entity.User;
import com.naurioecommerce.repository.OrderRepository;
import com.naurioecommerce.repository.ProductRepository;
import com.naurioecommerce.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Order> placeOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(() ->
            new RuntimeException("User not found with ID: " + request.getUserId())
        );

        List<Order> savedOrders = new ArrayList<>();

        for (OrderRequest.ProductOrderItem item : request.getProducts()) {
            Product product = productRepository.findById(item.getProductId()).orElseThrow(() ->
                new RuntimeException("Product not found with ID: " + item.getProductId())
            );

            Order order = new Order(
                user,
             product, item.getQuantity(), item.getTotalPrice());
            order.setOrderId(UUID.randomUUID().toString());
            order.setCustomerName(user.getFullName());
            order.setStatus("Placed");

            savedOrders.add(orderRepository.save(order));
        }

        return savedOrders;
    }

    public List<Order> getOrdersByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() ->
            new RuntimeException("User not found with ID: " + userId)
        );

        return orderRepository.findByUser(user);
    }

    public List<Order> getOrdersByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() ->
            new RuntimeException("User not found with email: " + email)
        );

        return orderRepository.findByUser(user);
    }

    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
            new RuntimeException("Order not found with ID: " + orderId)
        );

        order.setStatus("Cancelled");
        orderRepository.save(order);
    }



    public OrderResponse mapToDto(Order order) {
    OrderResponse dto = new OrderResponse();
    // dto.setId(order.getId());
    dto.setorderId(order.getOrderId());
    dto.setName(order.getCustomerName());
    dto.setQuantity(order.getQuantity());
    dto.setTotalPrice(order.getTotalPrice());
    dto.setstatus(order.getStatus());
    dto.setorderDate(order.getOrderDate());

    Product product = order.getProduct();
    OrderResponse.ProductDTO productDto = new OrderResponse.ProductDTO();
    productDto.setId(product.getId());
    productDto.setname(product.getName());
    productDto.setdescription(product.getDescription());
    productDto.setprice(product.getPrice());
    productDto.setimageUrl(product.getImageUrl());

    dto.setproduct(productDto);
    return dto;
}


   
}
