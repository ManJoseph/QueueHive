package queuehive.queuehive.service;

import queuehive.queuehive.dto.CreateUserRequest;
import queuehive.queuehive.dto.LoginRequest;
import queuehive.queuehive.dto.LoginResponse;
import queuehive.queuehive.dto.RegisterCompanyRequest; // Import RegisterCompanyRequest
import queuehive.queuehive.dto.UpdateUserRequest;
import queuehive.queuehive.dto.UserDto;

import java.util.Optional;

public interface UserService {
    UserDto registerUser(CreateUserRequest request);
    Optional<LoginResponse> registerCompany(RegisterCompanyRequest request); // New method
    Optional<UserDto> findUserById(Long id);
    Optional<UserDto> findUserByEmail(String email);
    Optional<LoginResponse> login(LoginRequest request);
    
    // New methods for user profile
    UserDto getCurrentUser(Long userId);
    UserDto updateUser(Long userId, UpdateUserRequest request);
}
