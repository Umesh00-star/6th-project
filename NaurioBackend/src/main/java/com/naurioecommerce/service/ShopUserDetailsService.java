package com.naurioecommerce.service;


import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.naurioecommerce.entity.Shop;
import com.naurioecommerce.repository.ShopRepository;


@Service
public class ShopUserDetailsService implements UserDetailsService {

    @Autowired
    private ShopRepository shopRepository;

 

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Shop shop = shopRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException(" Shop User not found"));

        return org.springframework.security.core.userdetails.User
            .withUsername(shop.getEmail())
            .password(shop.getPassword())
            .authorities(Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + shop.getRole())))
            .build();
    }

}
