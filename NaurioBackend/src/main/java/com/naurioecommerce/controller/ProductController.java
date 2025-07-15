package com.naurioecommerce.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.naurioecommerce.entity.Product;
import com.naurioecommerce.entity.User;
import com.naurioecommerce.repository.ProductRepository;
import com.naurioecommerce.repository.UserRepository;
import com.naurioecommerce.service.FileStorageService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private FileStorageService fileService;

    /**
     * Upload product with image and associate it with a shop user
     */
    @PostMapping
    public ResponseEntity<?> uploadProduct(
        @RequestParam("name") String name,
        @RequestParam("description") String description,
        @RequestParam("price") double price,
        @RequestParam("weight") double weight,
        @RequestParam("category") String category,
        @RequestParam("image") MultipartFile image,
        @RequestParam("userId") Long userId
    ) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Image file is required."));
        }

        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID."));
        }

        try {
            String imageUrl = fileService.storeFile(image);

            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setWeight(weight);
            product.setCategory(category);
            product.setImageUrl(imageUrl);
            product.setUser(userOpt.get());

            productRepo.save(product);

            return ResponseEntity.ok(Map.of(
                "message", "Product uploaded successfully.",
                "product", product
            ));
        } catch (IOException e) {
            logger.error("Failed to store product image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Failed to save product: " + e.getMessage()));
        }
    }

    /**
     * Serve uploaded product images
     */
    @GetMapping("/images/{folder}/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String folder, @PathVariable String filename) {
        try {
            Path path = fileService.getFilePath(folder, filename);
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body(null);
            }

            String contentType = Files.probeContentType(path);
            if (contentType == null) contentType = "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (IOException e) {
            logger.error("Failed to serve image file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all products
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productRepo.findAll());
    }

    /**
     * Get product by its ID
     */
   @GetMapping("/{id}")
public ResponseEntity<?> getById(@PathVariable Long id) {
    Optional<Product> productOpt = productRepo.findById(id);

    if (productOpt.isPresent()) {
        return ResponseEntity.ok(productOpt.get());
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
           .body(Map.of("error", "Product not found"));
    }
}
    /**
     * Get products by category (e.g., kitchen, tech)
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productRepo.findByCategoryIgnoreCase(category));
    }

    /**
     * Get all products uploaded by a specific user (shop)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getProductsByUser(@PathVariable Long userId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Map.of("error", "User not found."));
        }

        List<Product> userProducts = productRepo.findByUserId(userId);
        return ResponseEntity.ok(userProducts);
    }
}
