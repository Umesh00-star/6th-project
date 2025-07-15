package com.naurioecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.naurioecommerce.entity.CartItem;
import com.naurioecommerce.entity.User;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    // ✅ Correct method to find cart items for a specific user
    List<CartItem> findByUser(User user);
}
