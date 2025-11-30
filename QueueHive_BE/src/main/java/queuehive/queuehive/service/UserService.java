package queuehive.queuehive.service;

import queuehive.queuehive.dto.CreateUserRequest;
import queuehive.queuehive.dto.UserDto;

import java.util.Optional;

public interface UserService {
    UserDto registerUser(CreateUserRequest request);
    Optional<UserDto> findUserById(Long id);
    Optional<UserDto> findUserByEmail(String email);
    Optional<String> login(LoginRequest request);
}
