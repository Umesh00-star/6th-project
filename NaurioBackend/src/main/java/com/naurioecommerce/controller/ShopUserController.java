package com.naurioecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.naurioecommerce.entity.Shop;
import com.naurioecommerce.repository.ShopRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/shops")
@CrossOrigin(origins = "http://localhost:3000")
public class ShopUserController {
     @Autowired
    private ShopRepository shopRepository;

    
    // @Autowired
    // private Role Role;


    // ✅ Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<Shop> getShopById(@PathVariable Long id) {
        return shopRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    

    // ✅ Update user profile (including role/shop)
    @PutMapping("/{id}")
    public ResponseEntity<Shop> updateShop(
            @PathVariable Long id,
            @Valid @RequestBody Shop updatedShop) {

        return shopRepository.findById(id)
            .map(existingShop -> {
                // Update basic user info
                existingShop.setname(updatedShop.getname());
                existingShop.setEmail(updatedShop.getEmail());
                // existingShop.setPhone(updatedShop.getPhone());
                // existingUser.setRole(updatedUser.getRole());

                // Handle shop role
                // if ("shop".equalsIgnoreCase(updatedUser.getRole()) && updatedUser.getShop() != null) {
                //     if (existingUser.getShop() == null) {
                //         existingUser.setShop(new Shop());
                //     }
                //     existingUser.getShop().setName(updatedUser.getShop().getName());
                //     existingUser.getShop().setDescription(updatedUser.getShop().getDescription());
                // } else {
                //     existingUser.setShop(null);  // Clear shop if role is not 'shop'
                // }

                // Save and return updated user
                shopRepository.save(existingShop);
                return ResponseEntity.ok(existingShop);
            })
            .orElse(ResponseEntity.notFound().build());
    }

      // Delete user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShop(@PathVariable Long id) {
        if (!shopRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("shop not found");
        }

        shopRepository.deleteById(id);
        return ResponseEntity.ok("Shop deleted successfully");
    }
}
