package com.naurioecommerce.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
import com.naurioecommerce.entity.Order;
import com.naurioecommerce.entity.Product;
import com.naurioecommerce.entity.User;
import com.naurioecommerce.repository.OrderRepository;
import com.naurioecommerce.repository.ProductRepository;
import com.naurioecommerce.repository.UserRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
        if (request.getUserId() == null || request.getProductId() == null) {
            return ResponseEntity.badRequest().body("User ID and Product ID are required.");
        }

        try {
            Optional<User> userOpt = userRepository.findById(request.getUserId());
            Optional<Product> productOpt = productRepository.findById(request.getProductId());

            if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            if (productOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");

            User user = userOpt.get();
            Product product = productOpt.get();

            Order order = new Order(user, product, request.getQuantity(), request.getTotalPrice());
            order.setOrderId(UUID.randomUUID().toString());
            order.setCustomerName(user.getFullName()); // Ensure getFullName() exists

            orderRepository.save(order);
            return ResponseEntity.ok(order);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to place order: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        List<Order> orders = orderRepository.findByUser(userOpt.get());
        return ResponseEntity.ok(orders);
    }

//     @GetMapping("/my-orders")
// public ResponseEntity<?> getMyOrders(Principal principal) {
//     String email = principal.getName(); // JWT username
//     System.out.println("Authenticated user email: " + principal.getName());

//     Optional<User> userOpt = userRepository.findByEmail(email);
//     if (userOpt.isEmpty()) {
//         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
//     }

//     List<Order> orders = orderRepository.findByUser(userOpt.get());
//     return ResponseEntity.ok(orders);
// }

@GetMapping("/my-orders")
public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
    if (userDetails == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized - userDetails is null");
    }

    String email = userDetails.getUsername(); // Assuming email is used as username
    System.out.println("Authenticated user email: " + email);

    Optional<User> userOpt = userRepository.findByEmail(email);
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    List<Order> orders = orderRepository.findByUser(userOpt.get());
    return ResponseEntity.ok(orders);
}

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        Order order = orderOpt.get();
        order.setStatus("Cancelled");
        orderRepository.save(order);

        return ResponseEntity.ok("Order cancelled successfully");
    }
}
