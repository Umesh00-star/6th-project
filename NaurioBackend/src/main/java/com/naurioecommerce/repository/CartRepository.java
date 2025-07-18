package com.naurioecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.naurioecommerce.entity.CartItem;
import com.naurioecommerce.entity.Product;
import com.naurioecommerce.entity.User;


public interface CartRepository extends JpaRepository<CartItem, Long> {
    // List<CartItem> findByUser(User user);


    List<CartItem> findByUserId(Long userId);

     Optional<CartItem> findByUserAndProduct(User user, Product product); // ✅

    void deleteByUserId(Long userId);

}