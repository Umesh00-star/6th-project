package com.naurioecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.naurioecommerce.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Find all products matching the specified category (case-insensitive).
     */
    List<Product> findByCategory(String category);

    /**
     * Search for products by matching text in name or description.
     */
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String nameKeyword,
        String descriptionKeyword
    );

    /**
     * Get all products sorted by newest first.
     */
    List<Product> findAllByOrderByCreatedAtDesc();

    /**
     * Get all products uploaded by a specific user.
     */
    List<Product> findByShopId(Long shopId);

    /**
     * Optional: Get latest N products (if needed for homepage or pagination)
     */
    List<Product> findTop10ByOrderByCreatedAtDesc();  // 🔥 Optional
}
