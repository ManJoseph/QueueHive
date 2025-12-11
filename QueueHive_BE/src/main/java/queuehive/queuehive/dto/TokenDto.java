package queuehive.queuehive.dto;

import java.time.LocalDateTime;

public class TokenDto {
    private Long id;
    private Long userId;
    private Long serviceId;
    private Integer tokenNumber;
    private String status;
    private LocalDateTime createdAt;
    private ServiceTypeDto serviceType;

    public TokenDto(Long id, Long userId, Long serviceId, Integer tokenNumber, String status, LocalDateTime createdAt, ServiceTypeDto serviceType) {
        this.id = id;
        this.userId = userId;
        this.serviceId = serviceId;
        this.tokenNumber = tokenNumber;
        this.status = status;
        this.createdAt = createdAt;
        this.serviceType = serviceType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public Integer getTokenNumber() {
        return tokenNumber;
    }

    public void setTokenNumber(Integer tokenNumber) {
        this.tokenNumber = tokenNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ServiceTypeDto getServiceType() {
        return serviceType;
    }

    public void setServiceType(ServiceTypeDto serviceType) {
        this.serviceType = serviceType;
    }
}
