package com.chickiestudio.user.mapper;

import com.chickiestudio.user.dto.UserResponse;
import com.chickiestudio.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);
}
