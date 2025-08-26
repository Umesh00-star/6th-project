package com.naurioecommerce.Mappers;

import com.naurioecommerce.dto.ShopDto;
import com.naurioecommerce.entity.Shop;

public class ShopMapper {
    
    public static ShopDto toDTO(Shop shop) {
        ShopDto dto = new ShopDto();
        dto.setId(shop.getId());
        dto.setName(shop.getname());
        dto.setEmail(shop.getEmail());
        // Map other fields as needed
        return dto;
    }
}
