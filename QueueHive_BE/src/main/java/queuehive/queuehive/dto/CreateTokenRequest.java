package queuehive.queuehive.dto;

import jakarta.validation.constraints.NotNull;

public class CreateTokenRequest {
    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotNull(message = "Service ID cannot be null")
    private Long serviceId;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
}
