package com.naurioecommerce.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.naurioecommerce.entity.CartItem;
import com.naurioecommerce.entity.Product;
import com.naurioecommerce.entity.User;
import com.naurioecommerce.repository.CartRepository;
import com.naurioecommerce.repository.ProductRepository;
import com.naurioecommerce.repository.UserRepository;


@Service
public class CartService {
@Autowired
private CartRepository cartItemRepository;

@Autowired
private UserRepository userRepository;

@Autowired
private ProductRepository productRepository;

public void removeCartItem(Long userId, Long productId) {
    User user = userRepository.findById(userId).orElse(null);
    Product product = productRepository.findById(productId).orElse(null);

    if (user != null && product != null) {
        Optional<CartItem> item = cartItemRepository.findByUserAndProduct(user, product);
        item.ifPresent(cartItemRepository::delete);
    } else {
        System.out.println("❌ User or Product not found.");
    }
}


    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
