package com.naurioecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.naurioecommerce.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // ✅ Find products by category (case-insensitive)
    List<Product> findByCategoryIgnoreCase(String category);

    // ✅ Optional: Search by name or description
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    // ✅ Optional: Get products sorted by latest
    List<Product> findAllByOrderByCreatedAtDesc();

    List<Product> findByUserId(Long userId);
}
