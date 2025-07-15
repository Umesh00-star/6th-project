package com.naurioecommerce.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.naurioecommerce.entity.CartItem;
import com.naurioecommerce.entity.User;
import com.naurioecommerce.repository.CartRepository;
import com.naurioecommerce.repository.UserRepository;


@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000") 
public class CartController {
  @Autowired
  private CartRepository cartRepository;

  @Autowired
private UserRepository userRepository; // You'll need this


 @GetMapping("/cart/{userId}")
public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long userId) {
    Optional<User> user = userRepository.findById(userId);
    if (user.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    List<CartItem> items = cartRepository.findByUser(user.get());
    return ResponseEntity.ok(items);
}
  @PostMapping("/{userId}")
  public CartItem addToCart(@PathVariable Long userId, @RequestBody CartItem item) {
    item.setId(userId);
    return cartRepository.save(item);
  }

  @PutMapping("/{userId}/{itemId}")
  public CartItem updateCartItem(@PathVariable Long userId, @PathVariable Long itemId,
                                 @RequestBody CartItem item) {
    CartItem existing = cartRepository.findById(itemId).orElseThrow();
    existing.setQuantity(item.getQuantity());
    return cartRepository.save(existing);
  }

  @DeleteMapping("/{userId}/{itemId}")
  public void deleteFromCart(@PathVariable Long userId, @PathVariable Long itemId) {
    cartRepository.deleteById(itemId);
  }
}
