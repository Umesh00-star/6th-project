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

import com.naurioecommerce.Mappers.UserMapper;
import  com.naurioecommerce.dto.UserDto;
import com.naurioecommerce.entity.User;
import com.naurioecommerce.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    
    // @Autowired
    // private Role Role;


    // ✅ Get user by ID
    // @GetMapping("/{id}")
    // public ResponseEntity<User> getUserById(@PathVariable Long id) {
    //     return userRepository.findById(id)
    //         .map(ResponseEntity::ok)
    //         .orElse(ResponseEntity.notFound().build());
    // }
    

    @GetMapping("/{id}")
public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
    return userRepository.findById(id)
        .map(user -> ResponseEntity.ok(UserMapper.toDTO(user)))
        .orElse(ResponseEntity.notFound().build());
}


    // ✅ Update user profile (including role/shop)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User updatedUser) {

        return userRepository.findById(id)
            .map(existingUser -> {
                // Update basic user info
                existingUser.setFullName(updatedUser.getFullName());
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setPhone(updatedUser.getPhone());
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
                userRepository.save(existingUser);
                return ResponseEntity.ok(existingUser);
            })
            .orElse(ResponseEntity.notFound().build());
    }

      // Delete user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}

