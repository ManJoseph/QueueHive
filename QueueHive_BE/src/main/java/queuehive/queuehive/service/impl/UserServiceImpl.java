package queuehive.queuehive.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import queuehive.queuehive.domain.User;
import queuehive.queuehive.dto.CreateUserRequest;
import queuehive.queuehive.dto.UserDto;
import queuehive.queuehive.repository.UserRepository;
import queuehive.queuehive.service.UserService;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDto registerUser(CreateUserRequest request) {
        User user = new User(
                request.getFullName(),
                request.getPhone(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole()
        );
        User savedUser = userRepository.save(user);
        return new UserDto(savedUser.getId(), savedUser.getFullName(), savedUser.getPhone(), savedUser.getEmail(), savedUser.getRole());
    }

    @Override
    public Optional<UserDto> findUserById(Long id) {
        return userRepository.findById(id)
                .map(user -> new UserDto(user.getId(), user.getFullName(), user.getPhone(), user.getEmail(), user.getRole()));
    }

    @Override
    public Optional<UserDto> findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> new UserDto(user.getId(), user.getFullName(), user.getPhone(), user.getEmail(), user.getRole()));
    @Override
    public Optional<String> login(queuehive.queuehive.dto.LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                // In a real application, you would generate a JWT here.
                // For this task, we'll return a placeholder token.
                return Optional.of("placeholder-jwt-token-for-" + user.getEmail());
            }
        }
        return Optional.empty();
    }
}
