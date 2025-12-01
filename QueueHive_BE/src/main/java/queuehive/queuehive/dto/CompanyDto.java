package queuehive.queuehive.dto;

import java.time.LocalDateTime;

public class CompanyDto {
    private Long id;
    private String name;
    private String description; // Changed from category
    private Long ownerId;       // New field
    private Boolean approved;
    private LocalDateTime createdAt;

    public CompanyDto(Long id, String name, String description, Long ownerId, Boolean approved, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.approved = approved;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
