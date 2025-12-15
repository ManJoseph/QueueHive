package queuehive.queuehive.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import queuehive.queuehive.dto.CreateUserRequest;
import queuehive.queuehive.dto.UserDto;
import queuehive.queuehive.service.JwtService;
import queuehive.queuehive.service.UserService;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf; // Corrected import
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status; // Ensure this is present
import org.springframework.security.test.context.support.WithMockUser;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @Test
    @WithMockUser
    void shouldReturnOkForValidRegistrationRequest() throws Exception {
        // Given
        CreateUserRequest validRequest = new CreateUserRequest();
        validRequest.setFullName("Test User");
        validRequest.setEmail("test@example.com");
        validRequest.setPhone("1234567890");
        validRequest.setPassword("password123");
        validRequest.setRole("CUSTOMER");

        when(userService.registerUser(any(CreateUserRequest.class)))
                .thenReturn(new UserDto(1L, "Test User", "1234567890", "test@example.com", "CUSTOMER", LocalDateTime.now()));

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void shouldReturnBadRequestForInvalidRegistrationRequest_BlankEmail() throws Exception {
        // Given
        CreateUserRequest invalidRequest = new CreateUserRequest();
        invalidRequest.setFullName("Test User");
        invalidRequest.setEmail(""); // Invalid
        invalidRequest.setPhone("1234567890");
        invalidRequest.setPassword("password123");
        invalidRequest.setRole("CUSTOMER");

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void shouldReturnBadRequestForInvalidRegistrationRequest_ShortPassword() throws Exception {
        // Given
        CreateUserRequest invalidRequest = new CreateUserRequest();
        invalidRequest.setFullName("Test User");
        invalidRequest.setEmail("test@example.com");
        invalidRequest.setPhone("1234567890");
        invalidRequest.setPassword("123"); // Invalid - too short
        invalidRequest.setRole("CUSTOMER");

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}
