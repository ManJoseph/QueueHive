package queuehive.queuehive.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import queuehive.queuehive.dto.CreateUserRequest;
import queuehive.queuehive.dto.UserDto;
import queuehive.queuehive.service.UserService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnOkForValidRegistrationRequest() throws Exception {
        // Given
        CreateUserRequest validRequest = new CreateUserRequest();
        validRequest.setFullName("Test User");
        validRequest.setEmail("test@example.com");
        validRequest.setPhone("1234567890");
        validRequest.setPassword("password123");
        validRequest.setRole("CUSTOMER");

        when(userService.registerUser(any(CreateUserRequest.class)))
                .thenReturn(new UserDto(1L, "Test User", "1234567890", "test@example.com", "CUSTOMER"));

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk());
    }

    @Test
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
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
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
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}
