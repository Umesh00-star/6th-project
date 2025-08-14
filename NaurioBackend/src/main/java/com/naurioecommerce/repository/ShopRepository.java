package com.naurioecommerce.repository;

import com.naurioecommerce.entity.Shop;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopRepository extends JpaRepository<Shop, Long> 
{
 Optional<Shop> findByEmail(String email);

    
}
