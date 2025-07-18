package com.naurioecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.naurioecommerce.entity.Order;
import com.naurioecommerce.entity.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Gets all orders placed by a specific user
    List<Order> findByUser(User user);

    // Optional: If needed, filter by userId instead of full user entity
    List<Order> findByUserId(Long userId);

    // Optional: Filter by user and status (e.g., for "Pending", "Cancelled")
    List<Order> findByUserAndStatus(User user, String status);

    // Optional: Order by date if your entity has LocalDateTime orderDate
    List<Order> findByUserOrderByOrderDateDesc(User user);
}
