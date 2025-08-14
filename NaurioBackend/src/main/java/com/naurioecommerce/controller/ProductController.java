package com.naurioecommerce.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.naurioecommerce.dto.ProductDto;
import com.naurioecommerce.entity.Product;
import com.naurioecommerce.entity.Shop;
import com.naurioecommerce.repository.ProductRepository;
import com.naurioecommerce.repository.ShopRepository;
import com.naurioecommerce.service.FileStorageService;
import com.naurioecommerce.service.FileStorageService.FileInfo;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "${frontend.url:http://localhost:3000}")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Value("${product.image.base-url:http://localhost:8080/api/product/images/}")
    private String imageBaseUrl;

    @Autowired private ProductRepository productRepo;
    @Autowired private ShopRepository shopRepo;
    @Autowired private FileStorageService fileService;

    @PostMapping
    public ResponseEntity<?> create(
        @RequestParam String name,
        @RequestParam String description,
        @RequestParam double price,
        @RequestParam double weight,
        @RequestParam String category,
        @RequestParam("image") MultipartFile image,
        @RequestParam Long shopId
    ) {
        if (image.isEmpty()) return bad("Image file is required.");
        if (price <= 0 || weight <= 0) return bad("Price and weight must be positive.");

        Optional<Shop> shopOpt = shopRepo.findById(shopId);
        if (shopOpt.isEmpty()) return bad("Invalid user ID.");

        try {
            FileInfo fileInfo = fileService.storeFile(image);

            Product product = new Product();
            applyFromForm(product, name, description, price, weight, category);
            product.setImageUrl(fileInfo.imageUrl);
            product.setShop(shopOpt.get());
            productRepo.save(product);

            return ResponseEntity.ok(Map.of(
                "message", "Product uploaded successfully.",
                "product", ProductDto.fromEntity(product)
            ));
        } catch (IOException ex) {
            logger.error("Product creation failed", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "internal error: " + ex.getMessage()));
        }
    }

    @GetMapping("/images/{folder}/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String folder, @PathVariable String filename) {
        try {
            Path path = fileService.getFilePath(folder, filename);
            Resource res = new UrlResource(path.toUri());

            if (!res.exists() || !res.isReadable()) return ResponseEntity.notFound().build();

            String ct = Files.probeContentType(path);
            MediaType mediaType = (ct != null) ? MediaType.parseMediaType(ct) : MediaType.APPLICATION_OCTET_STREAM;

            return ResponseEntity.ok()
                                 .contentType(mediaType)
                                 .body(res);

        } catch (IOException ex) {
            logger.error("Serving image failed", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAll() {
        List<ProductDto> dtos = productRepo.findAll()
                                           .stream()
                                           .map(ProductDto::fromEntity)
                                           .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
       Optional<Product> optProduct = productRepo.findById(id);
if (optProduct.isPresent()) {
    return ResponseEntity.ok(ProductDto.fromEntity(optProduct.get()));
} else {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                         .body(Map.of("error", "Product not found"));
}
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDto>> getByCategory(@PathVariable String category) {
        List<ProductDto> dtos = productRepo.findByCategory(category)
                                           .stream()
                                           .map(ProductDto::fromEntity)
                                           .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<?> getByShop(@PathVariable Long shopId) {
        if (shopRepo.findById(shopId).isEmpty())
            return bad(Collections.emptyList());

        List<ProductDto> dtos = productRepo.findByShopId(shopId)
                                           .stream()
                                           .map(ProductDto::fromEntity)
                                           .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
        @PathVariable Long id,
        @RequestParam String name,
        @RequestParam String description,
        @RequestParam double price,
        @RequestParam double weight,
        @RequestParam String category,
        @RequestParam(value = "imageurl", required = false) MultipartFile image
    ) {
        var opt = productRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                               .body(Map.of("error", "Product not found"));

        Product product = opt.get();

        if (price <= 0 || weight <= 0) return bad("Price and weight must be positive.");

        applyFromForm(product, name, description, price, weight, category);

        if (image != null && !image.isEmpty()) {
            try {
                FileInfo fileInfo = fileService.storeFile(image);
                product.setImageUrl(fileInfo.imageUrl);
            } catch (IOException ex) {
                logger.error("Updating image failed", ex);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                     .body(Map.of("error", "Failed to upload image."));
            }
        }

        productRepo.save(product);
        return ResponseEntity.ok(Map.of(
            "message", "Product updated",
            "product", ProductDto.fromEntity(product)
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (productRepo.existsById(id)) {
            productRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Map.of("error", "Product not found"));
        }
    }

    // Utility methods

    private void applyFromForm(Product p,
                               String name,
                               String desc,
                               double price,
                               double weight,
                               String category) {
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(price);
        p.setWeight(weight);
        p.setCategory(category);
    }

    private ResponseEntity<Map<String, Object>> bad(Object msg) {
        return ResponseEntity.badRequest()
                             .body(Map.of("error", msg));
    }
}
