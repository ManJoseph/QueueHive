package queuehive.queuehive.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import queuehive.queuehive.dto.CreateUserRequest;
import queuehive.queuehive.dto.LoginRequest;
import queuehive.queuehive.dto.LoginResponse;
import queuehive.queuehive.dto.UserDto;
import queuehive.queuehive.service.UserService;

@RestController
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
                .map(token -> ResponseEntity.ok(new LoginResponse(token)))
                .orElse(ResponseEntity.status(401).build());
    }
}
