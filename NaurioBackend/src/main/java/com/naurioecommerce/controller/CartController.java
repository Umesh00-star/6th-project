package com.naurioecommerce.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.naurioecommerce.dto.CartResponse;
import com.naurioecommerce.dto.ProductDto;
import com.naurioecommerce.entity.CartItem;
import com.naurioecommerce.entity.Product;
import com.naurioecommerce.entity.User;
import com.naurioecommerce.repository.CartRepository;
import com.naurioecommerce.repository.ProductRepository;
import com.naurioecommerce.repository.UserRepository;
import com.naurioecommerce.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    @Autowired
    public CartController(
            UserRepository userRepository,
            CartRepository cartRepository,
            ProductRepository productRepository,
            CartService cartService
    ) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.cartService = cartService;
    }

    // ✅ Get cart items by user
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartResponse>> getCart(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }

        List<CartItem> cartItems = cartRepository.findByUserId(userId);

       List<CartResponse> response = cartItems.stream()
        .map(item -> new CartResponse(
                item.getId(),                     // id
                item.getId(),                     // cartItemId (same as id)
                item.getUser().getId(),           // userId
                ProductDto.fromEntity(item.getProduct()), // product dto
                item.getQuantity()                // quantity
        ))
        .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // ✅ Add to cart
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity
    ) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Product> productOpt = productRepository.findById(productId);

        if (userOpt.isEmpty() || productOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid user or product ID");
        }

        User user = userOpt.get();
        Product product = productOpt.get();

        CartItem cartItem = cartRepository.findByUserAndProduct(user, product)
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + quantity);
                    return existing;
                })
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setUser(user);
                    newItem.setProduct(product);
                    newItem.setQuantity(quantity);
                    return newItem;
                });

        cartRepository.save(cartItem);
        return ResponseEntity.ok("Item added to cart");
    }

    // ✅ Update item quantity
    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long itemId, @RequestBody CartItem updatedItem) {
        return cartRepository.findById(itemId)
                .map(existing -> {
                    existing.setQuantity(updatedItem.getQuantity());
                    cartRepository.save(existing);
                    return ResponseEntity.ok("Quantity updated");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Remove cart item
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long cartItemId) {
        if (!cartRepository.existsById(cartItemId)) {
            return ResponseEntity.notFound().build();
        }
        cartRepository.deleteById(cartItemId);
        return ResponseEntity.ok("Item removed from cart");
    }

    // ✅ Clear all items from a user's cart
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared");
    }
}
