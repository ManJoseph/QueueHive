package queuehive.queuehive.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateCompanyRequest {
    @NotBlank(message = "Company name cannot be blank")
    private String name;

    private String description; // Optional

    @NotBlank(message = "Company location cannot be blank")
    private String location;

    @NotBlank(message = "Company category cannot be blank")
    private String category;

    // Getters and Setters
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
