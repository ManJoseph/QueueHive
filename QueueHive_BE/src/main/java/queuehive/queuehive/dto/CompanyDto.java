package queuehive.queuehive.dto;

import java.time.LocalDateTime;

public class CompanyDto {
    private Long id;
    private String name;
    private String category;
    private Boolean approved;
    private LocalDateTime createdAt;

    public CompanyDto(Long id, String name, String category, Boolean approved, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.category = category;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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
