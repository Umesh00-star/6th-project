package com.naurioecommerce.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.naurioecommerce.dto.OrderRequest;
import com.naurioecommerce.dto.OrderResponse;
import com.naurioecommerce.entity.Order;
import com.naurioecommerce.entity.Product;
import com.naurioecommerce.entity.User;
import com.naurioecommerce.repository.OrderRepository;
import com.naurioecommerce.repository.ProductRepository;
import com.naurioecommerce.repository.UserRepository;
import com.naurioecommerce.service.OrderService;

import jakarta.transaction.Transactional;



@RestController
@Transactional
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderService orderService;
 
 
    @PostMapping
public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
     System.out.println("Received order request: " + request);
    if (request.getUserId() == null) {
        return ResponseEntity.badRequest().body("User ID is required.");
    }
        
    if ((request.getProducts() == null || request.getProducts().isEmpty()) && request.getSingleProduct() == null) {
        return ResponseEntity.badRequest().body("At least one product is required.");
    }
    

    User user = userRepository.findById(request.getUserId()).orElse(null);
    if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
    }

    // Normalize to a list of product items
    List<OrderRequest.ProductOrderItem> items = new ArrayList<>();
    if (request.getProducts() != null && !request.getProducts().isEmpty()) {
        items.addAll(request.getProducts());
    } else if (request.getSingleProduct() != null) {
        items.add(request.getSingleProduct());
    }

    List<Order> savedOrders = new ArrayList<>();

    for (OrderRequest.ProductOrderItem item : items) {
        Product product = productRepository.findById(item.getProductId()).orElse(null);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product with ID " + item.getProductId() + " not found.");
        }
        System.out.println("Creating order for productId: " + item.getProductId());
System.out.println("Quantity: " + item.getQuantity() + ", TotalPrice: " + item.getTotalPrice());

        Order order = new Order(
            user,
         product, item.getQuantity(), item.getTotalPrice());
        order.setOrderId(UUID.randomUUID().toString());
        order.setCustomerName(user.getFullName());
        order.setStatus("Placed");
System.out.println("Saving order: " + order);
        // savedOrders.add(orderRepository.save(order));
         try {
        savedOrders.add(orderRepository.save(order));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Error saving order: " + e.getMessage());
    }
    }
    
        
    return ResponseEntity.ok(savedOrders);
    
}


    // @GetMapping("/{userId}")
    // public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
    //     User user = userRepository.findById(userId).orElse(null);
    //     if (user == null) {
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    //     }

    //     List<Order> orders = orderRepository.findByUser(user);
    //     return ResponseEntity.ok(orders);
    // }



    //  @GetMapping
    //  ("/my-orders")
    // public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
    //     if (userDetails == null) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    //     }

    //     try {
    //         List<Order> orders = orderService.getOrdersByEmail(userDetails.getUsername());
    //         return ResponseEntity.ok(orders);

    //     } catch (RuntimeException ex) {
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    //     }
    // }


    @GetMapping("/my-orders")
public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
    String email = userDetails.getUsername();
    List<Order> orders = orderService.getOrdersByEmail(email);

    List<OrderResponse> orderDTOs = orders.stream()
        .map(orderService::mapToDto)
        .collect(Collectors.toList());

    return ResponseEntity.ok(orderDTOs);
}

     

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        order.setStatus("Cancelled");
        orderRepository.save(order);
        return ResponseEntity.ok("Order cancelled successfully");
    }




}
