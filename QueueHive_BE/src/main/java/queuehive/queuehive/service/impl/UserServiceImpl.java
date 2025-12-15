package queuehive.queuehive.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional
import queuehive.queuehive.domain.Company; // Import Company
import queuehive.queuehive.domain.CompanyStatus;
import queuehive.queuehive.domain.User;
import queuehive.queuehive.dto.*;
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
        return new UserDto(savedUser.getId(), savedUser.getFullName(), savedUser.getPhone(), savedUser.getEmail(), savedUser.getRole(), savedUser.getCreatedAt());
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
                CompanyStatus.PENDING, // New company is not yet approved
                request.getCompanyLocation(),
                request.getCompanyCategory()
        );
        Company savedCompany = companyRepository.save(company);

        // 3. Generate JWT and return LoginResponse
        String jwtToken = jwtService.generateToken(savedUser);
        return Optional.of(new LoginResponse(jwtToken, savedUser.getRole(), savedUser.getId(), savedCompany.getId(), savedUser.getFullName()));
    }


    @Override
    public Optional<UserDto> findUserById(Long id) {
        return userRepository.findById(id)
                .map(user -> new UserDto(user.getId(), user.getFullName(), user.getPhone(), user.getEmail(), user.getRole(), user.getCreatedAt()));
    }

    @Override
    public Optional<UserDto> findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> new UserDto(user.getId(), user.getFullName(), user.getPhone(), user.getEmail(), user.getRole(), user.getCreatedAt()));
    }

    @Override
    public Optional<LoginResponse> login(queuehive.queuehive.dto.LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                
                if ("COMPANY_ADMIN".equals(user.getRole())) {
                    Company company = companyRepository.findByOwnerId(user.getId())
                                               .orElseThrow(() -> new RuntimeException("Company admin has no associated company."));
                    if (company.getStatus() != CompanyStatus.APPROVED) {
                        throw new RuntimeException("Company is not approved yet. Please wait for admin approval.");
                    }
                }

                String jwtToken = jwtService.generateToken(user);
                Long companyId = null;
                if ("COMPANY_ADMIN".equals(user.getRole())) {
                    companyId = companyRepository.findByOwnerId(user.getId())
                                               .map(Company::getId)
                                               .orElse(null); // Should not be null here due to the check above
                }
                return Optional.of(new LoginResponse(jwtToken, user.getRole(), user.getId(), companyId, user.getFullName()));
            }
        }
        return Optional.empty();
    }
    
    @Override
    public UserDto getCurrentUser(Long userId) {
        return userRepository.findById(userId)
                .map(user -> new UserDto(user.getId(), user.getFullName(), user.getPhone(), user.getEmail(), user.getRole(), user.getCreatedAt()))
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

        User updatedUser = userRepository.save(user);
        return new UserDto(updatedUser.getId(), updatedUser.getFullName(), updatedUser.getPhone(), updatedUser.getEmail(), updatedUser.getRole(), updatedUser.getCreatedAt());
    }

    @Override
    @Transactional
    public UserDto updateUserPassword(Long userId, UpdatePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
            throw new RuntimeException("Current password is required to change password.");
        }
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Current password does not match.");
        }
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new RuntimeException("New password cannot be blank.");
        }
        
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        User updatedUser = userRepository.save(user);
        return new UserDto(updatedUser.getId(), updatedUser.getFullName(), updatedUser.getPhone(), updatedUser.getEmail(), updatedUser.getRole(), updatedUser.getCreatedAt());
    }
}
