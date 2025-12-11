package queuehive.queuehive.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateCompanyRequest {
    @NotBlank(message = "Company name cannot be blank")
    private String name;

    private String description; // Description is optional

    @NotBlank(message = "Location cannot be blank")
    private String location;

    @NotBlank(message = "Category cannot be blank")
    private String category;

    @NotNull(message = "Owner ID cannot be null")
    private Long ownerId; // Assuming ownerId is a Long

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
}
