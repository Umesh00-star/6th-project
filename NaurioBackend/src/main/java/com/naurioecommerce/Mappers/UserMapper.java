package com.naurioecommerce.Mappers;

import com.naurioecommerce.dto.UserDto;
import com.naurioecommerce.entity.User;

public class UserMapper {
 

    public static UserDto toDTO(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        // Map other fields as needed
        return dto;
    }


}
