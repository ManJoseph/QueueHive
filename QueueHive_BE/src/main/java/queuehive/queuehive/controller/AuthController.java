package queuehive.queuehive.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import queuehive.queuehive.dto.CreateUserRequest;
import queuehive.queuehive.dto.LoginRequest;
import queuehive.queuehive.dto.LoginResponse;
import queuehive.queuehive.dto.RegisterCompanyRequest;
import queuehive.queuehive.dto.UserDto;
import queuehive.queuehive.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto newUser = userService.registerUser(request);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request)
                .map(loginResponse -> ResponseEntity.ok(loginResponse))
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/register-company")
    public ResponseEntity<LoginResponse> registerCompany(@Valid @RequestBody RegisterCompanyRequest request) {
        return userService.registerCompany(request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(400).build()); // Or a more specific error message/status
    }
}
