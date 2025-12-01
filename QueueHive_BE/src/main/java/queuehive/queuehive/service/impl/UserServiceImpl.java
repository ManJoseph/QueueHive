package queuehive.queuehive.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional
import queuehive.queuehive.domain.Company; // Import Company
import queuehive.queuehive.domain.User;
import queuehive.queuehive.dto.CreateUserRequest;
import queuehive.queuehive.dto.LoginResponse;
import queuehive.queuehive.dto.RegisterCompanyRequest; // Import RegisterCompanyRequest
import queuehive.queuehive.dto.UserDto;
import queuehive.queuehive.repository.CompanyRepository; // Import CompanyRepository
import queuehive.queuehive.repository.UserRepository;
import queuehive.queuehive.service.JwtService;
import queuehive.queuehive.service.UserService;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository; // Inject CompanyRepository
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserServiceImpl(UserRepository userRepository, CompanyRepository companyRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
    @Transactional
    public Optional<LoginResponse> registerCompany(RegisterCompanyRequest request) {
        // 1. Create User with COMPANY_ADMIN role
        User user = new User(
                request.getFullName(),
                request.getPhone(), // Use actual phone field from request
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                "COMPANY_ADMIN" // Hardcode role for company admin registration
        );
        User savedUser = userRepository.save(user);

        // 2. Create Company linked to this user's ID
        Company company = new Company(
                request.getCompanyName(),
                request.getCompanyDescription(),
                savedUser.getId(), // Link company to the owner's ID
                false, // New company is not yet approved
                request.getCompanyLocation(),
                request.getCompanyCategory()
        );
        Company savedCompany = companyRepository.save(company);

        // 3. Generate JWT and return LoginResponse
        String jwtToken = jwtService.generateToken(savedUser);
        return Optional.of(new LoginResponse(jwtToken, savedUser.getRole(), savedUser.getId(), savedCompany.getId()));
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
    }

    @Override
    public Optional<LoginResponse> login(queuehive.queuehive.dto.LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                String jwtToken = jwtService.generateToken(user);
                Long companyId = null;
                if ("COMPANY_ADMIN".equals(user.getRole())) {
                    companyId = companyRepository.findByOwnerId(user.getId())
                                               .map(Company::getId)
                                               .orElse(null); // Or throw an exception if a company admin must have a company
                }
                return Optional.of(new LoginResponse(jwtToken, user.getRole(), user.getId(), companyId));
            }
        }
        return Optional.empty();
    }
    
    @Override
    public UserDto getCurrentUser(Long userId) {
        return userRepository.findById(userId)
                .map(user -> new UserDto(user.getId(), user.getFullName(), user.getPhone(), user.getEmail(), user.getRole()))
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    @Override
    @Transactional
    public UserDto updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Update Full Name
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }

        // Update Phone Number
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            user.setPhone(request.getPhoneNumber());
        }

        // Handle Password Change
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new RuntimeException("Current password is required to change password.");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
                throw new RuntimeException("Current password does not match.");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }

        User updatedUser = userRepository.save(user);
        return new UserDto(updatedUser.getId(), updatedUser.getFullName(), updatedUser.getPhone(), updatedUser.getEmail(), updatedUser.getRole());
    }
}
